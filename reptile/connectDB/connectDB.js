const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config');
const myAppTools = require('../tools/myAppTools');
const eventproxy = require('eventproxy');
//日志相关v
const log4js = require('log4js');
const path = require('path');
var logger = null;
//config log
function configLog(reptileType) {
  if (reptileType == "networkReptile") {
    log4js.configure({
      appenders: [
        {type: 'console'},
        {type: 'file', filename: path.dirname(__dirname)+'/log/networkReptile.log', category: 'networkReptile'}
      ]
    });
    logger = log4js.getLogger('networkReptile');
  } else if (reptileType == "rankReptile") {
    log4js.configure({
      appenders: [
        {type: 'console'},
        {type: 'file', filename: path.dirname(__dirname)+'/log/rankReptile.log', category: 'rankReptile'}
      ]
    });
    logger = log4js.getLogger('rankReptile');
  } else if (reptileType == "ixdzsReptile") {
    log4js.configure({
      appenders: [
        {type: 'console'},
        {type: 'file', filename: path.dirname(__dirname)+'/log/ixdzsReptile.log', category: 'ixdzsReptile'}
      ]
    });
    logger = log4js.getLogger('ixdzsReptile');
  } else if (reptileType == "operation") {
    log4js.configure({
      appenders: [
        {type: 'console'},
        {type: 'file', filename: path.dirname(__dirname)+'/log/operation.log', category: 'operation'}
      ]
    });
    logger = log4js.getLogger('operation');
  }
}

// Connection URL
// var url = 'mongodb://'+config.mongoConfig.username+':'+config.mongoConfig.password+'@'+config.mongoConfig.url+':'+config.mongoConfig.port+'/'+config.mongoConfig.dbName;
var url = 'mongodb://' + config.localMongoJson.username + ':' + config.localMongoJson.password + '@' + config.localMongoJson.url + ':' + config.localMongoJson.port + '/' + config.localMongoJson.dbName;
//not use the default promise
mongoose.Promise = global.Promise;
// Use connect method to connect to the Server
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', function (err) {
  logger.error('连接数据库失败：' + err)
});
db.once('open', function () {
  // we're connected!
  logger.info('连接数据库成功.....');
});

//定义存储小说内容的schema
var factionContentSchema = new mongoose.Schema({
  sectionNum: {
    type: Number
  },
  sectionTitle: String,
  sectionContent: String,
  sectionResource: String,//小说来源
  recentUpdateTime: Date,  //最新的更新时间，用来比对最新文章
  des: String //add some signature used to management,
}, {safe: {j: 1, w: 1, wtimeout: 10000}});
//创建model
var factionContentModel = mongoose.model('factionContent', factionContentSchema);

//定义存储小说的schema
var factionListSchema = new mongoose.Schema({
  // _id:{type: Schema.Types.ObjectId},  //主键
  // _fk:Schema.Types.ObjectId,  //外键
  factionName: {
    type: String,
    trim: true, //去除两边的空格
    unique: true
  },  //小说名
  des: String, //小说说明
  headerImage: String, //小说首图链接
  author: String, //小说作者
  sectionArray: [{type: Schema.Types.ObjectId, ref: 'factionContent'}], //小说章节列表, 每个元素是包含章节数、标题、章节内容的JSON
  updateTime: Date, // time of update
  newest: Number, // the newest section number
  comments: [] // all comments of this book
}, {safe: {j: 1, w: 1, wtimeout: 10000}}); //new Schema(config,options); j表示做1份日志，w表示做2个副本（尚不明确），超时时间10秒

//创建model
var factionListModel = mongoose.model('factionList', factionListSchema);

//定义存储小说排行榜的schema
var factionRankSchema = new mongoose.Schema({
  standard: String,
  engName: {
    type: String,
    unique: true
  },
  qidian: String,//起点分类的中文名
  zongheng: String,
  qd_url: String,
  qdRank: [],
  zhRank: [],
  updateTime: Date //更新时间
}, {safe: {j: 1, w: 1, wtimeout: 10000}}); //new Schema(config,options); j表示做1份日志，w表示做2个副本（尚不明确），超时时间10秒

