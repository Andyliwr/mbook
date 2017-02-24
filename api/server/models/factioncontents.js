'use strict';
var app = require('../server.js');

module.exports = function(Factioncontents) {
  Factioncontents.getContentById = function(sectionId, cb){
    var app = Factioncontents.app;
    var returnData = {};
    app.models.factioncontents.findById(sectionId, {}, function(err, res){
      if(err){
        console.log('获取id为'+sectionId+'的小说章节失败...'+err);
        cb(null, {code: -1, errMsg: '获取id为'+sectionId+'的小说章节失败'});
      }else{
        returnData.sectionContent = res.sectionContent;
        returnData.recentUpdateTime = res.recentUpdateTime;
        cb(null, {code: 0, content: returnData});
        }
    });
  };
  //register getContentById
  Factioncontents.remoteMethod(
    'getContentById', {
      accepts: {
        arg: 'sectionId',
        type: 'string',
        description: 'the id of a section'
      },
      returns: {
        arg: 'data',
        type: 'object',
        description: '返回的结果对象'
      },
      http: {path: '/getContentById', verb: 'get'}
    });
};
