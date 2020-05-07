/*
 * @Description: 获取代理ip地址，并将它们存入redis中
 * @Author: lidikang
 * @LastEditors: lidikang
 * @Date: 2019-03-19 23:33:51
 * @LastEditTime: 2019-05-08 15:17:21
 */
import request from 'superagent'
import requestProxy from 'superagent-proxy'
import userAgent from 'fake-useragent'
import redis from './redis'
import { logger } from './log'

// superagent添加使用代理ip的插件
requestProxy(request)

/**
 * 设置本地ip为白名单，防止芝麻代理关闭获取代理的接口
 */
function setLocalIpAddressWhiteList(ip) {
  return new Promise((resolve, reject) => {
    request
      .get('http://web.http.cnapi.cc/index/index/save_white?neek=67203&appkey=1c1c6c34947a721a0ba3c015aaa5a2fb&white=' + ip)
      .set({ 'User-Agent': userAgent() })
      .timeout({ response: 5000, deadline: 60000 })
      .end(async (err, res) => {
        if (err) {
          logger.error('add failed!', err.toString())
          resolve(false)
          return
        }

        try {
          const data = JSON.parse(res.text)
          console.log(data)
          if (data.code === 0) {
            logger.debug('add to white list success!')
            logger.debug('get proxy again...')
            // 重新获取ip
            getProxyIpAddress()
            resolve(true)
          }
        } catch (error) {
          resolve(false)
          logger.error('add failed! ' + error.toString())
        }
      })
  })
}

/**
 * 检查余额
 */
 export function checkAmount() {
  return new Promise((resolve, reject) => {
    request
      .get('web.http.cnapi.cc/index/index/get_my_balance?neek=67203&appkey=1c1c6c34947a721a0ba3c015aaa5a2fb')
      .set({ 'User-Agent': userAgent() })
      .timeout({ response: 5000, deadline: 60000 })
      .end(async (err, res) => {
        if (err) {
          resolve(false)
          logger.error('check amount failed!', err.toString())
          return
        }

        try {
          const data = JSON.parse(res.text)
          if (data.code === 0 && data.data && parseInt(data.data.balance, 10) > 0) {
            resolve(true)
          } else {
            logger.error('amount is not enough !')
            // 钱不够直接中断爬虫
            process.exit(0)
            resolve(false)
          }
        } catch (error) {
          logger.error('check amount failed! ' + error.toString())
          resolve(false)
        }
      })
  })

}

/**
 * 从redis随机读取一个ip作为代理
 */
 export async function getRandomProxyIp() {
  let ipStr = await redis.get('mbook_spider_proxy_ips') || ''
  let ipArr = ipStr.split(',')
  return ipArr[parseInt(Math.random(0, 1) * ipArr.length, 10)] || ''
}

/**
 * 从redis中移除不能使用的ip地址
 */
 export async function removeProxyIpFromRedis(address) {
  let ipStr = await redis.get('mbook_spider_proxy_ips') || ''
  let ipArr = ipStr.split(',')
  ipArr = ipArr.filter(item => item !== address)
  redis.set('mbook_spider_proxy_ips', ipArr.join(','))
  logger.debug('remove address ' + address + ' from redis')
}

/**
 * 向芝麻代理请求可用ip地址，并村存储到redis中
 */
export function getProxyIpAddress() {
  return new Promise(async (resolve, reject) => {
    let amountEnough = await checkAmount()
    // 请手动设置ip白名单，http://h.zhimaruanjian.com/wirte_list/#recharge
    // let setWhiteList = await setLocalIpAddressWhiteList(address.ip())
    let setWhiteList = true
    if (amountEnough && setWhiteList) {
      redis.del('mbook_spider_proxy_ips')
      request
        .get('http://webapi.http.zhimacangku.com/getip?num=20&type=2&pro=&city=0&yys=0&port=1&time=1&ts=0&ys=0&cs=0&lb=1&sb=0&pb=4&mr=1&regions=')
        .set({ 'User-Agent': userAgent() })
        .timeout({ response: 5000, deadline: 60000 })
        .end(async (err, res) => {
          if (err) {
            logger.error('proxy ip getting failed! ' + err.toString())
            resolve(false)
            return
          }
          try {
            const data = JSON.parse(res.text)
            if (data.code === 113) {
              const reg = /(\d+\.?)+/
              const ipTemp = data.msg.match(reg)
              if (ipTemp) {
                const ip = ipTemp[0]
                logger.debug(`add ${ip} to white list..`)
                setLocalIpAddressWhiteList(ip)
              }
              return
            } else if (data.code === 0) {
              const ips = data.data.map(item => `${item.ip}:${item.port}`)
              redis.set('mbook_spider_proxy_ips', ips.join(','))
              logger.debug('add proxy ip: ' + ips.join(', '))
            } else {
              logger.debug('proxy ip getting failed!', data.msg)
            }
            resolve(true)
          } catch (error) {
            logger.debug('proxy ip getting failed! ' + error.toString())
            resolve(false)
          }
        })
    } else {
      resolve(false)
    }
  })
}