//定义一个简单的方法
factionRankSchema.methods.showFeiLei = function () {
  return this.standard ? this.standard : "未定义";
};
factionRankSchema.methods.returnData = function () {
  var tempData = {
    standard: this.standard,
    engName: this.engName,
    qidian: this.qidian,//起点分类的中文名
    zongheng: this.zongheng,
    qd_url: this.qd_url,
    qdRank: this.qdRank,
    zhRank: this.zhRank,
    updateTime: this.updateTime //更新时间
  }
  return tempData;
};

//创建model
var factionRankModel = mongoose.model('factionRank', factionRankSchema);

//初始化函数
var initDB = function () {
  //创建实例
  var factionContentEntity = new factionContentModel({
    sectionNum: 1,
    sectionTitle: '测试章节',
    sectionContent: '这是我存进去的第一章，仅供测试',
    sectionResource: '百度贴吧',
    recentUpdateTime: myAppTools.formatDate(new Date()),
    des: '大主宰'
  });

  factionContentEntity.save(function (err) {
    if (err) {
      logger.warn("小说内容初始化失败...." + err);
    } else {
      logger.info("小说内容初始化成功....");
    }
  });

  //创建实例
  var factionListEntity = new factionListModel({
    factionName: '大主宰',
    des: '大千世界，位面交汇，万族林立，群雄荟萃，一位位来自下位面的天之至尊，在这无尽世界，演绎着令人向往的传奇，追求着那主宰之路。 无尽火域，炎帝执掌，万火焚苍穹。 武境之内，武祖之威，震慑乾坤。 西天之殿，百战之皇，战威无可敌。 北荒之丘，万墓之地，不死之主镇天地。 ...... 少年自北灵境而出，骑九幽冥雀，闯向了那精彩绝伦的纷纭世界，主宰之路，谁主沉浮？ 大千世界，万道争锋，吾为大主宰。',
    headerImage: 'http://res.cloudinary.com/idwzx/image/upload/v1472746056/dazhuzai_y6428k.jpg',
    author: '天蚕土豆',
    sectionArray: [factionContentEntity._id],
    updateTime: new Date(),
    newest: 1,
    comments: []
  });

  factionListEntity.save(function (err) {
    if (err) {
      logger.warn("小说列表初始化失败...." + err);
    } else {
      logger.info("小说列表初始化成功....");
    }
  });

  //创建排名的实例
  var today = new Date();
  var startedData = [
    {
      num: 1,
      factionName: 'xxx',
      author: 'xxx',
      headImg: 'xxx',
      des: 'xxx',
      url: 'xxx'
    }, {
      num: 2,
      factionName: 'xxx',
      author: 'xxx',
      headImg: 'xxx',
      des: 'xxx',
      url: 'xxx'
    }, {
      num: 3,
      factionName: 'xxx',
      author: 'xxx',
      headImg: 'xxx',
      des: 'xxx',
      url: 'xxx'
    }, {
      num: 4,
      factionName: 'xxx',
      author: 'xxx',
      headImg: 'xxx',
      des: 'xxx',
      url: 'xxx'
    }, {
      num: 5,
      factionName: 'xxx',
      author: 'xxx',
      headImg: 'xxx',
      des: 'xxx',
      url: 'xxx'
    }, {
      num: 6,
      factionName: 'xxx',
      author: 'xxx',
      headImg: 'xxx',
      des: 'xxx',
      url: 'xxx'
    }, {
      num: 7,
      factionName: 'xxx',
      author: 'xxx',
      headImg: 'xxx',
      des: 'xxx',
      url: 'xxx'
    }, {
      num: 8,
      factionName: 'xxx',
      author: 'xxx',
      headImg: 'xxx',
      des: 'xxx',
      url: 'xxx'
    }, {
      num: 9,
      factionName: 'xxx',
      author: 'xxx',
      headImg: 'xxx',
      des: 'xxx',
      url: 'xxx'
    }, {
      num: 10,
      factionName: 'xxx',
      author: 'xxx',
      headImg: 'xxx',
      des: 'xxx',
      url: 'xxx'
    }
  ];
  var readyToStartArr = [{
    standard: '汇总',
    engName: 'total',
    qidian: '全部分类',//起点分类的中文名
    zongheng: '百度小说月票榜',
    qd_url: 'http://r.qidian.com/?chn=-1',
    qdRank: startedData,
    zhRank: startedData,
    updateTime: today //更新时间
  }, {
    standard: '玄幻',
    engName: 'xuanhuan',
    qidian: '玄幻',//起点分类的中文名
    zongheng: '奇幻玄幻点击榜',
    qd_url: 'http://r.qidian.com/?chn=21',
    qdRank: startedData,
    zhRank: startedData,
    updateTime: today //更新时间
  }, {
    standard: '言情',
    engName: 'yanqing',
    qidian: '都市',//起点分类的中文名
    zongheng: '言情小说点击榜',
    qd_url: 'http://r.qidian.com/?chn=4',
    qdRank: startedData,
    zhRank: startedData,
    updateTime: today //更新时间
  }, {
    standard: '武侠',
    engName: 'wuxia',
    qidian: '武侠',//起点分类的中文名
    zongheng: '武侠仙侠点击榜',
    qd_url: 'http://r.qidian.com/?chn=2',
    qdRank: startedData,
    zhRank: startedData,
    updateTime: today //更新时间
  }, {
    standard: '历史',
    engName: 'lishi',
    qidian: '历史',//起点分类的中文名
    zongheng: '历史军事点击榜',
    qd_url: 'http://r.qidian.com/?chn=5',
    qdRank: startedData,
    zhRank: startedData,
    updateTime: today //更新时间
  }, {
    standard: '科幻',
    engName: 'kehuan',
    qidian: '科幻',//起点分类的中文名
    zongheng: '科幻游戏点击榜',
    qd_url: 'http://r.qidian.com/?chn=9',
    qdRank: startedData,
    zhRank: startedData,
    updateTime: today //更新时间
  }];

  readyToStartArr.forEach(function (item) {
    var factionRankEntity = new factionRankModel(item);
    factionRankEntity.save(function (err) {
      if (err) {
        logger.warn('小说排行榜 ' + factionRankEntity.showFeiLei() + ' 类别初始化失败....' + err);
        hasError = true;
      } else {
        logger.info('小说排行榜 ' + factionRankEntity.showFeiLei() + ' 类别初始化成功....');
      }
    });
  });

};

