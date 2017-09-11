# -*-coding: utf-8*-
from urllib import request
from bs4 import BeautifulSoup as bs
import re

GU_PIAO_LIST_URL = "http://quote.eastmoney.com/stocklist.html"

# 获取股票列表函数
def getGupiaoList():
  result = []
  gu_piao_list_res = request.urlopen(GU_PIAO_LIST_URL)
  gu_piao_list_html = gu_piao_list_res.read().decode('gbk')
  trans_html = bs(gu_piao_list_html, 'html.parser')
  gu_piao_list_li = trans_html.select('#quotesearch li')
  for item in gu_piao_list_li:
      temp_data = {}
      temp_data['name'] = item.string
      # 使用正则分析得到股票代码和股票名称
      temp_data['name'] = re.compile('^(?=\))', item.string)
      temp_data['code'] = re.compile('(?<=\())\w+(?=\))$', item.string)
      result.append(temp_data)
  return result

print(getGupiaoList())
