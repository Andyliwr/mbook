import scrapy


class ChapterSpider(scrapy.Spider):
    name = "chapter"

    def __init__(self, faction_id=None, *args, **kwargs):
        super(ChapterSpider, self).__init__(*args, **kwargs)
        self.faction_id = faction_id  # 需要爬取章节的小说名

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
