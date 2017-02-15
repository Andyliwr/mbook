var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var url = require('url');
var config = require('./config');
var schedule = require('node-schedule');
var myAppTools = require('./tools/myAppTools');
var fs = require('fs');
var htmlToText = require('html-to-text');
var chinese_parseInt = require('./tools/chinese-parseint');
var connectDB = require('./connectDB/connectDB');
//日志相关
var log4js = require('log4js');
//config log
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'log/networkReptile.log', category: 'networkReptile' }
  ]
});
var logger = log4js.getLogger('networkReptile');

var app = express();
var QI_DIAN_WEB = 'http://r.qidian.com/';
var ZONG_HENG_WEB = 'http://book.zongheng.com/rank.html';
var ALL_TYPES = [
    {standard: '汇总', engName: 'total', qidian: '全部分类', zongheng: '全本'},
    {standard: '玄幻', engName: 'xuanhuan', qidian: '玄幻', zongheng: '奇幻·玄幻'},
    {standard: '言情', engName: 'yanqing', qidian: '都市', zongheng: '都市·娱乐'},
    {standard: '武侠', engName: 'wuxia', qidian: '武侠', zongheng: '武侠·仙侠'},
    {standard: '历史', engName: 'lishi', qidian: '历史', zongheng: '历史·军事'},
    {standard: '科幻', engName: 'kehuan', qidian: '科幻', zongheng: '科幻·游戏'}
];
//最终数据
var finalData = [];

fs.exists('log', function(ret){
  if(!ret){
    logger.warn('日志目录不存在，正在为你创建....');
    fs.mkdir('log');
  }
  fs.open('log/rankReptile.log', 'a', function (err, fd) {
    if(err){
      console.log('创建日志文件失败！');
    }else{
      // logger.info('\n\n\n\n\n');
      init();
    }
  });
});

var init = function(){
    var rule = new schedule.RecurrenceRule();
    //每天0点执行就是rule.hour =0;rule.minute =0;rule.second =0;
    // rule.second =[0, 10, 20, 30, 40, 50];
    // rule.second = 0;
    // rule.hour =18;rule.minute =0;rule.second =0;
    // var j = schedule.scheduleJob(rule, function(){
    //     logger.info('今天是 '+date+'，排行版每天18:00点更新.......');
    //     //更新数据库factionList
    //     getFactionRankList();
    // });
    logger.info('今天是 '+myAppTools.getToDayStr()+'，排行版每天18:00点更新.......');
    //更新数据库factionList
    getFactionRankList();
};

function getFactionRankList(){
    //爬取起点小说网的排行榜
    var QzEp = new eventproxy();
    QzEp.all('hasFinishedQidian', function(qiDianData){
        //爬取纵横小说网的排行榜
        superagent.get(ZONG_HENG_WEB)
            .end(function (err, res) {
                if (err) {
                    next(err);
                }
                var $ = cheerio.load(res.text);
                console.log($('.rank-header .type-list').html());
            });
    });
    superagent.get(QI_DIAN_WEB)
        .end(function (err, res) {
            if (err) {
                next(err);
            }
            var $ = cheerio.load(res.text);
            var QdEp = eventproxy();
            QdEp.after('getQdRank', ALL_TYPES.length, function(allQdRankData){
                console.log(ALL_TYPES);
                console.log('所有事件均已返回');
            });
            ALL_TYPES.forEach(function(item, index, array){
                $('.rank-header .type-list p a').each(function(index, element){
                    var $element = $(element);
                    if(item.qidian == $element.text()){
                        item.qd_url = 'http://r.qidian.com/?chn=' + $element.data('chanid');
                        superagent.get(item.qd_url)
                            .end(function(err, res){
                                if(err) next(err);
                                var $ = cheerio.load(res.text);
                                $('h3.wrap-title').each(function(index , element){
                                    var $element = $(element);
                                    if($element.text().indexOf('推荐票') >= 0){
                                        item.qdRank = [];
                                        $element.parent().next().children('.book-list:first-child').children('ul').children('li').each(function(index, ele){
                                            var $ele = $(ele);
                                            if(index == 0){
                                                item.qdRank.push({
                                                    num: index+1,
                                                    factionName: $ele.children('.book-wrap').children('.book-info').children('h4').children('a').text(),
                                                    author: '',
                                                    headImg: '',
                                                    url: $ele.children('.book-wrap').children('.book-info').children('h4').children('a').attr('href')
                                                });
                                            }else{
                                                item.qdRank.push({
                                                    num: index+1,
                                                    factionName: $ele.children('.name-box').children('a').text(),
                                                    author: '',
                                                    headImg: '', //nodejs根据图片链接将图片存储到本地，并且返回一个可访问链接
                                                    url: $ele.children('.name-box').children('a').attr('href')
                                                });
                                            }
                                            //继续爬取作者名称、des和headImg
                                            superagent.get(item.qdRank[index].url)
                                                .end(function(err, res){
                                                    if(err){}
                                                });
                                        });
                                    }
                                });
                                QdEp.emit('getQdRank', $('h3.wrap-title').text());
                            });
                    }
                });
            });
        });
};
// getFactionSectionList();

