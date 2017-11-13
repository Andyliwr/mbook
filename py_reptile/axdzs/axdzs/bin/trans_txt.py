# 下载txt文件，并且读取其中的章节存入数据库
# !/usr/bin/python
# encoding:utf-8
import urllib.request
import os
import zipfile


class TransTxt:
    def __init__(self, download_url, zip_name_id):
        super(TransTxt, self).__init__()
        self.download_url = download_url
        self.zip_name_id = zip_name_id

    def schedule(self, a, b, c):
        # a:已经下载的数据块
        # b:数据块的大小
        # c:远程文件的大小
        per = 100.0 * a * b / c
        if per > 100:
            per = 100
            print("Downloaded: %.2f%%" % per)
            print('Downloaded finished!')
            self.parse()
        else:
            print("Downloaded: %.2f%%" % per)

    def unzip(self):
        zfile = zipfile.ZipFile(os.path.join('../download/', self.zip_name_id + '.zip'), 'r')
        for filename in zfile.namelist():
            data = zfile.read(filename)
            file = open(os.path.join('../download/', self.zip_name_id + '.txt'), 'w+b')
            file.write(data)
            file.close()

    def parse(self):
        fo = open(os.path.join('../download/', self.zip_name_id + '.txt'), 'r')
        print(fo.read(10000))
        pass

    def do_download(self):
        local = os.path.join('../download/', self.zip_name_id + '.zip')
        urllib.request.urlretrieve(self.download_url, local, self.schedule)



if __name__ == '__main__':
    transTxt = TransTxt('http://www.ixdzs.com/down/66485_1?c=480415316', '5a094bbe66573948248705a8')
    # transTxt.do_download()
    transTxt.unzip()
    transTxt.parse()
