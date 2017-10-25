### python多线程代码
```
import threading
import time


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


for i in range(0, len(self.item['link_url'])):
  detail_thread = DetailThread(self, self.detail_thread_lock, self.item['name'][i], self.get_book_detail, self.item['link_url'][i])
  self.detail_threads.append(detail_thread)
  detail_thread.start()
  detail_thread.join()
logging.debug('OK')
```

## python读取配置文件
```
import configparser


config = configparser.ConfigParser()
config.read('../config.ini')
print(config)

```

## 格式化日志
```
import logging
import datetime
import os
from scrapy.utils.log import configure_logging

# 格式化日志
now = datetime.datetime.now()
configure_logging(install_root_handler=False)
logging.info(os.getcwd())
logging.basicConfig(
    filename= ,
    format='%(asctime)s [%(name)s] %(levelname)s: %(message)s',
    level=logging.INFO
)
```