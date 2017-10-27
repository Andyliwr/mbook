# -*- coding: utf-8 -*-
import pymongo
import logging

class AxdzsPipeline(object):
    def process_item(self, item, spider):
        return item


# 搜索爬虫的处理器
class SearchPipeline(object):
    collection_name = 'spider_axdzs_search'

    def __init__(self, mongo_uri, mongo_db):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mongo_uri=crawler.settings.get('MONGO_URI'),
            mongo_db=crawler.settings.get('MONGO_DATABASE', 'items')
        )

    def open_spider(self, spider):
        logging.info('搜索爬虫正在启动中...')
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]
        logging.info('连接数据库 ' + self.mongo_uri + '/' + self.mongo_db + ' 成功!')

    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        if self.every(item['is_detail_page_ready']):
            self.db[self.collection_name].insert_one(dict(item))
            return item

    # 判断每个is_detail_page_ready是否都为True
    def every(self, list_obj):
        if isinstance(list_obj, list):
            count = 0
            for i in range(0, len(list_obj)):
                if(list_obj[i] == True):
                    count = count + 1
            if count == 10:
                return True
            else:
                return False
        else:
            logging.info('传入every的参数类型错误...')
        return False