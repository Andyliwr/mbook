import scrapy
import logging
import datetime
from axdzs.items import SearchItem
import re
import threading
import time

AREA = re.compile(r"制片国家/地区:</span> (.+?)<br>")


class SearchSpider(scrapy.Spider):
    name = "search"

    def __init__(self, name=None, *args, **kwargs):
        super(SearchSpider, self).__init__(*args, **kwargs)
        self.search_name = name  # 搜索值
        self.item = None  # 搜索得到的结果
        self.detail_threads = []  # 爬取详情页的数组
        self.detail_threads_sign = []  # 爬取详情页的进度标志
        self.detail_thread_lock = threading.Lock()  # 读取details的线程锁
        self.details = []  # 详情页数组

    def start_requests(self):
        url = 'http://zhannei.baidu.com/cse/search?s=7466980319800320338&loc={}/bsearch?q={}&width=580&q={' \
              '}&wt=1&ht=1&pn=10&fpos=2&rmem=0&reg='.format(self.settings['ROOT_URL'], self.search_name,
                                                            self.search_name)
        logging.debug('搜索地址: ' + url)
        yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        item = SearchItem()
        try:
            # save file
            now = datetime.datetime.now()
            with open('tmp/search/' + now.strftime('%Y-%m-%d-%H:%M:%S') + '.html', 'wb') as f:
                f.write(response.body)
            f.close()
            # parser html
            item['name'] = response.css('.result-item-title a::attr(title)').extract()
            item['link_url'] = response.css('.result-item-title>a::attr(href)').extract()
            item['img_url'] = response.css('.result-game-item-pic-link>img::attr(src)').extract()
            item['author'] = response.css('.result-game-item-info .result-game-item-info-tag:nth-child(1)>a::text').extract()
            for i in range(0, len(item['author'])):
                item['author'][i] = item['author'][i].strip()
            item['type'] = response.css('.result-game-item-info .result-game-item-info-tag:nth-child(2)>a::text').extract()
            item['update_status'] = response.css('.result-game-item-info .result-game-item-info-tag:nth-child(3)>a::text').extract()
            item['recent_chapter'] = response.css('.result-game-item-info .result-game-item-info-tag:nth-child(4)>a::text').extract()
            item['des'] = response.css('.result-item .result-game-item-detail>p').extract()
            for i in range(0, len(item['des'])):
                item['des'][i] = item['des'][i].strip().replace('\n', '').replace('<p class="result-game-item-desc">','').replace('</p>', '').replace('<em>', '').replace('</em>', '').replace(' ', '')

        except Exception as error:
            logging.warning('搜索错误: ')
            logging.warning(error)

        else:
            logging.info('搜索 ' + self.search_name + ' 成功!')
            self.item = item
            self.select_one()
            yield item

    # 根据热度值排序，并继续获取小说字数
    def select_one(self):
        for i in range(0, len(self.item['link_url'])):
            detail_thread = DetailThread(self, self.detail_thread_lock, self.item['name'][i], self.get_book_detail, self.item['link_url'][i])
            self.detail_threads.append(detail_thread)
            detail_thread.start()
            detail_thread.join()

        while len(self.detail_threads_sign) < len(self.item['link_url']):
            pass
        logging.debug('OK')
        pass

    # 爬取书籍详情页
    def get_book_detail(self, thread_self, url, is_ok):
        logging.debug(url)
        yield scrapy.Request(url=url, callback=self.parse_book_detail)

    # 解析详情页
    def parse_book_detail(self, response):
        logging.debug(response.body)
        self.detail_threads_sign.append('ok')
        pass


class DetailThread(threading.Thread):  # 继承父类threading.Thread
    def __init__(self, search_spider, thread_lock, name, handler, url):
        threading.Thread.__init__(self)
        self.search_spider = search_spider  # 类 SearchSpider
        self.thread_lock = thread_lock  # 线程锁
        self.name = name  # 线程名称
        self.handler = handler  # 需要执行的函数
        self.url = url  # 详情页url

    def run(self):  # 把要执行的代码写到run函数里面 线程在创建后会直接运行run函数
        self.thread_lock.acquire()
        logging.debug("开始爬取 " + self.name + '的书籍详情页...')
        logging.debug("结束爬取 " + self.name + '的书籍详情页...')
        self.thread_lock.release()