/**
 * before get new faction data, update lists with contents data (remove the same sectionNum contents, and update list)
 * @param factionName
 * @param source the source of faction
 */
function updateSectionList(factionName, source, isDone) {
  var reg = new RegExp(factionName, 'g');
  factionContentModel.find({des: reg, sectionResource: source})
    .sort({sectionNum: -1})
    .exec(function (err, list) {
      if (err) {
        logger.warn('查询factionContent文档失败，' + err);
      } else {
        //when the factionContent is duplicate, just delete it
        var whenDuplicate = function (itemId) {
          factionContentModel.remove({_id: itemId}, function (err) {
            if (err) {
              logger.warn('小说 |' + factionName + '| 中factionCentents的id为 ' + itemId + ' 的重复项删除失败，请手动删除...');
            } else {
              logger.info('小说 |' + factionName + '| 中factionCentents的id为 ' + itemId + ' 的重复项删除成功...');
            }
          });
        };
        list = myAppTools.removeDuplicate(list, 'sectionNum', whenDuplicate);
        var sectionArray = myAppTools.getElementArray(list, 'id')
        factionListModel.update({factionName: reg}, {
          $set: {
            sectionArray: sectionArray,
            updateTime: myAppTools.formatDate(new Date()),
            newest: sectionArray.length
          }
        }).exec(function (err) {
          if (err) {
            if (isDone == 'done') {
              logger.warn('存储后更新list失败，' + err);
            } else {
              logger.warn('存储前更新list失败，' + err);
            }
          } else {
            if (isDone == 'done') {
              logger.info('存储后更新list成功！');
            } else {
              logger.info('存储前更新list成功！');
            }
          }
        });
      }
    })
};

/**
 * 存储小说的方法
 * @param json 需要存储的对象信息
 * @param callback 存储成功的回调
 */

