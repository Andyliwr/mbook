'use strict';
//在模型脚本中可以直接require ／server/server 获得app对象，一旦你获得了app对象，你可以通过app的models属性轻易得到你想要的模型对象。
var loopback = require('loopback');
var app = require('../server.js');
var LoopBackContext = require('loopback-context');

module.exports = function (Factionrank) {
  //定义一个简单的远程方法
  Factionrank.greet = function (msg, cb) {
    //然后使用Factionrank.app获取到app对象
    var app = Factionrank.app;
    //获取datasources
    // var datasources = app.datasources.db;

    //一旦你在config.js中启用了context，你可以通过使用loopback.getCurrentContext()来获取当前上下文对象
    // var ctx = LoopBackContext.getCurrentContext(); //context默认去除，官方说有很多bug，建议使用loopback-context，详情http://loopback.io/doc/en/lb2/Using-current-context.html#configure-context-propagation
    // console.log(ctx);
    // var currentUser = ctx && ctx.get('currentUser');
    // console.log('currentUser.username: ', currentUser.username); // voila!
    // // Set more information on current context
    // ctx.set('foo', { bar: 'val' } );
    //地址：https://github.com/strongloop/loopback/issues/878

    // console.log(app.models.factionlists.find({}));
    cb(null, 'Greetings... ' + msg);
  };

  //使用remoteMethod去注册远程方法
  Factionrank.remoteMethod(
    'greet', {
      accepts: {
        arg: 'msg',
        type: 'string'
      },
      returns: {
        arg: 'greeting',
        type: 'string'
      }
    }
  );

  //单独获取起点小说排行榜
  Factionrank.getQdRank = function (msg, cb) {
    cb(null, 'Greetings... ' + msg);
  };

  //使用remoteMethod去注册远程方法
  Factionrank.remoteMethod(
    'greet', {
      accepts: { //定义远程方法接受的参数。这些参数对应你model对应静态方法的参数，arg也可以是JSON数组，以此来定义多个参数
        arg: 'msg', //参数名
        type: 'string',//参数类型
        description: '需要输入的名字'
      },
      returns: { //描述远程方法callback的参数, 默认returns是一个空数组[]
        arg: 'greeting',
        type: 'string',
        description: '返回的参数是一句问候语句' //一段描述参数的文本
      },
      http: {path: '/sayhi', verb: 'get'}, //path是暴露的url，verb是什么请求类型---get,post,put,del,all
      description: [
        "description：这是一个远程方法的范本,",
        "范本，哈哈，哈哈."], // 方法的描述, 可以把一个长的描述分割成数段放到一个字符串数组中去
    }
  );
};
