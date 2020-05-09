"use strict";
var app = require("../server.js");

module.exports = function (Chapter) {
  Chapter.getContentById = function (sectionId, cb) {
    var app = Chapter.app;
    var returnData = {};
    app.models.chapter.findById(sectionId, {}, function (err, res) {
      if (err) {
        console.log("获取id为" + sectionId + "的小说章节失败..." + err);
        cb(null, {
          code: -1,
          errMsg: "获取id为" + sectionId + "的小说章节失败",
        });
      } else {
        returnData.sectionContent = res.content;
        returnData.recentUpdateTime = res.create_time;
        cb(null, { code: 0, content: returnData });
      }
    });
  };
  //register getContentById
  Chapter.remoteMethod("getContentById", {
    accepts: {
      arg: "sectionId",
      type: "string",
      description: "the id of a section",
    },
    returns: {
      arg: "data",
      type: "object",
      description: "返回的结果对象",
    },
    http: { path: "/getContentById", verb: "get" },
  });

  Chapter.getContentByHistory = function (userid, bookid, cb) {
    var app = Chapter.app;
    var returnData = {};
    app.models.user.findById(userid, {}, function (err, res) {
      if (err) {
        cb(null, {
          code: -1,
          errMsg: "获取用户信息失败",
        });
      } else {
        // 阅读进度
        let currentNum = 1;
        const readHistory = res.myBooks.filter(item => item.bookid === bookid)[0];
        if (readHistory) currentNum = Math.max(1, +readHistory.hasRead);
        // 加载对应的章节
        app.models.chapter.findOne({ where: { num: currentNum, bookid } }, function(err, res2) {
          if (err) {
            cb(null, {
              code: -2,
              errMsg: "获取章节信息失败",
            });
          } else {
            cb(null, {
              code: 0,
              num: currentNum,
              content: res2.content,
            });
          }
        })
      }
    });
  };

  Chapter.remoteMethod("getContentByHistory", {
    accepts: [
      {
        arg: "userid",
        type: "string",
      },
      {
        arg: "bookid",
        type: "string",
      },
    ],
    returns: {
      arg: "data",
      type: "object",
      description: "返回的结果对象",
    },
    http: { path: "/getContentByHistory", verb: "get" },
  });
};