function saveFaction(json) {
  if (!(json.sectionNum && json.factionName)) {
    logger.warn('存储数据时，格式错误！！');
    return;
  } else {
    //先查询要存入的内容是否存在，不存在则存入，否则摒弃
    factionListModel.find({factionName: json.factionName})
      .populate('sectionArray', 'sectionNum', null, {sort: {sectionNum: -1}})
      //    .sort({updateTime: -1})
      .exec(function (err, list) {
        if (err) {
          logger.warn("查询mongo-----失败！" + err);
        } else {
          //只可能有一条记录，没有多余的
          //从list[0].sectionArray中提取出sectionNum---[{"_id":"57c8eaeec70bd8882b0c20da","sectionNum":2},{"_id":"57c85f18463272883ffd8283","sectionNum":1}]
          //增强程序健壮性，当数据库为空的时候，不可以应用list[0]
          if (list.length == 0) {
            logger.warn('数据库无数据，请释放initDB函数，初始化数据！！');
          } else {
            var sectionNumArray = myAppTools.getElementArray(list[0].sectionArray, 'sectionNum');
            if (myAppTools.isInArray(sectionNumArray, json.sectionNum)) {
              //数据已存在
              logger.debug("数据库中已有" + json.factionName + "的第" + json.sectionNum + "章的小说，放弃存储！");
              return;
            } else {
              //组装数据
              var jsonTemp = {
                sectionNum: json.sectionNum,
                sectionTitle: json.sectionTitle,
                sectionContent: json.sectionContent,
                sectionResource: json.sectionResource,
                recentUpdateTime: json.recentUpdateTime,
                des: json.factionName //add some signature
              };

              //将小说内容存入数据库
              factionContentModel.create(jsonTemp, function (contentErr, contentDoc) {
                if (contentErr) {
                  typeof callback === 'fuction' && callback({contents: 1, list: 1});
                  logger.warn(json.factionName + ' 的第 ' + json.sectionNum + ' 章 ' + json.sectionTitle + ' factionContent更新fail，无法执行factionList的更新! ' + contentErr);
                } else {
                  // logger.info(json.factionName + ' 的第 ' + json.sectionNum + ' 章 ' + json.sectionTitle + ' factionContentModel 更新-----成功！');
                  //只有在小说内容存储成功之后才去更新小说章节列表
                  var sectionIdArray = myAppTools.getElementArray(list[0].sectionArray, '_id');
                  sectionIdArray.push(contentDoc.id);

                  var conditions = {factionName: json.factionName};
                  var update = {$set: {sectionArray: sectionIdArray, updateTime: myAppTools.formatDate(new Date())}};
                  factionListModel.update(conditions, update, function (listErr) {
                    if (listErr) {
                      typeof callback === 'fuction' && callback({contents: 1, list: 0});
                      logger.warn(json.factionName + ' 的第 ' + json.sectionNum + ' 章 ' + json.sectionTitle + ' factionContentModel 更新success！\n' + json.factionName + ' 的第 ' + json.sectionNum + ' 章 ' + json.sectionTitle + ' factionListModel 更新fail！' + listErr);
                      //执行失败回滚
                      factionContentModel.remove({id: contentDoc.id}, function (removeErr) {
                        if (removeErr) {
                          logger.warn('在执行List更新失败之后，执行content还原操作失败，id:' + contentDoc.id);
                        }
                      })
                    } else {
                      typeof callback === 'fuction' && callback({contents: 1, list: 1});
                      logger.info(json.factionName + ' 的第 ' + json.sectionNum + ' 章 ' + json.sectionTitle + ' factionContentModel 更新success \n' + json.factionName + ' 的第 ' + json.sectionNum + ' 章 ' + json.sectionTitle + ' factionListModel 更新success');
                    }
                  });
                }
              });
            }
          }
        }
      });
  }
};

/**
 * 传入小说名字和小说来源，获取当前来源的最新的小说章节，以此避免重复爬取无用的章节
 * @param factionName 小说名
 * @param resource 小说来源
 * @return Number 最新章节数
 */
