#!/usr/bin/env python
#-*-coding:utf-8*-
# 爬虫主程序
from urllib import request
resp = request.urlopen('https://movie.douban.com/nowplaying/hangzhou/')
html_data = resp.read().decode('utf-8')
print(html_data)