var express = require('express');
var superagent = require('superagent');
var sjsonapify = require('superagent-jsonapify'); //superagent的json格式化插件
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var ProgressBar = require('progress');
var url = require('url');
var config = require('./config');
var schedule = require('node-schedule');
var myAppTools = require('./tools/myAppTools');
var fs = require('fs');
var htmlToText = require('html-to-text');
var chinese_parseInt = require('./tools/chinese-parseint');
var connectDB = require('./connectDB/connectDB');
connectDB.configLog('ixdzsReptile');


//日志相关
var log4js = require('log4js');
//config log
log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: 'log/ixdzsReptile.log', category: 'ixdzsReptile' }
    ]
});
var logger = log4js.getLogger('ixdzsReptile');


var AXDZS_SEARCH_URL = 'http://zhannei.baidu.com/cse/search';
var QI_DIAN_WEB = 'http://r.qidian.com/';
var ZONG_HENG_WEB = 'http://book.zongheng.com/rank.html';
var ALL_TYPES = [
    { standard: '汇总', engName: 'total', qidian: '全部分类', zongheng: '百度小说月票榜' },
    { standard: '玄幻', engName: 'xuanhuan', qidian: '玄幻', zongheng: '奇幻玄幻点击榜' },
    { standard: '言情', engName: 'yanqing', qidian: '都市', zongheng: '言情小说点击榜' },
    { standard: '武侠', engName: 'wuxia', qidian: '武侠', zongheng: '武侠仙侠点击榜' },
    { standard: '历史', engName: 'lishi', qidian: '历史', zongheng: '历史军事点击榜' },
    { standard: '科幻', engName: 'kehuan', qidian: '科幻', zongheng: '科幻游戏点击榜' }
];
var qdTimmer = null,//起点计时器
    zhTimmer = null;//纵横计时器
//最终数据

