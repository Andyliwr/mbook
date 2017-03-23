import { log, promiseHandle } from './utils/util';
import { getSessionId, checkLogin, isRegistedByWx } from 'utils/api/api';

//主程序
App({
  onLaunch: function () {
    var self = this;
    //从缓存中读取sessionid
    // wx.setStorageSync('sessionAndUuid', ''); //test
    var sessionAndUuid = wx.getStorageSync('sessionAndUuid');//sessionAndUuid由sessionId和userId组成
    if(sessionAndUuid){
      var success = function(){
        self.globalData.sessionAndUuid = sessionAndUuid;
        // wx.showToast({ title: '已登录', icon: 'success', duration: 100 });
        // //2s后隐藏提示
        // setTimeout(function () { wx.hideToast() }, 2000);
      };
      var fail = function(){
        self.doLogin();
      };
      self.checkLoginEffect(sessionAndUuid, success, fail);
    }else{
      //用户未登录，记下来判断用户是否注册
      wx.navigateTo({url: '/pages/login/wxlogin/wxlogin'});
    }
  },
  /**
   * 获取微信用户的详细信息，包括头像，昵称，城市...
   * @param cb 回调函数 
   */
  getwxUserInfo(cb) {
    if (typeof cb !== "function") return;
    let that = this;
    if (that.globalData.userInfo) {
      cb(that.globalData.userInfo);
    } else {
      promiseHandle(wx.login).then(() => promiseHandle(wx.getUserInfo)).then(res => {
        that.globalData.userInfo = res.userInfo;
        cb(res);
      }).catch(err => {
        log(err);
      });
    }
  },
  /**
   * 检查缓存中的sessionid的值是否过期
   * @param sessionid_local 本地sessionId
   * @param successCb 成功的回调，服务器redis不存在改sessionId
   * @param failCb 失败的回调
   */
  checkLoginEffect: function(sessionAndUuid, successCb, failCb){
    var self = this;
    self.getwxUserInfo(function(res){
      console.log(res);
      wx.request({
        url: checkLogin(),
        method:'POST',
        data: {
          sessionAndUuid: sessionAndUuid,
          rawData: res.rawData,
          signature: res.signature,
          encryptedData: res.encryptedData,
          v1: v1
        },
        success (res) {
          var tmpdata = res.data.data;
          if(tmpdata.code == 0 && tmpdata.isEffect == 1){
            if(typeof successCb == "function"){
              successCb();
            }
          }else{
            console.log("发送验证sessionid请求接口返回错误， "+tmpdata.errMsg);
            if(typeof failCb == "function"){
              failCb();
            }
          }
        },
        fail (e) {
          console.error("发送验证sessionid的请求失败， "+e);
          if(typeof failCb == "function"){
            failCb();
          }
        }
      });
    });
    // if(sessionid_local){
    //   wx.request({
    //     url: checkLogin(sessionid_local),
    //     method:'GET',
    //     success (res) {
    //       var tmpdata = res.data.data;
    //       if(tmpdata.code == 0 && tmpdata.isEffect == 1){
    //         if(typeof successCb == "function"){
    //           successCb();
    //         }
    //       }else{
    //         console.log("发送验证sessionid请求接口返回错误， "+tmpdata.errMsg);
    //         if(typeof failCb == "function"){
    //           failCb();
    //         }
    //       }
    //     },
    //     fail (e) {
    //       console.error("发送验证sessionid的请求失败， "+e);
    //       if(typeof failCb == "function"){
    //         failCb();
    //       }
    //     }
    //   });
    // }else{
    //   if(typeof failCb == "function"){
    //     failCb();
    //   }
    // }
  },
  //执行登录操作
  doLogin: function(){
    var self = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        if (code) {
          console.log('获取用户登录凭证：' + code);
          // --------- 发送凭证 ------------------
          wx.request({
            url: getSessionId(code),
            success: function (res) {
              var tmpdata = res.data.data;
              if (tmpdata.code == 0) {
                //如果登录成功，将sessionid存储在本地缓存中
                wx.setStorage({ key: "sessionid", data: tmpdata.sessionid });
                self.globalData.sessionId = tmpdata.sessionid;
                wx.showToast({ title: '登录成功', icon: 'success', duration: 100 });
                //2s后隐藏提示
                setTimeout(function () { wx.hideToast() }, 2000);
              } else {
                console.log("登录失败, " + tmpdata.errMsg);
                //todo 失败的处理
                self.loginFail();
              }
            },
            fail: function (err) {
              console.log("登录失败, " + err);
              //todo 失败的处理
              self.loginFail();
            }
          })
          // ------------------------------------
        } else {
          console.log('获取用户登录态失败：' + res.errMsg);
          self.loginFail();
        }
      }
    });
  },
  //登录失败的处理函数
  loginFail: function(){
    var self = this;
    wx.showModal({
      title: '提示',
      content: '登录失败，请检查网络后重试...',
      success: function (res) {
        if (res.confirm) {
          //重新登录
          self.doLogin();
        }
      }
    });
  },
  globalData: {
    userInfo: null,
    sessionId: ''
  },

  //自定义配置
  settings: {
    debug: true, //是否调试模式
  }
});