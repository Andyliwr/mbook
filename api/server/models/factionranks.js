'use strict';
//在模型脚本中可以直接require ／server/server 获得app对象，一旦你获得了app对象，你可以通过app的models属性轻易得到你想要的模型对象。
// var loopback = require('loopback');
var app = require('../server.js');
var Eventproxy = require('eventproxy');
var timmer = null;
// var LoopBackContext = require('loopback-context');

module.exports = function (Factionrank) {
  //定义一个简单的远程方法
  Factionrank.greet = function (msg, cb) {
    //然后使用Factionrank.app获取到app对象
    var app = Factionrank.app;
    //获取datasources
    // var datasources = app.datasources.db;

    //一旦你在config.js中启用了context，你可以通过使用loopback.getCurrentContext()来获取当前上下文对象
    // var ctx = LoopBackContext.getCurrentContext(); //context默认去除，官方说有很多bug，建议使用loopback-context，详情http://loopback.io/doc/en/lb2/Using-current-context.html#configure-context-propagation
    // console.log(ctx);
    // var currentUser = ctx && ctx.get('currentUser');
    // console.log('currentUser.username: ', currentUser.username); // voila!
    // // Set more information on current context
    // ctx.set('foo', { bar: 'val' } );
    //地址：https://github.com/strongloop/loopback/issues/878

    // console.log(app.models.factionlists.find({}));
    cb(null, 'Greetings... ' + msg);
  };

  //使用remoteMethod去注册远程方法
  Factionrank.remoteMethod(
    'greet', {
      accepts: {
        arg: 'msg',
        type: 'string'
      },
      returns: {
        arg: 'greeting',
        type: 'string'
      }
    }
  );

  //单独获取起点小说排行榜
  Factionrank.getRank = function (rankType, cb) {
    var app = Factionrank.app;
    var resultArr = [];
    app.models.factionranks.find(function (err, sourceData) {
      if (err) {
        console.log('访问排行榜数据库失败...' + err);
        return;
      }
      //使用Eventproxy来控制流程
      var hasBookListEp = new Eventproxy();
      hasBookListEp.after('hasFinishUpdateBookList', 10, function(allData){
        timmer = setInterval(function(){
          var isReady = resultArr.every(function(item1){
            var qd = item1.qdRank.every(function(item2){
              return item2.bookId == undefined || item2.bookId == null || item2.bookId == ''
            });
            var zh = item1.qdRank.every(function(item2){
              return item2.bookId == undefined || item2.bookId == null || item2.bookId == ''
            });
            return qd && zh;
          });
          if(isReady){
            cb(null, resultArr);
          }
        }, 1000);
      });
      if (rankType == 'qd') {
        sourceData.forEach(function (item) {
          hasBookList(item, 'qd', hasBookListEp);
        });
      } else if (rankType == 'zh') {
        sourceData.forEach(function (item) {
          hasBookList(item, 'zh', hasBookListEp);
        });
      } else {
        console.log('The param of getRank is error!....');
      }
    });

    //判断书籍是否存在，不存在就插入
    function hasBookList(item, rankType, hasBookListEp) {
      app.models.factionlists.find({}, {
        _id: 1,
        factionName: 1,
        author: 1,
        des: 0,
        headerImage: 0,
        sectionArray: 0,
        updateTime: 0
      }, function (err, res) {
        if (err) {
          console.log('getRank中查询factionlists失败....' + err);
          return;
        }
        item[rankType == 'qd'? 'qdRank': 'zhRank'].forEach(function (bookItem) {
          var bookNum = 0; //用来记录何时下面的查询返回true，这样当isBookExist为true的时候既可以根据这个值定位是哪篇文章
          var isBookExist = res.some(function (allBooksItem) {
            bookNum++;
            return allBooksItem.factionName == bookItem.factionName && allBooksItem.author == bookItem.author;
          });
          //如果书籍不存在，就初始化一个
          if (!isBookExist) {
            var bookcontent = {
              sectionNum: 0,
              sectionTitle: '测试章节',
              sectionContent: '这是测试章节',
              sectionResource: rankType == 'qd'? '起点排行榜' : '纵横排行榜',
              recentUpdateTime: new Date()
            };
            var bookcontentEntity = app.models.factioncontents(bookcontent);
            bookcontentEntity.save(function (err, res) {
              if (err) {
                console.log('factioncontents插入测试章节失败....' + err);
              }
              var booklistInfo = {
                factionName: bookItem.factionName,
                des: bookItem.des,
                headerImage: bookItem.headImg,
                author: bookItem.author,
                sectionArray: [res.id],
                updateTime: new Date()
              };
              var booklistEntity = app.models.factionlists(booklistInfo);
              booklistEntity.save(function (err, res) {
                if (err) {
                  if (err.toString().indexOf('duplicate') >= 0) {
                    console.log('小说<<' + bookItem.factionName + '>>在之前的榜单中已经出现过，不再重复插入....');//这个地方没办法，res不能去立即更新，这样会导致程序执行很慢，所以前面出现的小说如果又出现在另一个榜单里，就会报这种插入错误
                  } else {
                    console.log('factionlists插入测试章节失败....' + err);
                  }
                  return;
                }
                console.log('排行榜书籍不存在，插入测试数据成功....');
                bookItem.bookId = res.id.toString();
              });
            });
          } else {
            bookItem.bookId = res[bookNum - 1].id;
          }
        });
        //此时item里的所有子项目都已经被写入了bookid
        if(rankType == 'qd'){
          resultArr.push({
            standard: item.standard,
            engName: item.engName,
            qdRank: item.qdRank
          });
        }else{
          resultArr.push({
            standard: item.standard,
            engName: item.engName,
            zhRank: item.zhRank
          });
        }
        hasBookListEp.emit('hasFinishUpdateBookList', 'finish');//标志结束
      });
    }
  };

  //使用remoteMethod去注册远程方法
  Factionrank.remoteMethod(
    'getRank', {
      accepts: {
        arg: 'rankType',
        type: 'string',
        description: 'qd,zh'
      },
      returns: {
        arg: 'data',
        type: 'array',
        description: '返回的结果数组'
      },
      http: {path: '/getRank', verb: 'get'}
    });
};