function getNewestSectionNum(factionName, resource, callback) {
  if (typeof factionName == 'string' && typeof resource == 'string') {
    factionListModel.find({factionName: factionName})
      .populate('sectionArray', 'sectionNum', null, {sort: {sectionNum: -1}})
      .exec(function (err, list) {
        if (err) {
          logger.warn("查询mongo-----失败！" + err);
        } else {
          //只可能有一条记录，没有多余的
          //从list[0].sectionArray中提取出sectionNum---[{"_id":"57c8eaeec70bd8882b0c20da","sectionNum":2},{"_id":"57c85f18463272883ffd8283","sectionNum":1}]
          //增强程序健壮性，当数据库为空的时候，不可以应用list[0]
          try {
            if (list.length == 0) {
              logger.fatal('数据库无数据，请释放initDB函数，初始化数据！！');
            } else {
              if (typeof callback == 'function') {
                if (list[0].sectionArray[0]) {
                  callback(list[0].sectionArray[0].sectionNum || 0);
                } else {
                  callback(0);
                }
              }
            }
          } catch (err) {
            logger.warn('获取小说' + factionName + '，来源为' + resource + '的小说的最新章节数失败！');
          }
        }
      });
  } else {
    logger.warn("getNewestSectionNum传入参数错误!");
  }
}

/**
 * @param bookItem 没有小说id的小说对象
 * @param ranktype 'qd'或者'zh'
 * @isQdRankReady 控制起点排行是否更新完毕的ep对象
 * @isZhRankReady 控制纵横排行是否更新完毕的ep对象
 * @function 将爬取到的小说列表和数据库中已经存在的小说列表做对比，如果存在则为排行榜中每部小说添加bookid，
 * 如果不存在则尝试插入一段测试章节，并生成新的小说列表，同时为排行榜中的每部小说添加bookid
 */
function autoAddTestSection(bookItem, ranktype, isQdRankReady, isZhRankReady) {
  //查找数据库中书籍list的数据
  factionListModel.findOne({
    factionName: bookItem.factionName,
    author: bookItem.author
  }, {_id: 1}, function (err, returnData) {
    if (err) {
      if (err.toString().indexOf('duplicate') >= 0) {
        logger.warn('之前榜单已经存在小说《' + bookItem.factionName + '》，这里不再重复更新....');
      } else {
        logger.warn('查询书名为《' + bookItem.factionName + '》，作者为 ' + bookItem.author + ' 的小说列表失败....' + err);
      }
      if (ranktype == 'qd') {
        isQdRankReady.emit('qdABookFinished', 'fail');
      } else {
        isZhRankReady.emit('zhABookFinished', 'fail');
      }
      return;
    }
    //如果书单存在
    if (returnData) {
      bookItem.bookId = returnData.id.toString();
    } else {
      var content = new factionContentModel({
        sectionNum: 0,
        sectionTitle: '测试章节',
        sectionContent: '这是一篇很长很长很长很长的测试章节',
        sectionResource: '起点排行榜自动增加',
        recentUpdateTime: new Date(),
        des: bookItem.factionName //add some signature
      });

      content.save(function (err) {
        if (err) {
          logger.warn('自动增加--书名为《' + bookItem.factionName + '》，作者为 ' + bookItem.author + ' 的小说的测试章节失败....' + err);
        }
      });

      //创建实例
      var list = new factionListModel({
        factionName: bookItem.factionName,
        des: bookItem.des,
        headerImage: bookItem.headImg,
        author: bookItem.author,
        sectionArray: [content._id],
        updateTime: new Date(),
        newest: 0, //最新章节
        comments: []
      });

      list.save(function (err) {
        if (err) {
          logger.warn('自动增加--书名为《' + bookItem.factionName + '》，作者为 ' + bookItem.author + ' 的小说列表失败.....' + err);
        }
      });
      bookItem.bookId = list.id.toString();
    }
    if (ranktype == 'qd') {
      isQdRankReady.emit('qdABookFinished', 'success');
    } else {
      isZhRankReady.emit('zhABookFinished', 'success');
    }
  });
}

/**
 * @param jsonArr 6类排行榜的数据
 * @function 存储并更新排行榜，同时对于排行榜中出现的小说在booklist中找不到bookid的情况，新建一个booklist，并存入测试章节
 */
