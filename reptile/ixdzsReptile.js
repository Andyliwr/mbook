const myAppTools = require('./tools/myAppTools');
const connectDB = require('./connectDB/connectDB');

const express = require('express');
const superagent = require('superagent');
const cheerio = require('cheerio');
const eventproxy = require('eventproxy');
const url = require('url');
const config = require('./config');
const schedule = require('node-schedule');
const fs = require('fs');
const htmlToText = require('html-to-text');
const chinese_parseInt = require('./tools/chinese-parseint');
connectDB.configLog('ixdzsReptile');


//日志相关
var log4js = require('log4js');
//config log
log4js.configure({
  appenders: [
    {type: 'console'},
    {type: 'file', filename: './reptile/log/ixdzsReptile.log', category: 'ixdzsReptile'}
  ]
});
const logger = log4js.getLogger('ixdzsReptile');
const AXDZS_SEARCH_URL = 'http://zhannei.baidu.com/cse/search';
var everyTime = null; //初始化爬虫中使用的计时器

fs.exists('./reptile/log', function (ret) {
  if (!ret) {
    logger.warn('日志目录不存在，正在为你创建....');
    fs.mkdir('log');
  }
  fs.open('./reptile/log/ixdzsReptile.log', 'a', function (err, fd) {
    if (err) {
      console.log('创建日志文件失败！');
    } else {
      logger.info('\n\n\n');
      init();
    }
  });
});

var init = function () {
  var rule = new schedule.RecurrenceRule();
  //每天0点执行就是rule.hour =0;rule.minute =0;rule.second =0;
  rule.second = [0, 10, 20, 30, 40, 50];
  // rule.second = 0;
  // rule.hour =18;rule.minute =0;rule.second =0;
  // var j = schedule.scheduleJob(rule, function(){
  //     logger.info('今天是 ' + myAppTools.getToDayStr() + '，排行版每天18:00点更新.......');
  //     getQdFactionRankList();
  // });
  logger.info('今天是 ' + myAppTools.getToDayStr() + '，正在爬取小说章节.......');
  //before getting faction, update the factionList
  logger.info('正在更新List...');
  connectDB.updateSectionList('大主宰', '爱下电子书', 'notdone');
  startReptile('大主宰');
};
/**
 * package to a export function that can be used by other javascript file
 */
function startIxdzsReptile(factionName) {
  if (typeof factionName === 'string') {
    logger.info('今天是 ' + myAppTools.getToDayStr() + '，正在爬取小说章节.......');
    //before getting faction, update the factionList
    logger.info('正在更新List...');
    connectDB.updateSectionList(factionName, '爱下电子书');
    startReptile(factionName);
  } else {
    logger.warn('you must declare the faction name...');
  }
}
/**
 * 输入小说名字，开始爬取小说章节内容
 * @param factionNmme 小说名
 */
function startReptile(factionNmme) {
  if (typeof factionNmme == 'string') {
    doSearch(factionNmme);
  } else {
    logger.warn('startReptile传入参数错误');
  }
}

/**
 * 使用爱下电子书搜索小说名字
 * @param factionNmme 小说名
 */
