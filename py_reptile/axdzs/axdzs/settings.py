# -*- coding: utf-8 -*-

# Scrapy settings for axdzs project
#
# For simplicity, this file contains only settings considered important or
# commonly used. You can find more settings consulting the documentation:
#
#     http://doc.scrapy.org/en/latest/topics/settings.html
#     http://scrapy.readthedocs.org/en/latest/topics/downloader-middleware.html
#     http://scrapy.readthedocs.org/en/latest/topics/spider-middleware.html

BOT_NAME = 'axdzs'

SPIDER_MODULES = ['axdzs.spiders']
NEWSPIDER_MODULE = 'axdzs.spiders'
# 使用robot协议的站点，只需要我们的爬虫不遵守该协议，就可以了，但是对于防止爬虫爬取，站点还有检查请求头、检查ip等等手段，还需要其他的相应处理。
ROBOTSTXT_OBEY = False
# 使用的用户代理
USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36'
# 为了减少CPU使用率(及记录log存储的要求), 在生产环境中进行通用爬取时您不应该使用 DEBUG log级别。
LOG_LEVEL = 'DEBUG'
# 禁止cookies能减少CPU使用率及Scrapy爬虫在内存中记录的踪迹，提高性能。
COOKIES_ENABLED = False
#  当进行通用爬取时，一般的做法是保存重定向的地址，并在之后的爬取进行解析。 这保证了每批爬取的request数目在一定的数量， 否则重定向循环可能会导致爬虫在某个站点耗费过多资源。
REDIRECT_ENABLED = False
# 如果网站提供了原本只有ajax获取到的数据的纯HTML版本，AjaxCrawlMiddleware能帮助您正确地爬取
# AJAXCRAWL_ENABLED = True
# 是否启用下载器统计信息收集
DOWNLOADER_STATS = True
# 日志编码
LOG_ENCODING = 'GBK'

# 程序相关的设定

# 站点根目录
ROOT_URL = 'http://www.ixdzs.com'
# 所有章节页的根目录
READ_ROOT_URL = 'http://read.ixdzs.com'
