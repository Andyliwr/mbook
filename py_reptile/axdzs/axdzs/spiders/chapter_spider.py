import scrapy


class ChapterSpider(scrapy.Spider):
    name = "chapter"

    def __init__(self, faction_name=None, is_just_update=None, *args, **kwargs):
        super(ChapterSpider, self).__init__(*args, **kwargs)
        self.faction_name = faction_name  # 需要爬取章节的小说名
        self.is_just_update = is_just_update  # 是否只需更新，如果值为True，将只爬取最新章节，如果值为False将重新爬取所有章节

    def start_requests(self):
        urls = [
            'http://quotes.toscrape.com/page/1/',
            'http://quotes.toscrape.com/page/2/'
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        page = response.url.split('/')[-2]
        filename = 'quotes-%s.html' % page
        with open(filename, 'wb') as f:
            f.write(response.body)
        self.log('Saved file %s' % filename)