var getFactionContent = function(){

    ep.after('getFactionContentEvent', firstSignUrls.length, function(allEvents){
        allEvents = allEvents.map(function(everyEvent){
            //根据小说内容扒取sectionNum
            var reg = new RegExp('第.*章');
            var sectionNum = chinese_parseInt(myAppTools.removeNaN(reg.exec(everyEvent)[0]));
            logger.trace('爬取到小说第'+sectionNum+'章..');
            //对finalDataPart进行遍历，把内容填充进去，没拔到的留空
            for(var i=0; i<finalDataPart.length; i++){
                if(sectionNum == finalDataPart[i].sectionNum){
                    finalDataPart[i].sectionContent = everyEvent;
                }
            }

        });
        //至此爬虫执行完毕,将内容写进数据库

        logger.info('以下是爬到的章节的内容，以及他们的存储情况：');
        for(var j=0; j<finalDataPart.length; j++){
            var jsonTemp = {
                factionName: '大主宰',
                sectionNum: finalDataPart[j].sectionNum,
                sectionTitle: finalDataPart[j].sectionTitle,
                sectionContent: finalDataPart[j].sectionContent,
                sectionResource: '百度贴吧',
                recentUpdateTime: finalDataPart[j].upDateTime
            };
            //调用存储函数
            connectDB.saveFaction(jsonTemp);
        }
    });

    firstSignUrls.forEach(function(firstSignUrl){
        //每次调用之前将pageIndex还原
        pageIndex = 2;
        getPageContent(firstSignUrl);
    });
};

//纯访问页面，为了递归调用
var getPageContent = function(url){
    var allTexts = [];
    superagent.get(url)
        .end(function(err, res){
            logger.info('获取网址（'+url+'）内容成功!');
            //将获取小说内容的工作放到superagent之后
            var $ = cheerio.load(res.text);
            $(secondSign).each(function(idx, element){
                var $element = $(element);
                //把html转text
                var text = htmlToText.fromString($element.html(), {wordwrap: 130});
                allTexts.push(text);
            });
            var sectionContent = myAppTools.selectCorrect(allTexts);
            //如果获取不到当前小说章节内容，尝试往下一页获取
            if(sectionContent == ''){
                //如果url包含pn
                var pnIndex = url.indexOf('?pn=');
                if(pnIndex >= 0){
                    var newUrl = url.substring(0, pnIndex)+'?pn='+ pageIndex;
                }else{
                    var newUrl = url+'?pn='+ pageIndex;
                }
                //为下一页做准备
                pageIndex++;
                getPageContent(newUrl);
            }else{
                //获取成功，把正确的文章内容传给after
                ep.emit('getFactionContentEvent', sectionContent);
            }
        });
};
