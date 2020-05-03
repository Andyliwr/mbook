# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class AxdzsItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass


class SearchItem(scrapy.Item):
    name = scrapy.Field()  # 书籍名称
    index = scrapy.Field()  # 书籍排序值
    link_url = scrapy.Field()  # 书籍详情页地址
    all_chapter_url = scrapy.Field()  # 书籍所有章节页地址
    img_url = scrapy.Field()  # 书籍图片地址
    author = scrapy.Field()  # 书籍地址
    des = scrapy.Field()  # 书籍描述
    classification = scrapy.Field()  # 书籍分类
    update_status = scrapy.Field()  # 更新状态： 连载、完结
    newest_chapter = scrapy.Field()  # 最新章节
    total_words = scrapy.Field()  # 总字数
    update_time = scrapy.Field()  # 最近更新时间
    download_url = scrapy.Field()  # txt下载地址
    hot_value = scrapy.Field()  # 热度值，用来排序搜索结果
    is_detail_page_ready = scrapy.Field() # 标志位，用来标记书籍详情是否爬取完毕
    pass


class ChapterItem(scrapy.Item):
    name = 1
