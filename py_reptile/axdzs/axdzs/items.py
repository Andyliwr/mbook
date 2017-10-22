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
    # define the fields for your item here like:
    name = scrapy.Field()
    index = scrapy.Field()
    link_url = scrapy.Field()
    img_url = scrapy.Field()
    author = scrapy.Field()
    des = scrapy.Field()
    type = scrapy.Field()
    update_status = scrapy.Field()
    recent_chapter = scrapy.Field()
    pass