function doSearch(factionName) {
  if (typeof factionName == 'string') {
    superagent.get(AXDZS_SEARCH_URL)
      .query({
        s: '7466980319800320338',
        loc: 'http://www.ixdzs.com/bsearch?q=' + encodeURI(factionName),
        width: 580,
        q: factionName,
        wt: 1,
        ht: 1,
        pn: 10,
        fpos: 2,
        rmem: 0,
        reg: ''
      })
      .end(function (err, res) {
        if (err) {
          logger.warn('使用爱下电子书搜索 ' + factionName + ' 失败');
          return;
        }
        var $ = cheerio.load(res.text);
        //小说展示页面的url
        var factionDisplayUrlArr = $('.result-list .result-item .result-item-title a').filter(function (index, element) {
          return $(element).attr('title') === factionName;
        });
        var factionDisplayUrl = '';
        if (factionDisplayUrlArr.length == 0) {
          //无结果
          logger.info('|' + factionName + '| 在 |爱下电子书| 无搜索结果');
        } else if (factionDisplayUrlArr.length == 1) {
          //正好有个结果项
          factionDisplayUrl = factionDisplayUrlArr[0].attribs.href;
        } else if (factionDisplayUrlArr.length > 1) {
          //有多个结果项，选取热度更加高的，继续访问详情页
          logger.info('搜索的 |' + factionName + '| 具有多个结果项，正在对比热度数据....');
          var compareHotEp = new eventproxy();
          compareHotEp.after('hasFinishedHot', factionDisplayUrlArr.length, function (allHots) {
            //排序，找到最大值
            allHots.sort(function (hot1, hot2) {
              return hot2.hot - hot1.hot;
            });
            factionDisplayUrl = factionDisplayUrlArr[allHots[0].idx].attribs.href;
            var factionUrl = factionDisplayUrl.replace(/www/, 'read');
            factionUrl = factionUrl.replace(/\/d/, '');
            logger.info('|' + factionName + '| 在 |爱下电子书| 的地址是：' + factionUrl);
            getFactionList(factionName, factionUrl, 'regular');
          });
          //遍历每个结果项去获取热度数据
          factionDisplayUrlArr.each(function (index, element) {
            var thisUrl = $(element).attr('href');
            superagent.get(thisUrl)
              .end(function (err, res) {
                if (err) {
                  logger.warn('获取 第' + index + '结果项 的热度数据失败，地址：' + thisUrl);
                  compareHotEp.emit('hasFinishedHot', {idx: index, hot: 0});
                  return;
                }
                var $ = cheerio.load(res.text);
                var hotValue = $('.d_info .d_ac li:nth-child(5)').text().replace(/热度：/, '');
                compareHotEp.emit('hasFinishedHot', {idx: index, hot: hotValue});
              });
          });
          return;
        }
        //转换小说的展示页面URL成为小说列表页的URL, 规律：http://www.ixdzs.com/d/133/133430/ ==> http://read.ixdzs.com/133/133430/
        var factionUrl = factionDisplayUrl.replace(/www/, 'read');
        factionUrl = factionUrl.replace(/\/d/, '');
        logger.info('|' + factionName + '| 在 |爱下电子书| 的地址是：' + factionUrl);
        getFactionList(factionName, factionUrl, 'regular');
      });
  } else {
    logger.warn('doSearch传入参数错误');
  }
}

/**
 * getFactionList需要区分是常规爬虫（负责小说更新），和并发爬虫（负责小说全部章节的爬取和初始化）
 * @param name 小说名字
 * @param url 小说列表url
 * @param reptileType 常规爬虫(regular), 并发爬虫(init)
 */
