'use strict';
var app = require('../server.js');
var Tools = require('../tools/tool');
var Eventproxy = require('eventproxy');

module.exports = function (Factionlists) {
  Factionlists.getBookById = function (bookId, cb) {
    var returnData = {};
    var app = Factionlists.app;
    console.log(bookId);
    app.models.factionlists.findById(bookId,{}, {}, function (err, res) {
      if (err) {
        console.log('查询小说列表失败....' + err);
        cb(null, {code: -1, errMsg: '查询小说列表失败'})
      } else {
        console.log(res.sectionArray.toString());
        returnData.code = 0; //标志位
        returnData.author = res.author;
        if(res.headerImage.indexOf('http') < 0){
          returnData.headImg = Tools.getQdTrueImgUrl(res.headerImage);
        }else{
          returnData.headImg = res.headerImage;
        }
        returnData.des = Tools.overflowDeal(res.des);
        /*只取这本小说的所有的章节的章节数和章节名，当具体点某章节的时候再去根据章节id获取它的内容*/
        var sectionEp = new Eventproxy();
        sectionEp.after('hasGotContent', res.sectionArray.length, function(allSections){
          returnData.sectionArray = allSections;
          //获取小说的最新章节
          var newestSection = {sectionNum: 0};
          allSections.forEach(function(sectionItem){
            if(sectionItem.sectionNum > newestSection.sectionNum){
              newestSection = sectionItem;
            }
          });
          returnData.newestSection = newestSection;
          //调用callback把数据传出去
          cb(null, returnData);
        });
        res.sectionArray.forEach(function(sectionItem){
          app.models.factioncontents.findById(sectionItem,{},function(err, sectionRes){
            var returnData = {sectionId: null, sectionNum: null, sectionTitle: null};
            if(err){
              console.log('查询小说内容失败....'+err);
              sectionEp.emit('hasGotContent', returnData);
            }else{
              returnData.sectionId = sectionRes.id;
              returnData.sectionNum = sectionRes.sectionNum;
              returnData.sectionTitle = sectionRes.sectionTitle;
              /**
               * 这里暂时没有考虑多个不同的来源的问题，按照以前设定的想法，小说应该允许多个来源同时存在，并且会对不同来源
               * 的小说做层次分析，选取最优的来源，当然这是后期的工作。同时这里不同来源的小说共同存储在一个factionContent
               * 表中，所以很有可能同一章节会存在不同来源的，所以需要设定一个默认来源，同时应该设定一个来源的优先级，当前一
               * 个来源没有数据的时候，采用后一个来源的数据，依次类推
               */
              returnData.sectionResource = sectionRes.sectionResource;
              sectionEp.emit('hasGotContent', returnData);
            }
          });
        });

      }
    });
  };
  //register getBookById
  Factionlists.remoteMethod(
    'getBookById', {
      accepts: {
        arg: 'bookId',
        type: 'string',
        description: 'the id of a book'
      },
      returns: {
        arg: 'data',
        type: 'object',
        description: '返回的结果对象'
      },
      http: {path: '/getBookById', verb: 'get'}
    });

  /**
   * 根据书籍id和当前阅读章节获取章节目录
   * @param bookId 书籍id
   * @param sectionNum 当前正在阅读的章节数
   * @method 直接根据sectionNum大于小于查询
   */
  Factionlists.getMulu = function (bookId, sectionNum, cb) {
    var returnData = {};
    var app = Factionlists.app;
    app.models.factionlists.findById(bookId, {}, {}, function (err, res) {
      if (err) {
        console.log('查询小说列表失败....' + err);
        cb(null, {code: -1, errMsg: '查询小说列表失败'})
      } else {
        returnData.code = 0; //标志位
        returnData.author = res.author;
        if(res.headerImage.indexOf('http') < 0){
          returnData.headImg = Tools.getQdTrueImgUrl(res.headerImage);
        }else{
          returnData.headImg = res.headerImage;
        }
        returnData.des = Tools.overflowDeal(res.des);
        /*只取这本小说的所有的章节的章节数和章节名，当具体点某章节的时候再去根据章节id获取它的内容*/
        var sectionEp = new Eventproxy();
        sectionEp.after('hasGotContent', res.sectionArray.length, function(allSections){
          returnData.sectionArray = [];
          //刷选sectionNum前后20章
          allSections.forEach(function(item, index){
            if(item.sectionNum >= (sectionNum-10) && item.sectionNum <= (sectionNum+10)){
              returnData.sectionArray.push(item);
            }
          });
          //排序
          returnData.sectionArray.sort(function(faction1, faction2){
            return faction1.sectionNum - faction2.sectionNum;
          });
          //调用callback把数据传出去
          cb(null, returnData);
        });
        res.sectionArray.forEach(function(sectionItem){
          app.models.factioncontents.findById(sectionItem,{},function(err, sectionRes){
            var returnData = {sectionId: null, sectionNum: null, sectionTitle: null};
            if(err){
              console.log('查询小说内容失败....'+err);
              sectionEp.emit('hasGotContent', returnData);
            }else{
              returnData.sectionId = sectionRes.id;
              returnData.sectionNum = sectionRes.sectionNum;
              returnData.sectionTitle = sectionRes.sectionTitle;
              /**
               * 这里暂时没有考虑多个不同的来源的问题，按照以前设定的想法，小说应该允许多个来源同时存在，并且会对不同来源
               * 的小说做层次分析，选取最优的来源，当然这是后期的工作。同时这里不同来源的小说共同存储在一个factionContent
               * 表中，所以很有可能同一章节会存在不同来源的，所以需要设定一个默认来源，同时应该设定一个来源的优先级，当前一
               * 个来源没有数据的时候，采用后一个来源的数据，依次类推
               */
              sectionEp.emit('hasGotContent', returnData);
            }
          });
        });

      }
    });
  };
  //register getBookById
  Factionlists.remoteMethod(
    'getMulu', {
      accepts: [{
        arg: 'bookId',
        type: 'string',
        description: 'the id of a book'
      },
      {
        arg: 'sectionNum',
        type: 'number',
        description: 'the num of a book section'
      }
      ],
      returns: {
        arg: 'data',
        type: 'object',
        description: '返回的结果对象'
      },
      http: {path: '/getMulu', verb: 'get'}
    });
};
