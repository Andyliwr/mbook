
# !/usr/bin/env python
# -*-coding:utf-8*-
from urllib import request
from bs4 import BeautifulSoup as bs
import re
# 分词包
import jieba
import pandas as pd

resp = request.urlopen('https://movie.douban.com/nowplaying/hangzhou/')
html_data = resp.read().decode('utf-8')
soup = bs(html_data, 'html.parser')
nowplaying_movie = soup.find_all('div', id='nowplaying')
nowplaying_movie_list = nowplaying_movie[0].find_all('li', class_='list-item')
# print(nowplaying_movie_list[0])

# 获取电影列表
nowplaying_list = []
for item in nowplaying_movie_list:
    nowplaying_dict = {}
    nowplaying_dict['id'] = item['data-subject']
    for tag_img_item in item.find_all('img'):
        nowplaying_dict['name'] = tag_img_item['alt']
        nowplaying_list.append(nowplaying_dict)
# print(nowplaying_list)

# 获取影评
requrl = 'https://movie.douban.com/subject/' + \
    nowplaying_list[0]['id'] + '/comments?start=0&limit=20'
resp = request.urlopen(requrl)
comment_data = resp.read().decode('utf-8')
comment_soup = bs(comment_data, 'html.parser')
comment_div_list = comment_soup.find_all('div', class_='comment')
# print(comment_div_list)
each_comment_list = []
for item in comment_div_list:
    comment_string = item.find_all('p')[0].string
    if comment_string is not None:
        each_comment_list.append(comment_string)
# print(each_comment_list)

comments = ''
for k in range(len(each_comment_list)):
    comments = comments + (str(each_comment_list[k])).strip()
# print(comments)

pattern = re.compile(r'[\u4e00-\u9fa5]+')
filter_data = re.findall(pattern, comments)
cleaned_comments = ''.join(filter_data)

# print(cleaned_comments)
segment = jieba.lcut(cleaned_comments)
words_df = pd.DataFrame({'segment': segment})
# quoting=3全不引用
# stopword_url = "E:\\project\\graduationDesign\\py_reptile\\stopwords.txt"
stopword_url = "D:\\PROJECT\\graduationDesign\\py_reptile\\stopwords.txt"
stopwords = pd.read_csv(stopword_url, index_col=False,
                        quoting=3, sep="\t", names=['stopword'], encoding='utf-8')
words_df = words_df[~words_df.segment.isin(stopwords.stopword)]
print(words_df.head())