function updateRank(jsonArr) {
  if (jsonArr instanceof Array && jsonArr.length == 6) {
    var finalEp = new eventproxy();
    finalEp.after('hasFinishedFenlei', 6, function () {
      logger.info('排行榜已经更新至数据库.....');
    });
    var rankAfterListEp = new eventproxy();
    rankAfterListEp.after('hasFinishedFindList', 6, function (finalData) {
      finalData.forEach(function (fenleiItem) {
        var isAllRankReadyEp = new eventproxy();
        var isQdRankReady = new eventproxy(); //判断一个分类中起点是否更新好了
        var isZhRankReady = new eventproxy(); //判断一个分类中纵横是否更新好了

        isAllRankReadyEp.all('qdRankReady', 'zhRankReady', function () {
          factionRankModel.update({standard: fenleiItem.standard}, {
            $set: {
              qdRank: fenleiItem.qdRank,
              zhRank: fenleiItem.zhRank,
              updateTime: new Date()
            }
          }, function (err, res) {
            if (err) {
              logger.warn('分类 ' + fenleiItem.standard + ' 的数据更新失败....' + err);
              finalEp.emit('hasFinishedFenlei', 'fail');
            } else {
              finalEp.emit('hasFinishedFenlei', 'success');
            }
          });
        });
        isQdRankReady.after('qdABookFinished', 10, function () {
          isAllRankReadyEp.emit('qdRankReady', 'success');
        });
        isZhRankReady.after('zhABookFinished', 10, function () {
          isAllRankReadyEp.emit('zhRankReady', 'success');
        });
        fenleiItem.qdRank.forEach(function (bookItem) {
          autoAddTestSection(bookItem, 'qd', isQdRankReady, isZhRankReady);
        });
        fenleiItem.zhRank.forEach(function (bookItem) {
          autoAddTestSection(bookItem, 'zh', isQdRankReady, isZhRankReady);
        });
      });
    });
    //查找原有文档
    factionRankModel.find({}, {'_id': 0, '__v': 0, 'updateTime': 0}, function (err, oldData) {
      if (err) {
        logger('查找数据库中排行榜数据失败....');
        return;
      }
      if (myAppTools.isTwoJSONArrSame(jsonArr, oldData)) {
        logger.info('数据相同，不用更新');
        return;
      } else {
        //oldData和jsonArr数据对等
        jsonArr.forEach(function (item, index) {
          //更新qdRank,为空的数据不再更新
          if (!myAppTools.isTwoJSONArrSame(item.qdRank, oldData[index].qdRank)) {
            //判断爬到的数据不是空数据，如果是空数据，则使用oldData的数据覆盖
            item.qdRank.forEach(function (item2, index2) {
              if (item2.factionName == '未知名小说' || item2.factionName == "") {
                item2.factionName = oldData[index].qdRank[index2].factionName;
              }
              if (item2.author == '未知名作者' || item2.author == "") {
                item2.author = oldData[index].qdRank[index2].author;
              }
              if (item2.headImg == 'http://chuantu.biz/t5/47/1487230810x1699162616.png' || item2.headImg == "") {
                item2.headImg = oldData[index].qdRank[index2].headImg;
              }
              if (item2.des == '这是一本很长很长很长很长很长的书' || item2.des == "") {
                item2.des = oldData[index].qdRank[index2].des;
              }
              if (item2.url == "") {
                item2.url = oldData[index].qdRank[index2].url;
              }
            });
            item.zhRank.forEach(function (item2, index2) {
              if (item2.factionName == '未知名小说' || item2.factionName == "") {
                item2.factionName = oldData[index].zhRank[index2].factionName;
              }
              if (item2.author == '未知名作者' || item2.author == "") {
                item2.author = oldData[index].zhRank[index2].author;
              }
              if (item2.headImg == 'http://chuantu.biz/t5/47/1487230810x1699162616.png' || item2.headImg == "") {
                item2.headImg = oldData[index].zhRank[index2].headImg;
              }
              if (item2.des == '这是一本很长很长很长很长很长的书' || item2.des == "") {
                item2.des = oldData[index].zhRank[index2].des;
              }
              if (item2.url == "") {
                item2.url = oldData[index].zhRank[index2].url;
              }
            });
          } else {
            logger.info('数据相同，不用更新');
            rankAfterListEp.emit('hasFinishedFindList', item);
            return;
          }
          rankAfterListEp.emit('hasFinishedFindList', item);
          // factionRankModel.update({standard: item.standard}, { $set: {qdRank: item.qdRank, zhRank: item.zhRank, updateTime: new Date()}}, callback);
        });
      }
    });

  } else {
    logger.warn('传入updateRank的数据格式错误....');
  }
}

