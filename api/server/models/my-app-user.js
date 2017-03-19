'use strict';
var app = require('../server.js');
var path = require('path');

module.exports = function(Myappuser) {
  Myappuser.fundBackPwd = function (email, cb) {
    var app = Myappuser.app;
    var returnData = {};
    app.models.myAppUser.find({where: {email: email}}, function(err, res){
    	if(err){
    		console.log('找回密码接口查询出错，'+err);
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
      app.models.email.send(emailOptions, function(err, res){
        if(err){
          console.log('找回密码发送邮件失败，'+err);
          returnData = {code: -1, msg: '发送重置密码邮件失败'};
          return;
        }
        console.log('发送成功');
        returnData = {code: 0, msg: '找回密码的邮件已经发送至您的邮箱，请注意查收'};
        cb(null, returnData);
      });
    });
  };

  //使用remoteMethod去注册远程方法
  Myappuser.remoteMethod(
    'fundBackPwd', {
      accepts: {
        arg: 'email',
        type: 'string'
      },
      returns: {
        arg: 'data',
        type: 'object'
      }
    }
  );

  Myappuser.sayHi = function(callback) {//定义一个http接口方法
    callback(null, 'hi');
  };
  Myappuser.remoteMethod(//把方法暴露给http接口
    'sayHi',
    {
      'accepts': [],
      'returns':[
        {'arg': 'result','type': 'string'}
      ],
      'http':{
        'verb': 'get',
        'path': '/say-hi'
      }
    }
  );
  Myappuser.afterRemote('create',function(context, user, next) {//注册后的回调
    console.log("> user.afterRemote triggered");
    var option={//配置邮件发送参数
      type: 'email',
      to: user.email, //邮件接收方，即注册时填入的有限地址
      from: '408523614@qq.com',//邮件发送方
      subject: 'Thanks for registering.',//发送的邮件标题
      redirect: '/'//点击发送到邮件的链接激活账号后的回调http地址
    };
    user.verify(option, next);
  })
};
