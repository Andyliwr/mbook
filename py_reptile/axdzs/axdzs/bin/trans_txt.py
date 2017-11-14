# 下载txt文件，并且读取其中的章节存入数据库
# !/usr/bin/python
# encoding:utf-8
import urllib.request
import os
import zipfile
import linecache2
import re
import configparser
import pymongo
import datetime
import time

config = configparser.ConfigParser()
config.read('../config.ini')

CN_NUM = {
    u'〇': 0,
    u'一': 1,
    u'二': 2,
    u'三': 3,
    u'四': 4,
    u'五': 5,
    u'六': 6,
    u'七': 7,
    u'八': 8,
    u'九': 9,

    u'零': 0,
    u'壹': 1,
    u'贰': 2,
    u'叁': 3,
    u'肆': 4,
    u'伍': 5,
    u'陆': 6,
    u'柒': 7,
    u'捌': 8,
    u'玖': 9,

    u'貮': 2,
    u'两': 2,
}
CN_UNIT = {
    u'十': 10,
    u'拾': 10,
    u'百': 100,
    u'佰': 100,
    u'千': 1000,
    u'仟': 1000,
    u'万': 10000,
    u'萬': 10000,
    u'亿': 100000000,
    u'億': 100000000,
    u'兆': 1000000000000,
}


def cn2dig(zhcn):
    lcn = list(zhcn)
    unit = 0  # 当前的单位
    ldig = []  # 临时数组

    while lcn:
        cndig = lcn.pop()

        if cndig in CN_UNIT:
            unit = CN_UNIT.get(cndig)
            if unit == 10000:
                ldig.append('w')  # 标示万位
                unit = 1
            elif unit == 100000000:
                ldig.append('y')  # 标示亿位
                unit = 1
            elif unit == 1000000000000:  # 标示兆位
                ldig.append('z')
                unit = 1

            continue

        else:
            dig = CN_NUM.get(cndig)

            if unit:
                dig = dig * unit
                unit = 0

            ldig.append(dig)

    if unit == 10:  # 处理10-19的数字
        ldig.append(10)

    ret = 0
    tmp = 0

    while ldig:
        x = ldig.pop()

        if x == 'w':
            tmp *= 10000
            ret += tmp
            tmp = 0

        elif x == 'y':
            tmp *= 100000000
            ret += tmp
            tmp = 0

        elif x == 'z':
            tmp *= 1000000000000
            ret += tmp
            tmp = 0

        else:
            tmp += x

    ret += tmp
    return ret


class TransTxt:
    def __init__(self, download_url, zip_name_id):
        super(TransTxt, self).__init__()
        self.download_url = download_url
        self.zip_name_id = zip_name_id
        self.do_download()

    def schedule(self, a, b, c):
        # a:已经下载的数据块
        # b:数据块的大小
        # c:远程文件的大小
        per = 100.0 * a * b / c
        if per > 100:
            per = 100
            print("Downloaded: %.2f%%" % per)
            print('Downloaded finished!')
        else:
            print("Downloaded: %.2f%%" % per)

    def unzip(self, url):
        print('Unpacking ...')
        zfile = zipfile.ZipFile(url, 'r')
        for filename in zfile.namelist():
            data = zfile.read(filename)
            file = open(os.path.join('../download/', self.zip_name_id + '.txt'), 'w+b')
            file.write(data.decode('GBK').encode('utf-8'))
            file.close()
        print('Unpack success！')
        self.parse()

    def parse(self):
        print('Reading txt document ...')
        lines = linecache2.getlines(os.path.join('../download/', self.zip_name_id + '.txt'))
        line_num_arr = []
        chapter_arr = []
        for i in range(0, len(lines)):
            reg = re.search(r'(^\d+(\.)*( )*(第[零一二三四五六七八九十百千万0-9]+章))|(^第[零一二三四五六七八九十百千万0-9]+章)|(^[零一二三四五六七八九十百千万]+章)|(^\d+(\.)*[^零一二三四五六七八九十百千万0-9]+章)\S+\n', lines[i], re.M | re.I)
            if reg:
                num_raw = lines[i][int(reg.span()[0]):int(reg.span()[1])].replace('第', '').replace('章', '')
                if re.search(r'\d+', num_raw, re.I|re.M):
                    num_true = num_raw
                else:
                    num_true = cn2dig(num_raw)
                chapter_arr.append({
                    'num': num_true,
                    'name': lines[i][int(reg.span()[1]):(len(lines[i]) - 1)].strip(),
                    'content': None
                })
                line_num_arr.append(i)
        # 数组去重
        for k in range(0, len(chapter_arr)-1):
            chapter_arr[k]['content'] = ''.join(lines[(line_num_arr[k]+1): line_num_arr[k+1]])
        # print(chapter_arr)
        print('Read and parse txt success!')
        self.save_db(chapter_arr)


    def do_download(self):
        print('Download faction ...')
        local = os.path.join('../download/', self.zip_name_id + '.zip')
        urllib.request.urlretrieve(self.download_url, local, self.schedule)
        self.unzip(local)

    def save_db(self, data):
        print('Connecting database ...')
        client = pymongo.MongoClient('mongodb://' + config['MONGODB']['host'] + ':' + config['MONGODB']['port'])
        db = client[config['MONGODB']['db']]
        print('Connected database success!')
        db['faction_content'].insert({
            'faction_id': self.zip_name_id,
            'create_time': datetime.datetime.now(),
            'list': data
        })
        print('Save faction contents success!')


if __name__ == '__main__':
    transTxt = TransTxt('http://www.ixdzs.com/down/66485_1?c=480415316', '5a094bbe66573948248705a8')
    # transTxt.do_download()
    # transTxt.unzip()
    # transTxt.parse()
