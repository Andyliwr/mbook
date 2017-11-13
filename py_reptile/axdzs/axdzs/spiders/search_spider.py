import scrapy
from axdzs.items import SearchItem
import re
import logging


class SearchSpider(scrapy.Spider):
    name = "search"

    def __init__(self, name=None, *args, **kwargs):
        super(SearchSpider, self).__init__(*args, **kwargs)
        self.search_name = name  # 搜索值
        self.item = None  # 搜索得到的结果
        self.final = None  # 爬虫搜索得到的最终结果

    def start_requests(self):
        url = 'http://zhannei.baidu.com/cse/search?s=7466980319800320338&loc={}/bsearch?q={}&width=580&q={}&wt=1&ht=1&pn=10&fpos=2&rmem=0&reg='.format(self.settings['ROOT_URL'], self.search_name, self.search_name)
        logging.info('搜索地址: ' + url)
        yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        item = SearchItem()
        try:
            # save file
            # now = datetime.datetime.now()
            # with open(os.path.join('./logs/search/', now.strftime('%Y-%m-%d-%H:%M:%S') + '.html'), 'wb') as f:
            #     f.write(response.body)
            # f.close()
            # parser html
            item['name'] = response.css('.result-item-title a::attr(title)').extract()
            item['link_url'] = response.css('.result-item-title>a::attr(href)').extract()

            item['all_chapter_url'] = []
            item['index'] = []
            for i in range(0, len(item['link_url'])):
                item['index'].append(i + 1)
                tmp_match_result = re.search(r'\/\d+\/\d+\/', item['link_url'][i]).group(0)
                if tmp_match_result:
                    item['all_chapter_url'].append(self.settings['READ_ROOT_URL'] + tmp_match_result)
                else:
                    item['all_chapter_url'].append('')

            item['img_url'] = response.css('.result-game-item-pic-link>img::attr(src)').extract()

            item['author'] = response.css('.result-game-item-info .result-game-item-info-tag:nth-child(1)>a::text').extract()
            for i in range(0, len(item['author'])):
                item['author'][i] = item['author'][i].strip()

            item['classification'] = response.css('.result-game-item-info .result-game-item-info-tag:nth-child(2)>span:nth-child(2)::text').extract()
            item['update_status'] = response.css('.result-game-item-info .result-game-item-info-tag:nth-child(3)>span:nth-child(2)::text').extract()
            item['newest_chapter'] = response.css('.result-game-item-info .result-game-item-info-tag:nth-child(4)>a::text').extract()

            item['des'] = response.css('.result-item .result-game-item-detail>p').extract()
            for i in range(0, len(item['des'])):
                item['des'][i] = item['des'][i].strip().replace('\n', '').replace('<p class="result-game-item-desc">', '').replace('</p>', '').replace('<em>', '').replace('</em>', '').replace(' ', '')

            item['total_words'] = []
            item['update_time'] = []
            item['download_url'] = []
            item['hot_value'] = []
            item['is_detail_page_ready'] = []
            for i in range(0, len(item['link_url'])):
                item['total_words'].append('')
                item['update_time'].append('')
                item['download_url'].append('')
                item['hot_value'].append(0)
                item['is_detail_page_ready'].append(False)

            # 爬去书籍详情页
            for i in range(0, len(item['link_url'])):
                yield scrapy.Request(url=item['link_url'][i], meta={'item': item, 'index': i}, callback=self.parse_book_detail)

        except Exception as error:
            logging.warning('搜索错误: ')
            logging.warning(error)

        else:
            logging.info('搜索 ' + self.search_name + ' 成功!')
            self.item = item
            # yield item

    # 根据热度值排序，并继续获取小说字数
    def parse_book_detail(self, response):
        item = response.meta['item']
        index = response.meta['index']
        if response.status == 200 and any(response.body):
            try:
                # parser html
                item['total_words'][index] = response.css('.d_ac>ul>li:nth-child(3)::text').extract()[0]
                item['update_time'][index] = response.css('.d_ac>ul>li:nth-child(6)::text').extract()[0]
                item['download_url'][index] = self.settings['ROOT_URL'] + response.css('#txt_down>a:first-child::attr(href)').extract()[0]
                item['hot_value'][index] = response.css('.d_ac>ul>li:nth-child(5)::text').extract()[0]

            except Exception as error:
                logging.info('获取 ' + item['name'][index] + ' 详情错误:')
                logging.warning(error)

            else:
                logging.info('获取 ' + item['name'][index] + ' 详情成功!')
        else:
            logging.info('获取 ' + item['name'][index] + ' 详情错误，得到的页面为空...')

        # 即使不是所有的详情页均返回成功，也将爬取完成标记置为True
        item['is_detail_page_ready'][index] = True
        self.item = item
        # 只有yield执行了，这个数据才到达pipeline，然后由pipeline整理后存入数据库
        yield self.item
        pass

    # 爬虫关闭的回调
    def close(self, reason):
        logging.info(reason)
        pass
