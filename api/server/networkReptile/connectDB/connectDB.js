var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');
var chinese_parseInt = require('../tools/chinese-parseint');
var myAppTools = require('../tools/myAppTools');
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
// logger.setLevel('ERROR');

// Connection URL
var url = 'mongodb://'+config.mongoConfig.username+':'+config.mongoConfig.password+'@'+config.mongoConfig.url+':'+config.mongoConfig.port+'/'+config.mongoConfig.dbName;
// Use connect method to connect to the Server
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', function(err){logger.error('连接数据库失败：'+err)});
db.once('open', function() {
    // we're connected!
    logger.info('连接数据成功，url是：'+ url);
});

//定义存储小说内容的schema
var factionContentSchema = new mongoose.Schema({
    sectionNum: {
        type: Number,
        unique: true
    },
    sectionTitle: String,
    sectionContent: String,
    sectionResource: String,//小说来源
    recentUpdateTime: Date  //最新的更新时间，用来比对最新文章
}, {safe:{j:1,w:1,wtimeout:10000}});
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
    updateTime: Date //更新时间
}, {safe:{j:1,w:1,wtimeout:10000}}); //new Schema(config,options); j表示做1份日志，w表示做2个副本（尚不明确），超时时间10秒

//创建model
var factionListModel = mongoose.model('factionList', factionListSchema);

//初始化函数
var initDB = function(){
    //创建实例
    var factionContentEntity = new factionContentModel({sectionNum: 1, sectionTitle: '测试章节', sectionContent: '这是我存进去的第一章，仅供测试', sectionResource: '百度贴吧', recentUpdateTime: new Date()});
    factionContentEntity.save(function(err){
        if(err){
            logger.warn("小说内容实体存储-----失败，"+ err);
        }else{
            logger.info("小说内容实体存储-----成功！");
        }
    });
    //创建实例
    var factionListEntity = new factionListModel({factionName: '大主宰', des: '大千世界，位面交汇，万族林立，群雄荟萃，一位位来自下位面的天之至尊，在这无尽世界，演绎着令人向往的传奇，追求着那主宰之路。 无尽火域，炎帝执掌，万火焚苍穹。 武境之内，武祖之威，震慑乾坤。 西天之殿，百战之皇，战威无可敌。 北荒之丘，万墓之地，不死之主镇天地。 ...... 少年自北灵境而出，骑九幽冥雀，闯向了那精彩绝伦的纷纭世界，主宰之路，谁主沉浮？ 大千世界，万道争锋，吾为大主宰。', headerImage: 'http://res.cloudinary.com/idwzx/image/upload/v1472746056/dazhuzai_y6428k.jpg', author: '天蚕土豆',sectionArray: [factionContentEntity._id], updateTime: new Date()});
    factionListEntity.save(function(err){
        if(err){
            logger.warn("小说列表实体存储-----失败，"+ err);
        }else{
            logger.info("小说列表实体存储-----成功！");
        }
    });
    //关闭数据库链接
    // db.close();
};
// initDB();

//每次存储之前都根据，factionContent里的内容更新sectionList
var updateSectionList = function(){
  factionContentModel.find().exec(function(err, list){
    if(err){
      logger.warn('查询factionContent文档失败，'+err);
    }else{
      factionListModel.update({}, {$set : {sectionArray : list}}).exec(function(err){
        if(err){
          logger.warn('存储前更新list失败，'+ err);
        }else{
          logger.info('存储前更新list成功！，');
        }
      });
    }
  })
};

//存储小说的方法
var saveFaction = function(json){
    if(!(json.sectionNum && json.factionName)){
        logger.warn('存储数据时，格式错误！！');
        return;
    }else{
        //首先写好sectionArray，最重要的
        //先查询要存入的内容是否存在，不存在则存入，否则摒弃
        factionListModel.find({factionName: json.factionName})
                           .populate('sectionArray', 'sectionNum', null, {sort: { sectionNum: -1 }})
                        //    .sort({updateTime: -1})
                           .exec(function(err, list){
                               if(err){
                                   logger.warn("查询mongo-----失败！"+err);
                               }else{
                                    //只可能有一条记录，没有多余的
                                    //从list[0].sectionArray中提取出sectionNum---[{"_id":"57c8eaeec70bd8882b0c20da","sectionNum":2},{"_id":"57c85f18463272883ffd8283","sectionNum":1}]
                                    //增强程序健壮性，当数据库为空的时候，不可以应用list[0]
                                    if(list.length == 0){
                                        // list.push({_id: '0000000000000000000000000', sectionNum: '0'});//无数据的默认值
                                        logger.fatal('数据库无数据，请释放initDB函数，初始化数据！！');
                                    }else{
                                        var sectionNumArray = myAppTools.getElementArray(list[0].sectionArray, 'sectionNum');

                                        if(myAppTools.isInArray(sectionNumArray, json.sectionNum)){
                                            //数据已存在
                                            logger.debug("数据库中已有"+json.factionName+"的第"+json.sectionNum+"章的小说，放弃存储！！");
                                            return;
                                        }else{
                                            //组装数据
                                            var jsonTemp = {
                                                sectionNum: json.sectionNum,
                                                sectionTitle: json.sectionTitle,
                                                sectionContent: json.sectionContent,
                                                sectionResource: json.sectionResource,
                                                recentUpdateTime: json.recentUpdateTime
                                            };

                                            //将小说内容存入数据库
                                            var factionContentEntity = new factionContentModel(jsonTemp);
                                            factionContentEntity.save(function(err){
                                                if(err){
                                                    logger.warn(json.factionName+' 的第 '+json.sectionNum+' 章 '+json.sectionTitle+' factionContentModel 更新-----失败！'+ err);
                                                }else{
                                                    logger.info(json.factionName+' 的第 '+json.sectionNum+' 章 '+json.sectionTitle+' factionContentModel 更新-----成功！');
                                                }
                                            });

                                            //将更新数据库中小说章节记录
                                            var sectionIdArray = myAppTools.getElementArray(list[0].sectionArray, '_id');
                                            sectionIdArray.push(factionContentEntity._id);

                                            var conditions = {factionName : json.factionName};
                                            var update     = {$set : {sectionArray : sectionIdArray}};
                                            var options    = {upsert : true};

                                            factionListModel.update(conditions, update, options, function(error){
                                                if(error) {
                                                    logger.warn(json.factionName+' 的第 '+json.sectionNum+' 章 '+json.sectionTitle+' factionListModel 更新-----失败！'+error);
                                                } else {
                                                    logger.info(json.factionName+' 的第 '+json.sectionNum+' 章 '+json.sectionTitle+' factionListModel 更新-----成功！');
                                                }
                                                //关闭数据库链接
                                                // db.close();
                                            });
                                        }
                                    }
                               }
                           });
    }
};

// var testSaveData = function(){
//     //调试saveFaction
//     var jsonTest = {
//         factionName: '大主宰',
//         sectionNum: 2,
//         sectionTitle: '测试章节2',
//         sectionContent: '这是用于测试的第二章',
//         sectionResource: '百度贴吧',
//         recentUpdateTime: new Date()
//     };
//     saveFaction(jsonTest);
// };
// testSaveData();

//把存储方法暴露出来
exports.saveFaction = saveFaction;
exports.updateSectionList = updateSectionList;
