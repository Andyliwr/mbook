# -*-coding: utf-8*-
from urllib import request
from bs4 import BeautifulSoup as bs
import re

GU_PIAO_LIST_URL = "http://quote.eastmoney.com/stocklist.html"
GU_PIAO_PRISE_URL = "https://gupiao.baidu.com/stock/"

# 获取股票列表函数


def getGupiaoList():
    result = []
    gu_piao_list_res = request.urlopen(GU_PIAO_LIST_URL)
    gu_piao_list_html = gu_piao_list_res.read().decode('gbk')
    trans_html = bs(gu_piao_list_html, 'html.parser')
    gu_piao_list_li = trans_html.select('#quotesearch li a')
    for item in gu_piao_list_li:
        temp_data = {}
        # 使用正则分析得到股票代码和股票名称
        temp_data['name'] = re.search(r"\w+", item.string).group()
        temp_data['code'] = re.search(
            r'com\/(.*?).html', item['href']).groups()[0]
        result.append(temp_data)
    return result

# 获取百度的价格
def getGupiaoPrise(code, url):
    gu_piao_prise_res = request.urlopen(url)
    gu_piao_prise_html = gu_piao_prise_res.read().decode('utf-8')
    trans_html = bs(gu_piao_prise_html, 'html.parser')
    prise = 0
    if len(trans_html.select(".price ._close")) > 0:
        prise = trans_html.select(".price ._close")[0].string
        print("爬取代码为[ " + code + " ]的股票的价格为 " + prise)
        return prise
    else:
        print("爬取代码为[ " + code + " ]的股票的价格失败")
        return prise


def main():
    lists = getGupiaoList()
    for i in range(len(lists)):
        # 获取百度的价格
        lists[i]['price'] = getGupiaoPrise(
            lists[i]['code'], GU_PIAO_PRISE_URL + lists[i]['code'] + '.html')
    return lists


print(main())
