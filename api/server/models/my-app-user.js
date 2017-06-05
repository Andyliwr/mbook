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
  redis_opts = {auth_pass: redis_pwd};

var crypto = require('crypto');//加密解密
var eventproxy = require('eventproxy');//并发控制
var APPID = 'wx98fdadcaaeac5160';
var SECRET = 'ccf815819dcb6761416ed28cf488f4cf';
//上传个人头像到七牛云服务器
var qiniu = require('qiniu');
var QINIU_BUCKET = 'andyliwr-server';//上传空间名
qiniu.conf.ACCESS_KEY = 't5tBss9FrousfymdmFw4ki2fscwZ8qGaIw8SZmX8';
qiniu.conf.SECRET_KEY = 'uASYB6XxzJy9tLWeGsLaNaQyX4bVafIVh6Dpgvxo';
qiniu.conf.SCHEME = 'https';
qiniu.conf.UP_HTTPS_HOST = 'https://up-z2.qbox.me';
var promise = require('bluebird');
var tools = require('../tools/tool');


module.exports = function (Myappuser) {
  Myappuser.fundBackPwd = function (email, cb) {
    var app = Myappuser.app;
    var returnData = {};
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
    Myappuser.find({username: 'lidikang'})
      .then(function (res) {
        console.log(res);
        callback(null, 'hi');
      })
      .catch(function (err) {
        console.log(err);
      });
    // var app = Myappuser.app;
    // app.models.factioncontents.find({res: '大主宰'})
    //   .limit(1).project({sectionNum: 1})
    //   .then(function(res){
    //     console.log(res);
    //     callback(null, 'hi');
    //   })
    //   .catch(function (err) {
    //     console.log(err);
    //   });
  };
  Myappuser.remoteMethod(//把方法暴露给http接口
    'sayHi',
    {
      'accepts': [],
      'returns': [
        {'arg': 'result', 'type': 'string'}
      ],
      'http': {
        'verb': 'get',
        'path': '/say-hi'
      }
    }
  );
  //处理微信登录
  Myappuser.getSessionId = function (wxcode, userInfo, rawData, signature, encryptedData, iv, cb) {
    var ep = new eventproxy();
    ep.all('hasFinishedWx', function (returnData) {
      if (returnData.code == (-1)) {
        cb(null, {code: -1, errmsg: returnData.errMsg});
        return;
      }
      //核对信息的有效性,数据签名校验
      var shasum = crypto.createHash('sha1');
      shasum.update(rawData + returnData.data.session_key);
      var signature2 = shasum.digest('hex');
      if (signature2 == signature) {
        //暂时不需要，因为小程序未认证，unionid拿不到，暂时就是用接口返回回来的openid
        //数据签名核对成功，个人信息无误，接下来base64解密获取opendid和unionid
        // var sessionKey = new Buffer(returnData.data.session_key, 'base64');
        // var newEncryptedData = new Buffer(encryptedData, 'base64');
        // var newIv = new Buffer(iv, 'base64');

        // try {
        //   // 解密
        //   var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, newIv)
        //   // 设置自动 padding 为 true，删除填充补位
        //   decipher.setAutoPadding(true)
        //   var decoded = decipher.update(newEncryptedData, 'binary', 'utf8')
        //   decoded += decipher.final('utf8')

        //   decoded = JSON.parse(decoded)

        // } catch (err) {
        //   throw new Error('Illegal Buffer');
        //   cb(null, { code: -1, errmsg: '解密用户openid和unionid失败' });
        // }

        // if (decoded.watermark.appid !== APPID) {
        //   throw new Error('Illegal Buffer')
        //   cb(null, { code: -1, errmsg: '解密得到的水印中appid不正确' });
        // } else {
        //   console.log('微信用户'+decoded.nickName+'请求登录, openid为：'+decoded.openId+'.....');
        // }

        //检查这个openid是否已经绑定了myappuser的用户
        var checkRegisteEp = new eventproxy();
        checkRegisteEp.all('hasFinishedCheck', function (checkData) {
          if (checkData) {
            if (checkData.code == (-1)) {
              cb(null, {code: -1, errmsg: checkData.errMsg});
            } else {
              if (checkData.isRegisted == 0) {
                //用户未注册,导向微信注册页
                var userData = JSON.parse(userInfo);
                var city = ((userData.country == 'CN' ? 'China' : userData.country) + ' ' + userData.province + ' ' + userData.city).trim();
                cb(null, {
                  code: 0,
                  redirectParam: {
                    openid: checkData.openid,
                    nickName: userData.nickName,
                    city: city,
                    avatar: userData.avatarUrl,
                    gender: userData.gender
                  }
                });
              } else {
                //用户已经注册，执行登录
                //使用uuid生成一个唯一字符串sessionid作为键，将openid和session_key作为值，存入redis，超时时间设置为2小时
                var sessionid = uuid.v4(); //uuid.v4()随机生成一个唯一标识，uuid.v1()是基于当前时间戳生成唯一标识
                var keyValue = '{session_key: ' + checkData.session_key + ', openid: ' + checkData.openid + '}';
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
                  redisClient.expire(sessionid, 7 * 24 * 60 * 60);
                  redisClient.get(sessionid, function (err, reply) {
                    if (reply) {
                      cb(null, {code: 0, sessionid: sessionid, userid: checkData.userid, openid: checkData.openid});
                    } else {
                      cb(null, {code: -1, errmsg: 'redis存储sessionid失败'});
                    }
                  }); //格式：client.get(key,[callback])
                  redisClient.quit();
                });

                // redisClient.on('ready', function (res) {
                //   console.log('redis is ready....');
                // });
              }
            }
          } else {
            cb(null, {code: -1, errmsg: '查询myappuser失败，未找到和当前openid对应的用户'});
          }
        });

        var openidReg = new RegExp(returnData.data.openid, 'ig');
        // todo 这个查找过滤条件无法生效，原因暂未查明
        Myappuser.find({auth: openidReg}, function (err, res) {
          var checkData = null;
          if (err) {
            console.log('查询myappuser失败，' + err);
            checkData = {code: -1, errMsg: '查询myappuser失败，' + err};
            checkRegisteEp.emit('hasFinishedCheck', checkData);
            return;
          }

          //过滤不合格的用户
          var thisUserArr = res.filter(function (item) {
            return openidReg.test(item.auth);
          });

          if (thisUserArr.length) {
            console.log('openid为' + JSON.parse(thisUserArr[0].auth).wxOpenId + '的用户已经绑定了myappuser的账号' + thisUserArr[0].username + ', userId为' + thisUserArr[0].id + '...');
            checkData = {
              code: 0,
              isRegisted: 1,
              userid: thisUserArr[0].id,
              openid: returnData.data.openid,
              session_key: returnData.data.session_key
            };
          } else {
            console.log('用户openid: ' + returnData.data.openid + ' 未绑定myappuser账号');
            checkData = {code: 0, isRegisted: 0, openid: returnData.data.openid};
          }
          checkRegisteEp.emit('hasFinishedCheck', checkData);
        });
      } else {
        cb(null, {code: -1, errmsg: '微信登录信息数字签名失败'});
      }
    });

    //向官方服务器请求session信息
    var qsdata = {
      grant_type: 'authorization_code',
      appid: APPID,
      secret: SECRET,
      js_code: wxcode
    };
    var content = querystring.stringify(qsdata);
    request('https://api.weixin.qq.com/sns/jscode2session?' + content, function (error, response, body) {
      var returnData = null;
      if (!error && response.statusCode == 200) {
        var wxdata = JSON.parse(body);
        //当微信服务器返回正确
        if (wxdata.session_key && wxdata.openid) {
          returnData = {code: 0, data: {session_key: wxdata.session_key, openid: wxdata.openid}}
        } else {
          returnData = {code: -1, errMsg: '使用code交换openid和session_key接口返回失败' + wxdata.errmsg}
        }
      } else {
        returnData = {code: -1, errMsg: '使用code交换openid和session_key接口返回失败' + wxdata.errmsg}
      }
      ep.emit('hasFinishedWx', returnData);
    });

  };
  Myappuser.remoteMethod(
    'getSessionId',
    {
      'accepts': [{
        arg: 'wxcode',
        type: 'string',
        description: 'weixin code'
      },
        {
          arg: 'userInfo',
          type: 'string',
          description: '用户信息对象，不包含 openid 等敏感信息'
        },
        {
          arg: 'rawData',
          type: 'string',
          description: '不包括敏感信息的原始数据字符串，用于计算签名'
        },
        {
          arg: 'signature',
          type: 'string',
          description: '使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息'
        },
        {
          arg: 'encryptedData',
          type: 'string',
          description: '包括敏感数据在内的完整用户信息的加密数据'
        },
        {
          arg: 'iv',
          type: 'string',
          description: '加密算法的初始向量'
        }],
      'returns': [
        {'arg': 'data', 'type': 'string'}
      ],
      'http': {
        'verb': 'post',
        'path': '/getSessionId'
      }
    }
  );

  //检查sessionid是否过期
  Myappuser.checkSessionId = function (sessionid, cb) {
    var redisClient = redis.createClient(redis_port, redis_host, redis_opts); //连接redis
    redisClient.auth(redis_pwd, function () {
      console.log('redis通过认证');
    });
    //连接redis
    redisClient.on('connect', function () {
      //获取sessionid
      redisClient.get(sessionid, function (err, reply) {
        if (reply) {
          cb(null, {code: 0, isEffect: 1});
        } else {
          cb(null, {code: 0, isEffect: 0});
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
        description: '客户端缓存的sessionid和userid'
      },
      'returns': [
        {'arg': 'data', 'type': 'string'}
      ],
      'http': {
        'verb': 'get',
        'path': '/checkSessionId'
      }
    }
  );

  //获取上传个人头像的token值
  Myappuser.getUploadToken = function (key, cb) {
    //key值应该由客户端指定，否则会导致前端和后端因为key值不一样致使上传失败
    var putPolicy = new qiniu.rs.PutPolicy(QINIU_BUCKET + ':' + key);
    cb(null, putPolicy.token());
  };
  Myappuser.remoteMethod(
    'getUploadToken',
    {
      'accepts': {
        arg: 'key',
        type: 'string',
        description: '上传到到七牛云服务器之后的图片名字'
      },
      'returns': [
        {'arg': 'uptoken', 'type': 'string'}
      ],
      'http': {
        'verb': 'get',
        'path': '/getUploadToken'
      }
    }
  );

  //获取用户所有的书籍
  Myappuser.getMyBooks = function (userid, cb) {
    Myappuser.findById(userid, {myBooks: 1, _id: 0}, {}, function (err, res) {
      if (err || !res) {
        console.log('用户id错误，' + err);
        cb(null, {code: -1, errMsg: '用户id错误'});
        return;
      }
      //查询书籍详情信息
      var app = Myappuser.app;
      var getBookDetailEp = new eventproxy();
      var allMyBooks = res.myBooks;
      getBookDetailEp.after('hasFinishedDetail', allMyBooks.length, function (booksResult) {
        try {
          var successBooks = booksResult.filter(function (bookDetailItem) {
            return (bookDetailItem.success === 1) && bookDetailItem.name && bookDetailItem.headImage
          });
          //整理即将返回的数据
          var finalArr = successBooks.map(function (successItem) {
            successItem.bookid = allMyBooks[successItem.index].bookid;
            successItem.hasRead = allMyBooks[successItem.index].hasRead;
            delete successItem.index;
            delete successItem.success;
            return successItem;
          });
          cb(null, {code: 0, books: finalArr});
        } catch (err) {
          console.log(err);
          cb(null, {code: -1, data: '查询个人书单失败，try-catch报错'});
        }

      });
      allMyBooks.forEach(function (item, index) {
        app.models.factionlists.findById(item.bookid, {id: 0, sectionArray: 0}, {}, function (err, res) {
          //不存在还是会查询成功，但是应该返回错误
          if (err || !res) {
            console.log('查询书单错误项：' + item.bookid);
            getBookDetailEp.emit('hasFinishedDetail', {
              success: 0,
              index: index,
              name: '',
              author: '',
              des: '',
              headImage: '',
              newest: '',
              updateTime: ''
            });
          } else {
            //处理起点小说网的图片url
            var urlReg = new RegExp('^\/\/.*\\r\\n$', 'ig');
            var headImage = res.headerImage;
            if (urlReg.test(headImage)) {
              headImage = 'http:' + headImage.substring(0, headImage.length - 2);
            }
            getBookDetailEp.emit('hasFinishedDetail', {
              success: 1,
              index: index,
              name: res.factionName,
              author: res.author,
              des: res.des,
              headImage: headImage,
              newest: res.newest,
              updateTime: tools.formatDate(res.updateTime)
            });
          }
          //对于每本书需要查询他的最新章节
          // var getBookNewestNum = new eventproxy();
          // getBookNewestNum.all('hasFinishedNewest', function(newestNum){
          //   getBookDetailEp.emit('hasFinishedDetail', {success: 1, index: index, name: res.factionName, headImage: res.headerImage, newest: newest, updateTime: res.updateTime});
          // });
          //
          // var resReg = new RegExp(res.factionName, 'ig');
          // app.models.factioncontents.find({res: resReg}, {limit: 1, sort: {sectionNum: 1}}, function(contentErr, contentRes){
          //   if(contentErr || !contentRes){
          //     console.log('查询 |'+ contentRes.res + '| 出错，'+contentErr);
          //     getBookNewestNum.emit('hasFinishedNewest', contentRes);
          //   }
          // });
        });
      })
    });//Model.find(query, fields, options, callback)
  };
  Myappuser.remoteMethod(
    'getMyBooks',
    {
      'accepts': {
        arg: 'userid',
        type: 'string',
        description: '用户id'
      },
      'returns': [
        {'arg': 'data', 'type': 'string'}
      ],
      'http': {
        'verb': 'get',
        'path': '/getMyBooks'
      }
    }
  );
  //add a book, operation by User
  Myappuser.addMyBooks = function (userid, bookids, cb) {
    //拿到书籍的详细信息
    if (typeof userid === 'string' && typeof bookids === 'string') {
      var bookidArr = bookids.split(',');
      //对传入的数据做验证，只有booklist中存在的id才是被加进来
      var app = Myappuser.app;
      var getBookDetailEp = new eventproxy();
      getBookDetailEp.after('hasFinishedDetail', bookidArr.length, function (booksResult) {
        var trueBookidArr = booksResult.filter(function (item) {
          return item.success === 1
        });

        //更新myappuser的书单数组，先获取后更新
        Myappuser.findById(userid, {id: 0, sectionArray: 0}, function (err, res) {
          if (err || !res) {
            cb(null, {code: -1, errMsg: '更新前查询我的书单失败'});
          } else {
            //整理数据，准备存入
            var beforeConcatArr = trueBookidArr.map(function (bookItem) {
              return {hasRead: 0, bookid: bookItem.bookid}
            });
            var afterConcatArr = beforeConcatArr.concat(res.myBooks);
            //final去重
            var finalArr = [];
            afterConcatArr.forEach(function (finalItem) {
              //判断是否在finalArray中
              if (finalArr.length > 0) {
                var isInFinalArray = finalArr.some(function (testItem) {
                  return testItem.bookid === finalItem.bookid;
                });
                if (!isInFinalArray) {
                  finalArr.push(finalItem);
                } else {
                  console.log('更新书单重复项: ' + finalItem.bookid);
                }
              } else {
                finalArr.push(finalItem);
              }
            });
            Myappuser.update({id: userid}, {myBooks: finalArr}, function (err, res) {
              if (err) {
                cb(null, {code: -1, errMsg: '更新我的书单失败'});
              } else {
                cb(null, {code: 0, successMsg: '书单添加成功'});
              }
            });
          }
        });
      });
      bookidArr.forEach(function (item) {
        app.models.factionlists.findById(item, {id: 0, sectionArray: 0}, {}, function (err, res) {
          //不存在还是会查询成功，但是应该返回错误
          if (err || !res) {
            console.log('查询书单错误项：' + item);
            getBookDetailEp.emit('hasFinishedDetail', {success: 0, bookid: item});
            return;
          }
          getBookDetailEp.emit('hasFinishedDetail', {success: 1, bookid: item});
        });
      })
    } else {
      cb(null, {code: -1, errMsg: '传入参数有误'});
    }
  };
  Myappuser.remoteMethod(
    'addMyBooks',
    {
      'accepts': [{
        arg: 'userid',
        type: 'string',
        description: '用户id'
      }, {
        arg: 'bookids',
        type: 'string',
        description: '书籍id'
      }],
      'returns': [
        {'arg': 'data', 'type': 'string'}
      ],
      'http': {
        'verb': 'post',
        'path': '/addMyBooks'
      }
    }
  );
  //删除书架里的书籍
  Myappuser.deleteMyBooks = function (userid, bookids, cb) {
    //拿到书籍的详细信息
    if (typeof userid === 'string' && typeof bookids === 'string') {
      var bookidArr = bookids.split(',');
      //对传入的数据做验证，只有booklist中存在的id才是被加进来
      var app = Myappuser.app;
      var getBookDetailEp = new eventproxy();
      getBookDetailEp.after('hasFinishedDetail', bookidArr.length, function (booksResult) {
        var trueBookidArr = booksResult.filter(function (item) {
          return item.success === 1
        });

        //更新myappuser的书单数组，先获取后更新
        Myappuser.findById(userid, {id: 0, sectionArray: 0}, function (err, res) {
          if (err || !res) {
            cb(null, {code: -1, errMsg: '更新前查询我的书单失败'});
          } else {
            //去除要删除的项
            var finalArr = res.myBooks;
            res.myBooks.forEach(function (everyBook, index) {
              //判断是否在finalArray中
              var isInFinalArray = trueBookidArr.some(function (testItem) {
                return testItem.bookid === everyBook.bookid;
              });
              if (isInFinalArray) {
                finalArr[index].needdingDelete = true;
                console.log('需删除书单项: ' + finalArr[index].bookid);
              }
            });
            //去掉那些带needdingDelete标记的finalArr
            var lastArray = finalArr.filter(function (item) {
              return !item.needdingDelete
            });
            if (lastArray.length !== res.myBooks.length) {
              Myappuser.update({id: userid}, {myBooks: lastArray}, function (err, res) {
                if (err) {
                  cb(null, {code: -1, errMsg: '删除我的书单失败'});
                } else {
                  cb(null, {code: 0, successMsg: '书单删除成功'});
                }
              });
            } else {
              cb(null, {code: -1, errMsg: '原书单找不到该书籍'});
            }
          }
        });

      });
      bookidArr.forEach(function (item) {
        app.models.factionlists.findById(item, {id: 0, sectionArray: 0}, {}, function (err, res) {
          //不存在还是会查询成功，但是应该返回错误
          if (err || !res) {
            console.log('查询书单错误项：' + item);
            getBookDetailEp.emit('hasFinishedDetail', {success: 0, bookid: item});
            return;
          }
          getBookDetailEp.emit('hasFinishedDetail', {success: 1, bookid: item});
        });
      })
    } else {
      cb(null, {code: -1, errMsg: '传入参数有误'});
    }
  };
  Myappuser.remoteMethod(
    'deleteMyBooks',
    {
      'accepts': [{
        arg: 'userid',
        type: 'string',
        description: '用户id'
      }, {
        arg: 'bookids',
        type: 'string',
        description: '书籍id'
      }],
      'returns': [
        {'arg': 'data', 'type': 'string'}
      ],
      'http': {
        'verb': 'post',
        'path': '/deleteMyBooks'
      }
    }
  );

  //用户退出阅读器之前更新已阅读章节
  Myappuser.updateHasRead = function (userid, bookid, hasRead, cb) {//定义一个http接口方法
    Myappuser.findById(userid, {id: 0, sectionArray: 0}, function (err, res) {
      if (err || !res) {
        cb(null, {code: -1, errMsg: 'hasRead更新前查询我的书单失败'});
      } else {
        var myBooks = res.myBooks;
        var hasThisBook = false;
        var finalMyBooks = myBooks.map(function (item, index) {
          if (item.bookid === bookid) {
            hasThisBook = true;
            item.hasRead = hasRead;
          }
          return item
        });
        if (hasThisBook === false) {
          cb(null, {code: -1, errMsg: '未找到该书单id'});
        } else {
          Myappuser.update({id: userid}, {myBooks: finalMyBooks}, function (err, res) {
            if (err || !res) {
              cb(null, {code: -1, errMsg: '已阅读章节更新失败'});
            } else {
              cb(null, {code: 0, successMsg: '已阅读章节更新成功'});
            }
          });
        }
      }
    });
  };
  Myappuser.remoteMethod(//把方法暴露给http接口
    'updateHasRead',
    {
      'accepts': [
        {
          arg: 'userid',
          type: 'string',
          description: '用户id'
        }, {
          arg: 'bookid',
          type: 'string',
          description: '书籍id'
        }, {
          arg: 'hasRead',
          type: 'number',
          description: '已阅读章节'
        }
      ],
      'returns': [
        {'arg': 'result', 'type': 'string'}
      ],
      'http': {
        'verb': 'get',
        'path': '/updateHasRead'
      }
    }
  );

  Myappuser.getUserInfo = function (userid, cb) {
    Myappuser.findById(userid)
      .then(function (res) {
        if (res) {
          var returnData = {
            "age": res.age || 0,
            "nickName": res.nickName || '',
            "birthday": res.birthday || '',
            "signature": res.signature || '',
            "address": res.address || '',
            "books": res.myBooks.length || 0,
            "avatar": res.avatar || 'https://olpkwt43d.qnssl.com/myApp/unknown_headimg.png?imageView2/1/w/60/h/60/format/jpg/interlace/1/q/75|imageslim',
            "gender": res.gender,
            "realm": res.realm || '',
            "username": res.username,
            "email": res.email || '',
            "hasReadTime": res.hasReadTime,
            "continueReadDay": res.continueReadDay
          }
          cb(null, {code: 0, info: returnData});
        } else {
          cb(null, {code: -1, errMsg: '获取到的用户信息为空'});
        }

      })
      .catch(function (err) {
        console.log(err);
        cb(null, {code: -1, errMsg: 'userid不合法，获取用户信息失败'});
      })
  };

  Myappuser.remoteMethod(
    'getUserInfo',
    {
      'accepts': {
        arg: 'userid',
        type: 'string',
        description: '用户id'
      },
      'returns': [
        {'arg': 'data', 'type': 'string'}
      ],
      'http': {
        'verb': 'get',
        'path': '/getUserInfo'
      }
    }
  );

  // 更新个人信息
  Myappuser.updateUserInfo = function (userid, info, cb) {
    Myappuser.findById(userid)
      .then(function (res) {
        if (res) {
          if(info){
            var newAge = info.age || res.age || 0;
            var newNickName = info.nickName || res.nickName;
            var newGender = info.gender || res.gender;
            var newBirthday = info.birthday || res.birthday;
            var newSignature = info.signature || res.signature;
            var newAddress = info.address || res.address;
            var newAvatar = info.avatar || res.avatar || 'https://olpkwt43d.qnssl.com/myApp/unknown_headimg.png?imageView2/1/w/60/h/60/format/jpg/interlace/1/q/75|imageslim';
            var newRealm = info.realm || res.realm;
            Myappuser.update({id: userid}, {age: newAge, nickName: newNickName, birthday: newBirthday, signature: newSignature, address: newAddress, gender: newGender, avatar: newAvatar, realm: newRealm}, function (err, res) {
              if (err || !res) {
                console.log(err);
                cb(null, {code: -1, errMsg: '个人信息更新失败'});
              } else {
                cb(null, {code: 0, successMsg: '个人信息更新成功'});
              }
            });
          }else{
            cb(null, {code: -1, errMsg: '用户信息参数为空'});
          }
        } else {
          cb(null, {code: -1, errMsg: '获取到的用户信息为空'});
        }

      })
      .catch(function (err) {
        console.log(err);
        cb(null, {code: -1, errMsg: 'userid不合法，获取用户信息失败'});
      })
  };

  Myappuser.remoteMethod(
    'updateUserInfo',
    {
      'accepts': [{
        arg: 'userid',
        type: 'string',
        description: '用户id'
      },{
        arg: 'info',
        type: 'object',
        description: '用户信息obj'
      }],
      'returns': [
        {'arg': 'data', 'type': 'string'}
      ],
      'http': {
        'verb': 'post',
        'path': '/updateUserInfo'
      }
    }
  );

  // 统计阅读时长
  Myappuser.countReadTime = function (userid, addtime, cb) {
    Myappuser.findById(userid)
      .then(function (res) {
        if (res) {
          if (typeof addtime === 'number') {
            var newtime = (res.hasReadTime ? res.hasReadTime : 0) + addtime;
            Myappuser.update({id: userid}, {hasReadTime: newtime}, function (err, res) {
              if (err || !res) {
                cb(null, {code: -1, errMsg: '阅读时长更新失败'});
              } else {
                cb(null, {code: 0, successMsg: '阅读时长更新成功'});
              }
            });
          } else {
            cb(null, {code: -1, errMsg: '时间参数格式错误'});
          }
        } else {
          cb(null, {code: -1, errMsg: '获取到的用户信息为空'});
        }

      })
      .catch(function (err) {
        console.log(err);
        cb(null, {code: -1, errMsg: 'userid不合法，获取用户信息失败'});
      })
  };

  Myappuser.remoteMethod(
    'countReadTime',
    {
      'accepts': [{
        arg: 'userid',
        type: 'string',
        description: '用户id'
      }, {
        arg: 'addtime',
        type: 'number',
        description: '新增的阅读时间，以分钟为单位'
      }],
      'returns': [
        {'arg': 'data', 'type': 'string'}
      ],
      'http': {
        'verb': 'post',
        'path': '/countReadTime'
      }
    }
  );

  // 统计累计阅读天数
  Myappuser.continueReadDay = function (userid, cb) {
    Myappuser.findById(userid)
      .then(function (res) {
        if (res) {
          var newDays = (res.continueReadDay ? (res.continueReadDay + 1) : 1);
          Myappuser.update({id: userid}, {continueReadDay: newDays}, function (err, res) {
            if (err || !res) {
              cb(null, {code: -1, errMsg: '累计阅读天数更新失败'});
            } else {
              cb(null, {code: 0, successMsg: '累计阅读天数更新成功'});
            }
          });
        } else {
          cb(null, {code: -1, errMsg: '获取到的用户信息为空'});
        }
      })
      .catch(function (err) {
        console.log(err);
        cb(null, {code: -1, errMsg: 'userid不合法，获取用户信息失败'});
      })
  };

  Myappuser.remoteMethod(
    'continueReadDay',
    {
      'accepts': {
        arg: 'userid',
        type: 'string',
        description: '用户id'
      },
      'returns': [
        {'arg': 'data', 'type': 'string'}
      ],
      'http': {
        'verb': 'get',
        'path': '/continueReadDay'
      }
    }
  );

  Myappuser.getAllUser = function (cb) {
    Myappuser.find({ fields: { id: true, username: true, nickName: true }})
      .then(function (res) {
        if (res) {
          if(res instanceof Array){
            let resultData = [];
            res.forEach(function(item){
              let tmpData = {
                userid: item.id,
                username: item.username,
                nickname: item.nickName
              };
              resultData.push(tmpData);
            });
            cb(null, {code: 0, data: resultData});
          }else{
            cb(null, {code: -1, errMsg: '获取到的用户列表失败'});
          }
        } else {
          cb(null, {code: -1, errMsg: '获取到的用户列表失败'});
        }
      })
      .catch(function (err) {
        console.log(err);
        cb(null, {code: -1, errMsg: 'userid不合法，获取到的用户列表失败'});
      })
  };

  Myappuser.remoteMethod(
    'getAllUser',
    {
      'returns': [
        {'arg': 'data', 'type': 'string'}
      ],
      'http': {
        'verb': 'get',
        'path': '/getAllUser'
      }
    }
  );

  // Myappuser.afterRemote('create', function (context, userInstance, next) {
  //   console.log('> user.afterRemote triggered');

  //   var options = {
  //     type: 'email',
  //     to: userInstance.email,
  //     from: 'andyliwr@outlook.com',
  //     subject: 'Thanks for registering.',
  //     // template: path.resolve(__dirname, '../../server/views/verify.ejs'),
  //     redirect: '/verified',
  //     user: Myappuser
  //   };

  //   userInstance.verify(options, function (err, response, next) {
  //     if (err) return next(err);

  //     console.log('> verification email sent:', response);

  //     context.res.render('response', {
  //       title: 'Signed up successfully',
  //       content: 'Please check your email and click on the verification link ' -
  //       'before logging in.',
  //       redirectTo: '/',
  //       redirectToLinkText: 'Log in'
  //     });
  //   });
  // });
};
