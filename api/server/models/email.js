'use strict';
const Tools = require('../tools/tool');

module.exports = function (Email) {
  Email.getEmails = function (userid, filter, cb) {
    let app = Email.app;
    let returnData = [];
    //查询用户角色
    app.models.adminUser.findById(userid, { fields: { role: true } })
      .then(function (res) {
        try {
          if (res.role === "admin") {
            Email.find({"include": ["adminUser", "myAppUser"], "limit": filter.limit, "skip": filter.skip})
              .then(function (res) {
                // 遍历res
                res.forEach(function (item) {
                  let tmpObj = {};
                  tmpObj.emailid = item.id;
                  tmpObj.time = item.time;
                  tmpObj.title = item.title;
                  tmpObj.content = item.content.substring(0, 30);
                  tmpObj.from = {
                    userid: item.adminUser().id,
                    avatar: item.adminUser().avatar,
                    username: item.adminUser().username,
                    role: item.adminUser().role
                  };
                  tmpObj.to = {
                    avatar: item.myAppUser().avatar,
                    username: item.myAppUser().username,
                    nickname: item.myAppUser().nickName
                  };
                  returnData.push(tmpObj);
                });
                // returnData 排序
                returnData.sort(function(email1, email2){
                  let email1Date = new Date(email1.time);
                  let email2Date = new Date(email2.time);
                  let email1Time = email1Date.getTime();
                  let email2Time = email2Date.getTime();
                  return email2Time - email1Time;
                });
                cb(null, { code: 0, emails: returnData });
              })
              .catch(function (err) {
                console.log(err);
              });
          } else if (res.role === "normal") {
            Email.find({ "include": ["adminUser", "myAppUser"], "where": { "adminUserId": userid } })
              .then(function (res) {
                // 遍历res
                res.forEach(function (item) {
                  let tmpObj = {};
                  tmpObj.time = item.time;
                  tmpObj.title = item.title;
                  tmpObj.content = item.content.substring(0, 30);
                  tmpObj.from = {
                    avatar: item.adminUser().avatar,
                    username: item.adminUser().username,
                    role: item.adminUser().role
                  };
                  tmpObj.to = {
                    avatar: item.myAppUser().avatar,
                    username: item.myAppUser().username,
                    nickname: item.myAppUser().nickName
                  };
                  returnData.push(tmpObj);
                });
                // returnData 排序
                returnData.sort(function(email1, email2){
                  let email1Date = new Date(email1.time);
                  let email2Date = new Date(email2.time);
                  let email1Time = email1Date.getTime();
                  let email2Time = email2Date.getTime();
                  return email2Time - email1Time;
                });
                cb(null, { code: 0, emails: returnData });
              })
              .catch(function (err) {
                console.log(err);
              });
          }
        } catch (err) {
          console.log(err);
          cb(null, { code: -1, msg: err.toString() });
        }
      })
      .catch(function (err) {
        console.log(err);
        cb(null, { code: -1, msg: 'userid不合法' });
      });
  };

  Email.remoteMethod(
    'getEmails', {
      accepts: [{
        arg: 'userid',
        type: 'string'
      },{
        arg: 'filter',
        type: 'object'
      }],
      returns: {
        arg: 'data',
        type: 'object'
      },
      http: {
        'verb': 'get',
        'path': '/getEmails'
      }
    }
  );
};
