/**
 * 爬虫日志配置函数
 */
import path from 'path'
import log4js from 'log4js'

log4js.configure({
  appenders: {
    console: { type: 'console' },
    spider: {
      type: 'dateFile',
      filename: path.join(__dirname, '../logs/spider.log'),
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
    }
  },
  categories: {
    default: { appenders: ['console'], level: 'DEBUG' },
    spider: { appenders: ['spider', 'console'], level: 'DEBUG' }
  }
})

const logger = log4js.getLogger('spider')

export { logger }
