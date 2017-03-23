'use strict';
var app = require('../server.js');
var path = require('path');
var http = require('http');
var request = require('request');
var querystring = require('querystring');
var uuid = require('uuid'); //用于生成sessionid
var redis = require('redis'),
  redis_port = 6379,
  redis_host = '127.0.0.1',
  redis_pwd = '123456',
  redis_opts = { auth_pass: redis_pwd };

module.exports = function (Myappuser) {
  Myappuser.fundBackPwd = function (email, cb) {
    var app = Myappuser.app;
    var returnData = {};
    app.models.myAppUser.find({ where: { email: email } }, function (err, res) {
      if (err) {
        console.log('找回密码接口查询出错，' + err);
        returnData = { code: -1, msg: '邮箱不存在' };
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
          returnData = { code: -1, msg: '发送重置密码邮件失败' };
          return;
        }
        console.log('发送成功');
        returnData = { code: 0, msg: '找回密码的邮件已经发送至您的邮箱，请注意查收' };
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

  Myappuser.sayHi = function (callback) {//定义一个http接口方法
    callback(null, 'hi');
  };
  Myappuser.remoteMethod(//把方法暴露给http接口
    'sayHi',
    {
      'accepts': [],
      'returns': [
        { 'arg': 'result', 'type': 'string' }
      ],
      'http': {
        'verb': 'get',
        'path': '/say-hi'
      }
    }
  );
  //处理微信登录
  Myappuser.getSessionId = function (wxcode, cb) {
    //向官方服务器请求session信息
    var qsdata = {
      grant_type: 'authorization_code',
      appid: 'wx98fdadcaaeac5160',
      secret: 'ccf815819dcb6761416ed28cf488f4cf',
      js_code: wxcode
    };
    var content = querystring.stringify(qsdata);
    request('https://api.weixin.qq.com/sns/jscode2session?' + content, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var wxdata = JSON.parse(body);
        //当微信服务器返回正确
        if (wxdata.session_key && wxdata.openid) {
          var session_key = wxdata.session_key;
          var openid = wxdata.openid;
          //使用uuid生成一个唯一字符串sessionid作为键，将openid和session_key作为值，存入redis，超时时间设置为2小时
          var sessionid = uuid.v4(); //uuid.v4()随机生成一个唯一标识，uuid.v1()是基于当前时间戳生成唯一标识
          var keyValue = '{session_key: ' + session_key + ', openid: ' + openid + '}';
          console.log('sessionid: ' + sessionid + ', keyValue: ' + keyValue);
          //查询openid是否和user里的auth对应起来，如果没有则认为是新用户，需要注册一个

          var redisClient = redis.createClient(redis_port, redis_host, redis_opts); //连接redis
          redisClient.auth(redis_pwd, function () {
            console.log('redis通过认证');
          });
          //连接redis
          redisClient.on('connect', function () {
            //设置单个值和获取单个值
            redisClient.set(sessionid, keyValue, redis.print);//格式：client.set(key,value,[callback])， redis.print：简便的回调函数，测试时显示返回值
            redisClient.expire(sessionid, 7*24*60*60);
            redisClient.get(sessionid, function (err, reply) {
              if(reply){
                cb(null, { code: 0, sessionid: sessionid });
              }else{
                cb(null, { code: -1, errmsg: 'redis存储sessionid失败' });
              }
            }); //格式：client.get(key,[callback])
            redisClient.quit();
          });

          // redisClient.on('ready', function (res) {
          //   console.log('redis is ready....');
          // });
        } else {
          cb(null, { code: -1, errmsg: wxdata.errmsg });
        }
      }
    });

  };
  Myappuser.remoteMethod(
    'getSessionId',
    {
      'accepts': {
        arg: 'wxcode',
        type: 'string',
        description: 'weixin code'
      },
      'returns': [
        { 'arg': 'data', 'type': 'string' }
      ],
      'http': {
        'verb': 'get',
        'path': '/getSessionId'
      }
    }
  );

  //检查sessionid是否过期
  Myappuser.checkLogin = function (sessionid, cb) {
    var redisClient = redis.createClient(redis_port, redis_host, redis_opts); //连接redis
    redisClient.auth(redis_pwd, function () {
      console.log('redis通过认证');
    });
    //连接redis
    redisClient.on('connect', function () {
      //获取sessionid
      redisClient.get(sessionid, function (err, reply) {
        if(reply){
          cb(null, { code: 0, isEffect: 1 });
        }else{
          cb(null, { code: 0, isEffect: 0 });
        }
      }); //格式：client.get(key,[callback])
      redisClient.quit();
    });
  };
  Myappuser.remoteMethod(
    'checkLogin',
    {
      'accepts': [{
        arg: 'sessionAndUuid',
        type: 'string',
        description: '客户端缓存的sessionid和userid'
      },
      {
        arg: 'rawData',
        type: 'string',
        description: '不包含敏感信息的rawData'
      },
      {
        arg: 'signature',
        type: 'string',
        description: '用于校验用户信息'
      },
      {
        arg: 'encryptedData',
        type: 'string',
        description: '包括敏感数据在内的完整用户信息的加密数据'
      },
      {
        arg: 'vi',
        type: 'string',
        description: 'session id'
      }
      ],
      'returns': [
        { 'arg': 'data', 'type': 'string' }
      ],
      'http': {
        'verb': 'get',
        'path': '/checkSessionId'
      }
    }
  );

  //判断微信用户是否已经注册过
  Myappuser.isRegistedByWx = function (wxcode, cb) {
    var redisClient = redis.createClient(redis_port, redis_host, redis_opts); //连接redis
    redisClient.auth(redis_pwd, function () {
      console.log('redis通过认证');
    });
    //连接redis
    redisClient.on('connect', function () {
      //获取sessionid
      redisClient.get(sessionid, function (err, reply) {
        if(reply){
          cb(null, { code: 0, isEffect: 1 });
        }else{
          cb(null, { code: 0, isEffect: 0 });
        }
      }); //格式：client.get(key,[callback])
      redisClient.quit();
    });
  };
  Myappuser.remoteMethod(
    'checkSessionId',
    {
      'accepts': {
        arg: 'sessionid',
        type: 'string',
        description: 'session id'
      },
      'returns': [
        { 'arg': 'data', 'type': 'string' }
      ],
      'http': {
        'verb': 'get',
        'path': '/checkSessionId'
      }
    }
  );

  Myappuser.afterRemote('create', function(context, userInstance, next) {
    console.log('> user.afterRemote triggered');

    var options = {
      type: 'email',
      to: userInstance.email,
      from: 'andyliwr@outlook.com',
      subject: 'Thanks for registering.',
      // template: path.resolve(__dirname, '../../server/views/verify.ejs'),
      redirect: '/verified',
      user: Myappuser
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
