'use strict';

module.exports = function(Email) {
  Email.getEmails = function (userid, cb) {
    var app = Email.app;
    var returnData = {};
    //查询用户角色
    app.models.adminUser.findById(userid, { fields: {role: true} })
      .then(function(res){
        try{
          if(res.role === "admin"){
            Email.find({"include": ["adminUser", "myAppUser"]})
              .then(function(res){
                console.log(res);
              })
              .catch(function(err){
                console.log(err);
              });
          }
        }catch(err){
          console.log(err);
          cb(null, {code: -1, msg: err.toString()});
        }
        
      });
    app.models.myAppUser.find({where: {email: email}}, function (err, res) {
      if (err) {
        console.log('找回密码接口查询出错，' + err);
        returnData = {code: -1, msg: '邮箱不存在'};
        return;
      }
      //这里做发送邮件的处理...
      var emailOptions = {
        from: "Fred Foo <andyliwr@outlook.com>", // sender address
        to: "lidikang@myhexin.com", // list of receivers
        subject: "Hello", // Subject line
        text: "Hello world", // plaintext body
        html: "<b>Hello world</b>" // html body
      };
      app.models.email.send(emailOptions, function (err, res) {
        if (err) {
          console.log('找回密码发送邮件失败，' + err);
          returnData = {code: -1, msg: '发送重置密码邮件失败'};
          return;
        }
        console.log('发送成功');
        returnData = {code: 0, msg: '找回密码的邮件已经发送至您的邮箱，请注意查收'};
        cb(null, returnData);
      });
    });
  };

  Email.remoteMethod(
    'getEmails', {
      accepts: {
        arg: 'userid',
        type: 'string'
      },
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
