var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var eventproxy = require('eventproxy');
var config = require('./config');
var schedule = require('node-schedule');
var myAppTools = require('./tools/myAppTools');
var fs = require('fs');
var htmlToText = require('html-to-text');
var chinese_parseInt = require('./tools/chinese-parseint');
var connectDB = require('./connectDB/connectDB');
connectDB.configLog('networkReptile');

//日志相关
var log4js = require('log4js');
//config log
log4js.configure({
  appenders: [
    {type: 'console'},
    {type: 'file', filename: './log/networkReptile.log', category: 'networkReptile'}
  ]
});
var logger = log4js.getLogger('networkReptile');
// logger.setLevel('ERROR');

var firstSignUrls = [];
// var secondSign = config.websiteConfig[0].publishSite.baiduTieBa.secondSign;
// var firstSign = config.websiteConfig[0].publishSite.baiduTieBa.firstSign;
//用于记录前半部分，包括num和title
var finalDataPart = [];
//最终数据
var finalData = [];
//记录页面数的字段
var pageIndex = 2;
var ep = new eventproxy();

fs.exists('log', function (ret) {
  if (!ret) {
    logger.warn('日志目录不存在，正在为你创建....');
    fs.mkdir('log');
  }
  fs.open('./log/networkReptile.log', 'a', function (err, fd) {
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
  //rule.second =[0, 10, 20, 30, 40, 50];
  // rule.second = [0];
  rule.hour = 18;
  rule.minute = 0;
  rule.second = 0;
  // var j = schedule.scheduleJob(rule, function(){
  //     //每次执行前都清空firstSignUrls， finalDataPart，finalData
  //     firstSignUrls = [];
  //     finalDataPart = [];
  //     finalData = [];
  //
  //     var date = new Date();
  //     logger.info('今天是 '+date+'，每天18:00点更新.......');
  //     //更新数据库factionList
  //     connectDB.updateSectionList();
  //     getFactionSectionList();
  // });
  firstSignUrls = [];
  finalDataPart = [];
  finalData = [];
  //更新数据库factionList
  connectDB.updateSectionList();
  getFactionSectionList();
};

var getFactionSectionList = function () {
  //遍历config中录入的所有小说
  config.websiteConfig.forEach(function (item1) {
    logger.debug('现在爬取的小说是----《'+item1.factionName+'》');
    var OK = false;
    item1.allResources.forEach(function (item2) {
      logger.debug('爬取来源----'+item2.sourceName);
      //根据每个来源不同区别对待
      switch (item2.sourceName) {
        case '百度贴吧':
          getFactionListByUrl(item1.factionName, item2);
          break;
        case '爱下电子书':
          getFactionListByUrl(item1.factionName, item2);
          break;
        default:
          logger.warn('存在未知来源的小说，请更新爬虫!');
      }
    });
  });

};
//根据Url获取小说的所有章节
function getFactionListByUrl(factionName, factionInfo) {
  var dealedData = [];
  var readyToBroswerUrls = [];
  var getNewestFactionList = function (newestFactionNum) {
    //test, 爬去所有小说
    newestFactionNum = 1410;
    var totalNewestNum = 0;
    superagent.get(factionInfo.url)
      .end(function (err, res) {
        if (err) next(err);
        var $ = cheerio.load(res.text);
        $(factionInfo.firstSign).each(function (idx, element) {
          var $element = $(element);
          var firstSignID = $element.attr(factionInfo.inWhatAttr);
          //获取章节数和章标题
          //这里做个判断并不是置顶的就一定会是小说，这些我们要排除
          if ($element.text().indexOf('第') < 0 || $element.text().indexOf('章') < 0) {
            return true;
          }
          var reg = new RegExp('第.*章');
          var dealString = myAppTools.removeNaN(reg.exec($element.text())[0]);
          /*
           * 积累正则
           * var reg = new RegExp('第[一二三四五六七八九十]章');
           * dealString.slice(dealString.indexOf('第')+1, dealString.indexOf('章')).trim()
           * */
          var sectionNum = chinese_parseInt(dealString);
          if (sectionNum > parseInt(newestFactionNum)) {
            totalNewestNum++;
            var href = url.resolve(factionInfo.coreUrl, firstSignID);
            if (!myAppTools.isInArray(readyToBroswerUrls, href)) {
              readyToBroswerUrls.push(href);
            }
            var sectionTitle = $element.text().substring($element.text().indexOf('章') + 1).trim();
            var dealedDataElement = {
              sectionNum: sectionNum,
              sectionTitle: sectionTitle,
              url: href,
              sectionContent: '',
              upDateTime: new Date()
            };
            if (!myAppTools.isInArray(dealedData, dealedDataElement)) {
              dealedData.push(dealedDataElement);
            }
          }
        });
        if (totalNewestNum >= 1) {
          logger.info("从" + factionInfo.sourceName + "抓取到的最新的小说章节有" + totalNewestNum + "章。");
          getFactionContent(factionInfo, readyToBroswerUrls, dealedData);
        } else {
          logger.info(factionInfo.sourceName + "小说--《" + factionName + "》暂时没有更新~");
        }
      });
  };
  connectDB.getNewestSectionNum(factionName, factionInfo.sourceName, getNewestFactionList);
}

function getFactionContent(info, urls, objArray) {
  //当所有详情页页面访问返回才去调用存储的方法
  ep.after('getFactionContentEvent', urls.length, function (allEvents) {
    allEvents = allEvents.map(function (everyEvent) {
      //根据小说内容扒取sectionNum
      var reg = new RegExp('第.*章');
      if(reg.test(everyEvent)){
        var sectionNum = chinese_parseInt(myAppTools.removeNaN(reg.exec(everyEvent)[0]));
        logger.trace('爬取到小说第' + sectionNum + '章..');
        //对finalDataPart进行遍历，把内容填充进去，没拔到的留空
        for (var i = 0; i < objArray.length; i++) {
          if (sectionNum == objArray[i].sectionNum) {
            objArray[i].sectionContent = everyEvent;
          }
        }
      }else{
        logger.warn('在子页面中找不到章节数!');
      }
    });
    //至此爬虫执行完毕,将内容写进数据库

    logger.info('以下是爬到的章节的内容，以及他们的存储情况：');
    for (var j = 0; j < objArray.length; j++) {
      var jsonTemp = {
        factionName: '大主宰',
        sectionNum: objArray[j].sectionNum,
        sectionTitle: objArray[j].sectionTitle,
        sectionContent: objArray[j].sectionContent || '你到了没有知识的荒野~',
        sectionResource: '百度贴吧',
        recentUpdateTime: objArray[j].upDateTime
      };
      //调用存储函数
      connectDB.saveFaction(jsonTemp);
    }
  });

  urls.forEach(function (url) {
    //每次调用之前将pageIndex还原
    pageIndex = 2;
    getPageContent(info, url);
  });
}

//纯访问页面，为了递归调用
function getPageContent(info, sectionContentUrl) {
  superagent.get(sectionContentUrl)
    .on('error', function () {
      ep.emit('getFactionContentEvent', '你到了没有知识的荒野~');
    })
    .end(function (err, res) {
      //将获取小说内容的工作放到superagent之后
      if (err || !res.ok) {
        logger.warn('获取网址（' + sectionContentUrl + '）内容失败，请检查网络!');
        //报告爬取失败
        ep.emit('getFactionContentEvent', '你到了没有知识的荒野~');
      } else {
        logger.info('获取网址（' + sectionContentUrl + '）内容成功!');
        var $ = cheerio.load(res.text);
        switch (info.sourceName) {
          case '百度贴吧':
            var allTexts = [];
            $(info.secondSign).each(function (idx, element) {
              var $element = $(element);
              //把html转text
              var text = htmlToText.fromString($element.html(), {wordwrap: 130});
              allTexts.push(text);
            });
            var sectionContent = myAppTools.selectCorrect(allTexts);
            //如果获取不到当前小说章节内容，尝试往下一页获取
            if (sectionContent == '') {
              //如果url包含pn
              var pnIndex = info.url.indexOf('?pn=');
              if (pnIndex >= 0) {
                var newUrl = info.url.substring(0, pnIndex) + '?pn=' + pageIndex;
              } else {
                var newUrl = info.url + '?pn=' + pageIndex;
              }
              //为下一页做准备
              pageIndex++;
              getPageContent(newUrl);
            } else {
              //获取成功，把正确的文章内容传给after
              ep.emit('getFactionContentEvent', sectionContent);
            }
            break;
          case '爱下电子书':
            try {
              var sectionContent = htmlToText.fromString($(info.secondSign).html(), {wordwrap: 130});
              //如果获取不到当前小说章节内容，尝试往下一页获取
              if (!sectionContent) {
                logger.warn("从" + info.sourceName + "爬取到(" + sectionContentUrl + ")的内容为空！");
                ep.emit('getFactionContentEvent', '你到了没有知识的荒野~');
              } else {
                //获取成功，把正确的文章内容传给after
                ep.emit('getFactionContentEvent', sectionContent);
              }
            } catch (err) {
              logger.warn(err);
              ep.emit('getFactionContentEvent', '你到了没有知识的荒野~');
            }
            break;
          default:
            logger.warn('未知小说来源~');
        }
      }
    });
}
