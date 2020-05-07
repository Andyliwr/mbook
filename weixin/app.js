import { log, promiseHandle } from './utils/util';
import { getSessionId, checkSessionId, isRegistedByWx } from './utils/api/api';

//主程序
App({
  onLaunch: function () {
    var self = this;
    //从缓存中读取sessionid
    // wx.clearStorageSync();
    var sessionId = wx.getStorageSync('sessionid');//sessionAndUuid由sessionId和userId组成
    if (sessionId) {
      self.checkSessionEffect(sessionId);
    } else {
      //用户未登录，接下来判断用户是否注册
      self.doLogin();
      // wx.redirectTo({url: '/pages/login/wxlogin/wxlogin'});
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
  checkSessionEffect: function (sessionId) {
    var self = this;
    if (sessionId) {
      wx.request({
        url: checkSessionId(sessionId),
        method: 'GET',
        success(res) {
          var tmpdata = res.data.data;
          if (tmpdata.code == 0 && tmpdata.isEffect == 1) {
            self.globalData.sessionId = sessionId;
            console.log('已登录，sessionid有效');
            // wx.showToast({ title: '已登录', icon: 'success', duration: 100 });
            // //2s后隐藏提示
            // setTimeout(function () { wx.hideToast() }, 2000);
          } else {
            console.log("发送验证sessionid请求接口返回错误， " + tmpdata.errMsg);
            self.doLogin();
          }
        },
        fail(e) {
          console.error("发送验证sessionid的请求失败， " + e);
          self.doLogin();
        }
      });
    } else {
      self.doLogin();
    }
  },
  //执行登录操作
  doLogin: function (callback) {
    var self = this;
    wx.getSetting({
      success(res) {
        //判断下用户是否授权
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 登录,getUserInfo 获取头像昵称

          //请求网络接口前进加载在提示
          wx.showLoading({
            title: '自动登录中',
          })
          //登录
          wx.login({
            success: function (res) {
              var code = res.code;
              console.log('获取用户登录凭证：' + code);
              wx.getUserInfo({
                success: function (res) {
                  console.log(res);
                  if (res.userInfo && res.rawData && res.signature && res.encryptedData && res.iv) {
                    var loginData = {
                      wxcode: code,
                      userInfo: JSON.stringify(res.userInfo),
                      rawData: res.rawData,
                      signature: res.signature,
                      encryptedData: res.encryptedData,
                      iv: res.iv
                    };
                    // --------- 发送凭证 ------------------
                    wx.request({
                      url: getSessionId(code),
                      method: 'POST',
                      data: loginData,
                      success: function (res) {
                        var tmpdata = res.data.data;
                        if (tmpdata.code == 0) {
                          //如果用户未绑定user
                          if (tmpdata.redirectParam) {
                            self.globalData.registerParam = tmpdata.redirectParam;
                            wx.redirectTo({ url: '/pages/login/wxlogin/wxlogin' });
                          } else {
                            //如果登录成功，将sessionid存储在本地缓存中
                            self.globalData.loginFlag = true;
                            wx.setStorage({ key: "sessionid", data: tmpdata.sessionid });
                            var idStr = JSON.stringify({ userid: tmpdata.userid, openid: tmpdata.openid });
                            wx.setStorage({ key: "id", data: idStr });
                            wx.setStorage({ key: "id", data: { userid: tmpdata.userid, openid: tmpdata.openid } });
                            self.globalData.sessionId = tmpdata.sessionid;
                            if (typeof callback == "function") {
                              callback();
                            }
                            wx.showToast({ title: '登录成功', icon: 'success', duration: 2000 });
                          }
                        } else {
                          console.log("登录失败,后台返回的结果不是成功, ", tmpdata.errMsg);
                          //todo 失败的处理
                          self.loginFail();
                        }
                      },
                      fail: function (err) {
                        console.log("登录发送凭证失败, ", err);
                        //todo 失败的处理
                        self.loginFail();
                      },
                      complete() {
                        //无论成功与否,先结束加载框
                        wx.hideLoading();
                      }
                    })
                    // ------------------------------------
                  } else {
                    console.log('getUserInfo返回数据错误');
                    self.loginFail();
                  }
                },
                fail: function (err) {
                  console.log("登录失败, ", err);
                  //todo 失败的处理
                  self.loginFail();
                }
              });
            },
            fail(e) {
              //网络不好,微信授权失败
              console.log("登录失败,未通过微信登录授权方法: ", err);
              //todo 失败的处理
              self.loginFail();
            }
          });

        } else {
          console.log("用户未授权个人信息获取权限");
          //判断当前页面是否为授权登录页面
          // let currentPage = getCurrentPages();
          // let currentPageName = currentPage[currentPage.length - 1].route;
          // if (currentPageName == "pages/registe/registe") {
          //   console.log("当前页面为注册页面,提示用户允许授权")
          //   wx.showToast({ title: '授权登录失败!请允许授权', icon: 'none', duration: 100 });
          //   //2s后隐藏提示
          //   setTimeout(function () { wx.hideToast() }, 2000);
          // } else {
            console.log("当前页面不是注册页面,跳转到注册页面...")
            wx.redirectTo({ url: "/pages/registe/registe" });
          // }
        }
      },
      fail: function (e) {
        //应该不会报这个错误,微信获取用户授权记录的方法调用失败
        console.log("登录失败,未通过微信获取用户授权记录的方法: ", err);
        //todo 失败的处理
        self.loginFail();
      }
    });
  },
  //登录失败的处理函数
  loginFail: function () {
    var self = this;
    wx.hideLoading();
    wx.hideToast();
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
    sessionId: '',
    registerParam: null,
    loginFlag: false,
  },

  //自定义配置
  settings: {
    debug: true, //是否调试模式
  }
});