/**
 * 清空整部小说，删除爬取到的所有小说章节
 * @param factionName 小说名字
 * @param resource 小说源
 */
function emptyFaction(factionName, resource) {
  if (typeof factionName == 'string' && typeof resource == 'string') {
    factionListModel.find({factionName: factionName})
      .populate('sectionArray', {'sectionNum': 1, 'sectionTitle': 1}, null, {sort: {sectionNum: -1}})
      .exec(function (err, list) {
        if (err) {
          logger.warn("查询mongo-----失败！" + err);
        } else {
          try {
            if (list.length == 0) {
              logger.fatal('小说 |' + factionName + ' |的数据库未正确初始化...');
            } else {
              //delete factionContent
              list[0].sectionArray.forEach(function (item) {
                factionContentModel.remove({_id: item._id}, function (err, doc) {
                  if (err) {
                    logger.warn('小说 |' + factionName + '| 第 ' + item.sectionNum + ' ' + item.sectionTitle + '删除 失败，请手动删除...');
                  } else {
                    logger.warn('小说 |' + factionName + '| 第 ' + item.sectionNum + ' ' + item.sectionTitle + '删除 成功...');
                  }
                })
              });
              //update factionList sectionArray
              factionListModel.update({factionName: factionName}, {
                $set: {
                  sectionArray: [],
                  updateTime: myAppTools.formatDate(new Date())
                }
              }, function (err, doc) {
                if (err) {
                  logger.warn('小说 |' + factionName + '| factionList sectionArray清除 失败...');
                } else {
                  logger.warn('小说 |' + factionName + '| factionList sectionArray清除 成功...');
                }
              });
            }
          } catch (error) {
            logger.warn('小说 |' + factionName + '| 清除fail，请手动删除...' + error);
          }
        }
      });
  } else {
    logger.warn("getNewestSectionNum传入参数错误!");
  }
}

/**
 * 检测章节断层（小说类容为“你到了没有知识的荒原“或着7调到9或者出现重复章节7887），比如1-10章，第8章没有，需要返回这步小说的章节断层的章节数
 * @param factionName 小说名字
 * @param resource 小说源
 * @callback 完成检测的回调函数
 */