function getFactionList(name, url, reptileType) {
  superagent.get(url)
    .end(function (err, res) {
      if (err) {
        logger.warn('访问爱下电子书-- ' + name + ' 章节列表页失败');
        return;
      }
      var $ = cheerio.load(res.text);
      //这里放弃从章节标题中过滤得到章节数的做法，而是直接使用dom的顺序
      var allSections = []; //存储所有合法的章节的章节数、章节名、章节url
      $('.catalog .chapter > a').each(function (idx, element) {
        var $element = $(element);
        var aText = $element.text().trim();
        var sectionTitleReg = /(^\d+(\.)*( )*(第[零一二三四五六七八九十百千万0-9]+章))|(^第[零一二三四五六七八九十百千万0-9]+章)|(^[零一二三四五六七八九十百千万])|(^\d+(\.)*[^零一二三四五六七八九十百千万0-9])/igm;
        var matchResult = aText.match(sectionTitleReg);
        //当且仅当titile通过正则检测，并且章节数大于最新章节数，才会被加到待访问队列中
        if (matchResult != null && matchResult.length > 0) {
          allSections.push({
            sectionNum: chinese_parseInt(myAppTools.removeNaN(matchResult[0])),
            sectionTitle: aText.replace(sectionTitleReg, '').trim(),
            contentUrl: url + $element.attr('href')
          })
        } else {
          // console.log('非章节：'+aText);
        }
      });

      //sort the allSections
      allSections.sort(function(item1, item2){
        return item1.sectionNum - item2.sectionNum
      });

      //begin to get the content of every section
      if(reptileType === 'init'){
        //inder to reduce the press of mongodb，it can only get 100 sections at once
        //pack the array into small array
        var everyPosition = 0; //记录当前爬取到allSections的位置
        everyTime = setInterval(function () {
          var everyTimeArr = allSections.splice(everyPosition, 100);
          getFactionContent(name, everyTimeArr);
        }, 15 * 1000);
      }else if(reptileType === 'regular'){
        //常规爬虫需要根据最新章节去截取allSections数组，同时需要检测哪些章节是断层的，这些章节需要被加入到allSections里
        connectDB.getSlipSection(name, '爱下电子书', function(result){
          // console.log(idArr);
          var newSectionArr = allSections.slice((result.newest-1));
          //重新获取那些断层的章节，并在获取完成之后执行更新
          result.sections.forEach(function(item){

          });
          getFactionContent(name, newSectionArr, function(){
            logger.info('存储完毕，常规爬虫执行完毕, 再次执行列表更新...');
            connectDB.updateSectionList(name, '爱下电子书', 'done');
          });
        });
      }
    });
}

/**
 * 获取小说每章的内容的函数
 * @param name 小说名字
 * @param allSections 小说列表数组
 * @callback 爬取完的回调函数
 */
function getFactionContent(name, allSections, callback) {

  //开始爬取小说每章的内容
  var contentEp = new eventproxy();
  contentEp.after('hasFinishedContent', allSections.length, function (allContents) {
    if (allContents.length >= 1) {
      logger.info('从 |爱下电子书| 抓取到的 |' + name + '| 最新的小说章节有' + allContents.length + '章...');
      logger.info('正在存储这些获取到的数据至mongo...');
    } else {
      logger.info('爱下电子书' + '小说 |' + name + '| 暂时没有更新~');
    }

    //为了清晰的知道啥时候爬取完了，这里再次写一个ep
    var isFinishReptile = new eventproxy();
    isFinishReptile.after('hasFinishedReptile', allContents.length, function(saveResults){
      typeof callback === 'function' && callback();
    });

    //拼合数组
    allContents.forEach(function (item, index) {
      allSections[index].content = item;
      // delete allSections[index].contentUrl;
      var jsonTemp = {
        factionName: name,
        sectionNum: allSections[index].sectionNum,
        sectionTitle: allSections[index].sectionTitle,
        sectionContent: allSections[index].content || '你到了没有知识的荒野~',
        sectionResource: '爱下电子书',
        recentUpdateTime: myAppTools.formatDate(new Date())
      };
      //调用存储函数
      var saveCallback = function(result){
        isFinishReptile.emit('hasFinishedContent', result);
      }
      connectDB.saveFaction(jsonTemp, saveCallback);
    });
  });
  allSections.forEach(function (item) {
    superagent.get(item.contentUrl)
      .end(function (err, res) {
        if (err) {
          //这里可以考虑失败了是否再重新爬取一次
          logger.info('小说 |' + name + '| 获取第 ' + item.sectionNum + ' 章内容失败，地址：' + item.contentUrl);
          contentEp.emit('hasFinishedContent', '你来到了没有知识的荒原...');
          return;
        }
        var $ = cheerio.load(res.text);
        contentEp.emit('hasFinishedContent', htmlToText.fromString($('.content').html(), {wordwrap: 130}));
      })
  });
}

exports.startIxdzsReptile = startIxdzsReptile;