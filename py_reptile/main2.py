# -*-coding: utf-8*-
from urllib import request
from bs4 import BeautifulSoup as bs
import re

GU_PIAO_LIST_URL = "http://quote.eastmoney.com/stocklist.html"
GU_PIAO_PRISE_URL = "http://stockpage.10jqka.com.cn/"

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
      temp_data['code'] = re.search(r'\((.*?)\)', item.string).groups()[0]
      result.append(temp_data)
      print(temp_data)
  return result

# 获取百度的价格
def getGupiaoPrise(url):
  result = []
  gu_piao_prise_res = request.urlopen(url)
  gu_piao_prise_html = gu_piao_prise_res.read().decode('gbk')
  trans_html = bs(gu_piao_prise_html, 'html.parser')
  # print(trans_html)
  gu_piao_prise_element = trans_html.find_all('div', id='hexm_curPrice')
  print(gu_piao_prise_element)
  # return gu_piao_prise_element[0].string

def main():
  lists = getGupiaoList()
  for item in lists:
    # 获取百度的价格
    print(getGupiaoPrise(GU_PIAO_PRISE_URL + item['code'] + '/'))

main()
