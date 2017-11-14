# -*- coding: utf-8 -*-
import pymongo
import logging
import datetime

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
            tmpList = []
            for i in range(0, len(item['name'])):
                tmpList.append({
                    'name': item['name'][i],
                    'link_url': item['link_url'][i],
                    'all_chapter_url': item['all_chapter_url'][i],
                    'img_url': item['img_url'][i],
                    'author': item['author'][i],
                    'des': item['des'][i],
                    'classification': item['classification'][i],
                    'update_status': item['update_status'][i],
                    'newest_chapter': item['newest_chapter'][i],
                    'total_words': item['total_words'][i],
                    'update_time': item['update_time'][i],
                    'download_url': item['download_url'][i],
                    'hot_value': item['hot_value'][i],
                    'is_content_in_db': False  # 是否爬取过章节信息
                })

            logging.info('所有搜索结果:')
            logging.info(tmpList)
            max_hot_value = 0
            max_hot_index = 0
            for i in range(0, len(tmpList)):
                current_hot_value = int(tmpList[i]['hot_value'])
                if current_hot_value > max_hot_value:
                    max_hot_index = i
                    max_hot_value = current_hot_value

            final = {
                'name': tmpList[max_hot_index]['name'],
                'link_url': tmpList[max_hot_index]['link_url'],
                'all_chapter_url': tmpList[max_hot_index]['all_chapter_url'],
                'img_url': tmpList[max_hot_index]['img_url'],
                'author': tmpList[max_hot_index]['author'],
                'des': tmpList[max_hot_index]['des'],
                'classification': tmpList[max_hot_index]['classification'],
                'update_status': tmpList[max_hot_index]['update_status'],
                'newest_chapter': tmpList[max_hot_index]['newest_chapter'],
                'total_words': tmpList[max_hot_index]['total_words'],
                'update_time': tmpList[max_hot_index]['update_time'],
                'download_url': tmpList[max_hot_index]['download_url'],
                'hot_value': tmpList[max_hot_index]['hot_value'],
                'create_time': datetime.datetime.now()
            }
            logging.info('最终搜索结果:')
            logging.info(final)

            result = {
                'search_str': spider.search_name,
                'search_results': tmpList,
                'final_result': final,
                'search_time': datetime.datetime.now()
            }
            self.db[self.collection_name].insert(result)
            # 将最佳匹配结果写入数据库
            self.db['faction_list'].insert(final)
            logging.info('搜索结果已经存入数据库...')
            return result

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