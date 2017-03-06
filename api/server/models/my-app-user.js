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

  //在创建完用户之后发送验证码
  Myappuser.afterRemote('create', function(context, userInstance, next) {
    console.log('> user.afterRemote triggered');

    var options = {
      type: 'email',
      to: userInstance.email,
      from: 'noreply@loopback.com',
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../server/views/verify.ejs'),
      redirect: '/verified',
      user: user
    };

    userInstance.verify(options, function(err, response, next) {
      if (err) return next(err);

      console.log('> verification email sent:', response);

      context.res.render('response', {
        title: 'Signed up successfully',
        content: 'Please check your email and click on the verification link ' -
            'before logging in.',
        redirectTo: '/',
        redirectToLinkText: 'Log in'
      });
    });
  });
};