fs.exists('log', function (ret) {
    if (!ret) {
        logger.warn('日志目录不存在，正在为你创建....');
        fs.mkdir('log');
    }
    fs.open('log/rankReptile.log', 'a', function (err, fd) {
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
    startReptile('大主宰');
    // getQdFactionRankList();
};

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
            .query({ s: '7466980319800320338', loc: 'http://www.ixdzs.com/bsearch?q=' + factionName, width: 580, q: factionName, wt: 1, ht: 1, pn: 10, fpos: 2, rmem: 0, reg: '' })
            .end(function (err, res) {
                if (err) {
                    logger.warn('使用爱下电子书搜索 ' + factionName + ' 失败');
                    return;
                }
                var $ = cheerio.load(res.text);
                //小说展示页面的url
                var factionDisplayUrl = $('.result-list .result-item .result-item-title a').each(function (index, element) {
                    var $element = $(element);
                    return $(element).attr('title') === factionName;
                }).attr('href');
                //转换小说的展示页面URL成为小说列表页的URL, 规律：http://www.ixdzs.com/d/133/133430/ ==> http://read.ixdzs.com/133/133430/
                var factionUrl = factionDisplayUrl.replace(/www/, 'read');
                factionUrl = factionUrl.replace(/\/d/, '');
                logger.info('|' + factionName + '| 在 |爱下电子书| 的地址是：' + factionUrl);
            });
    } else {
        logger.warn('doSearch传入参数错误');
    }
}

function getFactionList() {
    //开始爬取小说章节内容
    var getNewestFactionList = function (newestFactionNum) {
        //test, 爬去所有小说
        newestFactionNum = 1410;
        var totalNewestNum = 0;
        superagent.get(factionUrl)
            .end(function (err, res) {
                if (err) {
                    logger.warn('访问爱下电子书-- ' + factionName + ' 章节列表页失败');
                    return;
                };
                var $ = cheerio.load(res.text);
                $('.catalog .chapter > a').each(function (idx, element) {
                    var $element = $(element);
                    var sectionID = $element.attr('href');
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
                        var href = url.resolve(factionUrl, sectionID);
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


function getQdFactionRankList() {
    //显示进度条
    var qdProgressValue = 0;
    var qdBar = new ProgressBar('正在爬取起点小说排行榜 [:bar] :percent 用时:time秒', {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: 100
    });
    //爬取起点小说网的排行榜
    var QzEp = new eventproxy();
    QzEp.all('hasFinishedQidian', function (qiDianData) {
        // logger.info('即将开始爬取纵横网的排行榜....')
        getZhFactionRankList();
    });
    superagent.get(QI_DIAN_WEB)
        .end(function (err, res) {
            if (err) {
                logger.warn('访问起点主站失败，起点小说排行榜爬取失败....');
                QzEp.emit('hasFinishedQidian', 'qd');
                return;
            }
            var $ = cheerio.load(res.text);
            var QdEp = eventproxy();
            QdEp.after('getQdRank', ALL_TYPES.length, function (allQdRankData) {
                //使用计时器来判断起点小说排行榜是否爬取完毕
                qdTimmer = setInterval(function () {
                    //更新进度条
                    qdBar.tick({ 'percent': ++qdProgressValue, 'time': qdProgressValue / 10 });
                    var isQdReady = ALL_TYPES.every(function (item, index, array) {
                        return item.qdRank.every(function (item2, index2, array2) {
                            return item2.author && item2.headImg;
                        });
                    });
                    if (isQdReady) {
                        //标志爬取完毕
                        qdBar.curr = 100;
                        qdBar.tick({ 'percent': 100, 'time': qdProgressValue / 10 });
                        logger.info('起点小说排行榜爬取完毕.....');
                        clearInterval(qdTimmer);
                        QzEp.emit('hasFinishedQidian', 'qd');
                    }
                }, 100);
            });
            ALL_TYPES.forEach(function (item, index, array) {
                $('.rank-header .type-list p a').each(function (index, element) {
                    var $element = $(element);
                    if (item.qidian == $element.text()) {
                        item.qd_url = 'http://r.qidian.com/?chn=' + $element.data('chanid');
                        superagent.get(item.qd_url)
                            .end(function (err, res) {
                                if (err) {
                                    logger.warn('访问起点排行分类---' + item.qidian + '失败，将自动忽略这个分类排行榜的更新....');
                                    QdEp.emit('getQdRank', 'qdFail');
                                    return;
                                }
                                var $ = cheerio.load(res.text);
                                $('h3.wrap-title').each(function (index, element) {
                                    var $element = $(element);
                                    if ($element.text().indexOf('推荐票') >= 0) {
                                        item.qdRank = [];
                                        $element.parent().next().children('.book-list:first-child').children('ul').children('li').each(function (index, ele) {
                                            var $ele = $(ele);
                                            if (index == 0) {
                                                item.qdRank.push({
                                                    num: index + 1,
                                                    factionName: $ele.children('.book-wrap').children('.book-info').children('h4').children('a').text(),
                                                    author: '',
                                                    headImg: '',
                                                    des: '',
                                                    url: $ele.children('.book-wrap').children('.book-info').children('h4').children('a').attr('href')
                                                });
                                            } else {
                                                item.qdRank.push({
                                                    num: index + 1,
                                                    factionName: $ele.children('.name-box').children('a').text(),
                                                    author: '',
                                                    headImg: '', //nodejs根据图片链接将图片存储到本地，并且返回一个可访问链接
                                                    des: '',
                                                    url: $ele.children('.name-box').children('a').attr('href')
                                                });
                                            }
                                            //继续爬取作者名称、des和headImg
                                            superagent.get('http:' + item.qdRank[index].url)
                                                .end(function (err, res) {
                                                    if (err) {
                                                        logger.warn('爬取-起点-《' + item.qdRank[index].factionName + '》的封面图片和作者失败');
                                                        item.qdRank[index].headImg = 'http://chuantu.biz/t5/47/1487230810x1699162616.png';//默认图片
                                                        item.qdRank[index].des = '这是一本很长很长很长很长很长的书';
                                                        item.qdRank[index].author = '未知名作者';
                                                        return;
                                                    }
                                                    var $ = cheerio.load(res.text);
                                                    item.qdRank[index].headImg = $('.book-information .book-img a img').attr('src');
                                                    item.qdRank[index].des = $('.book-content-wrap .book-intro p').text().trim();
                                                    item.qdRank[index].author = $('.book-information .book-info .writer').text();
                                                });
                                        });
                                    }
                                });
                                //此处使用emit并没有什么卵用，superagent是异步的
                                QdEp.emit('getQdRank', 'qd');
                            });
                    }
                });
            });
        });
};

function getZhFactionRankList() {
    //显示进度条
    var zhProgressValue = 0;
    var zhBar = new ProgressBar('正在爬取纵横小说排行榜 [:bar] :percent 用时:time秒', {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: 100
    });
    var finalEp = new eventproxy();
    finalEp.all('hasFinishedZongheng', function (zongHengData) {
        connectDB.updateRank(ALL_TYPES);
    });
    //爬取纵横小说网的排行榜
    superagent.get(ZONG_HENG_WEB)
        .end(function (err, res) {
            if (err) {
                logger.warn('访问纵横主站失败，纵横小说排行榜爬取失败....');
                finalEp.emit('hasFinishedZongheng', 'zh');
                return;
            }
            var $ = cheerio.load(res.text);
            var ZhEp = new eventproxy();
            ZhEp.after('getZhRank', ALL_TYPES.length, function (allZhRankData) {
                //使用计时器来判断纵横小说排行榜是否爬取完毕
                zhTimmer = setInterval(function () {
                    //更新进度条
                    zhBar.tick({ 'percent': ++zhProgressValue, 'time': zhProgressValue / 10 });
                    var isZhReady = ALL_TYPES.every(function (item, index, array) {
                        return item.zhRank.every(function (item2, index2, array2) {
                            return item2.author && item2.headImg;
                        });
                    });
                    if (isZhReady) {
                        //标志爬取完毕
                        zhBar.curr = 100;
                        zhBar.tick({ 'percent': 100, 'time': zhProgressValue / 10 });
                        logger.info('纵横小说排行榜爬取完毕.....');
                        clearInterval(zhTimmer);
                        finalEp.emit('hasFinishedZongheng', 'zh');
                    }
                }, 100);
            });
            ALL_TYPES.forEach(function (zhItem, zhIndex, array) {
                zhItem.zhRank = [];
                if (zhIndex == 0) {
                    //百度获取月票榜的前十的接口，改变pageSize的值可以获取到前100的小说排名
                    var nowDate = new Date();
                    var rankNameArr = [];
                    var rankUrlArr = [];
                    superagent
                        .get('http://book.zongheng.com/ajax/rank.getZongHengRankList.do')
                        .set('Accept', 'application/json')
                        .query({ rankType: 1, pageNum: 1, pageSize: 10, callback: 'jsonp' + nowDate.getTime() })
                        .use(sjsonapify) // json格式化插件
                        .end(function (res) {
                            if (!res.statusCode) {
                                logger.warn('调用获取纵横网小说排行前十的接口失败，暂不更新汇总的前十排名....');
                                return;
                            } else {
                                //没办法，只能使用正则一个个提取了，typeof rankArray == 'string'
                                //name
                                var bookNameExp = new RegExp('"bookName":"[\u4e00-\u9fffa-zA-Z]*"', 'g');
                                rankNameArr = res.rawResponse.match(bookNameExp).map(function (nameItem, nameIndex, nameArr) {
                                    var tempStr = nameItem.replace(/"bookName":"/, "");
                                    return tempStr.substring(0, tempStr.length - 1);
                                });
                                //如果数量不足10，补全
                                if (rankNameArr.length != 10) {
                                    for (var i = 0; i < (10 - rankNameArr.length); i++) {
                                        rankNameArr.push('未知名小说');
                                    }
                                }
                                //url
                                var bookIdExp = new RegExp('"bookId":[0-9]*', 'g');
                                rankUrlArr = res.rawResponse.match(bookIdExp).map(function (urlItem, urlIndex, urlArr) {
                                    return 'http://book.zongheng.com/book/' + urlItem.replace(/"bookId":/, "") + '.html';
                                });
                                if (rankUrlArr.length != 10) {
                                    for (var i = 0; i < (10 - rankUrlArr.length); i++) {
                                        rankUrlArr.push('noneUrl');
                                    }
                                }
                                //获取详细信息
                                rankUrlArr.forEach(function (urlItem, urlIndex, urlArr) {
                                    zhItem.zhRank.push({
                                        num: urlIndex + 1,
                                        factionName: rankNameArr[urlIndex],
                                        author: '',
                                        headImg: '',
                                        des: '',
                                        url: urlItem
                                    });
                                    if (urlItem != 'noneUrl') {
                                        superagent.get(urlItem)
                                            .end(function (err, res) {
                                                if (err) {
                                                    logger.warn('爬取纵横《' + zhItem.zhRank[urlIndex].factionName + '》的图片和作者失败....');
                                                    zhItem.zhRank[urlIndex].headImg = 'http://chuantu.biz/t5/47/1487230810x1699162616.png';
                                                    zhItem.zhRank[urlIndex].des = '这是一本很长很长很长很长很长的书';
                                                    zhItem.zhRank[urlIndex].author = '未知名作者';
                                                    return;
                                                }
                                                var $ = cheerio.load(res.text);
                                                zhItem.zhRank[urlIndex].headImg = $('.main .book_cover p a img').attr('src') || 'http://chuantu.biz/t5/47/1487230810x1699162616.png';
                                                zhItem.zhRank[urlIndex].des = $('.main .status .info_con').text().trim() || '这是一本很长很长很长很长很长的书';
                                                zhItem.zhRank[urlIndex].author = $('.main .status .booksub a').slice(0, 1).text().trim() || '未知名作者';
                                            });
                                    }
                                });
                                ZhEp.emit('getZhRank', 'zh');
                            }
                        });
                } else {
                    $('.tab .head span:last-child').each(function (idx, ele) {
                        $ele = $(ele);
                        //如果当前的分类符合
                        if (zhItem.zongheng == $ele.text()) {
                            //初始化item.zhRank，并且赋值factionName和访问详情的url
                            $ele.parent().next().next().children('ul').children('li').children('a').each(function (idx2, ele2) {
                                var $everybook = $(ele2);
                                zhItem.zhRank.push({
                                    num: idx2 + 1,
                                    factionName: $everybook.text(),
                                    author: '',
                                    headImg: '',
                                    des: '',
                                    url: $everybook.attr('href')
                                });
                            });

                            zhItem.zhRank.forEach(function (zhRankItem, zhRankIndex, zhRank) {
                                superagent.get(zhRankItem.url)
                                    .end(function (err, res) {
                                        if (err) {
                                            logger.warn('爬取-纵横-《' + zhRankItem.factionName + '》的封面图片和作者失败....');
                                            zhItem.zhRank[zhRankIndex].headImg = 'http://chuantu.biz/t5/47/1487230810x1699162616.png';
                                            zhItem.zhRank[zhRankIndex].des = '这是一本很长很长很长很长很长的书';
                                            zhItem.zhRank[zhRankIndex].author = '未知名作者';
                                            return;
                                        }
                                        var $ = cheerio.load(res.text);
                                        //这个地方可把我坑惨了，有时候虽然superagent访问成功了，可是拿到的数据却是空的，所以要设置一个默认值
                                        zhItem.zhRank[zhRankIndex].headImg = $('.main .book_cover p a img').attr('src') || 'http://chuantu.biz/t5/47/1487230810x1699162616.png';
                                        zhItem.zhRank[zhRankIndex].des = $('.main .status .info_con').text().trim() || '这是一本很长很长很长很长很长的书';
                                        zhItem.zhRank[zhRankIndex].author = $('.main .status .booksub a').slice(0, 1).text().trim() || '未知名作者';
                                    });
                            });
                            ZhEp.emit('getZhRank', 'zh');
                        }
                    });
                }
            });
        });
}