function getSlipSection(factionName, resource, callback) {
  if (typeof factionName == 'string' && typeof resource == 'string') {
    factionListModel.find({factionName: factionName})
      .populate('sectionArray', {
        'sectionNum': 1,
        'sectionTitle': 1,
        'sectionContent': 1
      }, null, {sort: {sectionNum: 1}})
      .exec(function (err, list) {
        if (err) {
          logger.warn("查询mongo-----失败！" + err);
        } else {
          try {
            if (list.length == 0) {
              logger.fatal('小说 |' + factionName + ' |的数据库未正确初始化...');
            } else {
              //detect factionContent slip case
              var resultArr = [];
              var sectionArr = [];
              var detectSlipEp = new eventproxy();
              var length = list[0].sectionArray.length;
              detectSlipEp.after('hasFinishedDetect', length, function () {
                typeof callback === 'function' && callback({
                  idArr: resultArr,
                  sections: sectionArr,
                  newest: list[0].sectionArray[length - 1].sectionNum
                });
              });
              list[0].sectionArray.forEach(function (item, index, array) {
                if (item.sectionContent !== '你到了没有知识的荒野~' && item.sectionContent !== '你来到了没有知识的荒原...' && item.sectionTitle !== '测试章节') {
                  //if this item above has slip case, create a new factionContent to replace it
                  var createReplaceSection = function (sectionNum, createCallback) {
                    factionContentModel.create({
                      sectionNum: (sectionNum + 1),
                      sectionTitle: '测试章节',
                      sectionContent: '自动补齐，测试章节，仅供测试',
                      sectionResource: resource,
                      recentUpdateTime: myAppTools.formatDate(new Date()),
                      des: factionName
                    }, function (err, res) {
                      if (err || !res) {
                        logger.warn('检测断层章节过程中，发现第 ' + (sectionNum + 1) + ' 出现断层，新建测试章节补位fail，' + err);
                      } else {
                        resultArr.push(res.id);
                        sectionArr.push(sectionNum + 1);
                        logger.warn('检测断层章节过程中，发现第 ' + (sectionNum + 1) + ' 出现断层，新建测试章节补位success，id: ' + res.id);
                      }
                      typeof createCallback === 'function' && createCallback();
                    });
                  };
                  if (index !== (array.length - 1)) {
                    if (((item.sectionNum + 1) !== (array[index + 1].sectionNum))) {
                      createReplaceSection(item.sectionNum + 1, function () {
                        detectSlipEp.emit('hasFinishedDetect', '');
                      });
                    } else {
                      detectSlipEp.emit('hasFinishedDetect', '');
                    }
                  } else {
                    //this is the last section can be found
                    //如果遍历到最后发现最大章节数比当前数组的长度还要大，则剩余的也需要补齐
                    var distanceNum = array[length - 1].sectionNum - length;
                    if (distanceNum > 0) {
                      var lastEp = new eventproxy();
                      lastEp.after('hasFinishedCreate', distanceNum, function (datas) {
                        detectSlipEp.emit('hasFinishedDetect', '');
                      });
                      for (var i = 0; i < distanceNum; i++) {
                        createReplaceSection((index + 1 + i), function () {
                          lastEp.emit('hasFinishedCreate', '');
                        });
                      }
                    } else {
                      detectSlipEp.emit('hasFinishedDetect', '');
                    }
                  }
                } else {
                  // logger.warn('第 ' + item.sectionNum + '是测试章节');
                  resultArr.push(item._id);
                  sectionArr.push(item.sectionNum);
                  detectSlipEp.emit('hasFinishedDetect', '');
                }
              });
            }
          } catch (error) {
            logger.warn(error);
            typeof callback === 'function' && callback({idArr: [], sections: [], newest: 0});
          }
        }
      });
  } else {
    logger.warn("getNewestSectionNum传入参数错误!");
  }
}

/**
 * 清空整部小说，删除爬取到的所有小说章节
 * @param factionName 小说名字
 * @param resource 小说源
 */
function emptyFaction(factionName, resource){
  if (typeof factionName == 'string' && typeof resource == 'string') {
    factionListModel.find({factionName: factionName})
      .populate('sectionArray', {'sectionNum': 1, 'sectionTitle': 1}, null, {sort: {sectionNum: -1}})
      .exec(function (err, list) {
        if (err) {
          logger.warn("查询mongo-----失败！" + err);
        } else {
          try{
            if (list.length == 0) {
              logger.fatal('小说 |'+factionName+' |的数据库未正确初始化...');
            } else {
              //delete factionContent
              list[0].sectionArray.forEach(function (item) {
                factionContentModel.remove({_id: item._id}, function (err, doc) {
                  if(err){
                    logger.warn('小说 |'+factionName+'| 第 '+item.sectionNum+' '+item.sectionTitle+'删除 失败，请手动删除...');
                  }else{
                    logger.warn('小说 |'+factionName+'| 第 '+item.sectionNum+' '+item.sectionTitle+'删除 成功...');
                  }
                })
              });
              //update factionList sectionArray
              factionListModel.update({factionName: factionName}, {$set : {sectionArray: [], updateTime: myAppTools.formatDate(new Date())}}, function (err, doc) {
                if(err){
                  logger.warn('小说 |'+factionName+'| factionList sectionArray清除 失败...');
                }else{
                  logger.warn('小说 |'+factionName+'| factionList sectionArray清除 成功...');
                }
              });
            }
          } catch (error) {

          }
        }
      });
  } else {
    logger.warn("getNewestSectionNum传入参数错误!");
  }
}

//把存储方法暴露出来
exports.configLog = configLog; // 配置日志
exports.initDB = initDB; // 初始化数据库
exports.saveFaction = saveFaction; // 存储爬取到的章节内容
exports.updateSectionList = updateSectionList; // 更新章节列表
exports.getNewestSectionNum = getNewestSectionNum; // 获取最新章节
exports.updateRank = updateRank; // 更新排行榜
exports.emptyFaction = emptyFaction; // 清空某本小说
exports.getSlipSection = getSlipSection; // 获取不连续的章节
