import { log, promiseHandle } from './utils/util';
import Api from 'utils/api/api';

//执行登录的函数
function doLogin() {
  wx.login({
    success: function (res) {
      var code = res.code;
      if (code) {
        console.log('获取用户登录凭证：' + code);
        // --------- 发送凭证 ------------------
        wx.request({
          url: Api.getSessionId(code),
          success: function (res) {
            var tmpdata = res.data.data;
            if (tmpdata.code == 0) {
              //如果登录成功，将sessionid存储在本地缓存中
              wx.setStorage({ key: "sessionid", data: tmpdata.sessionid });
              wx.showToast({ title: '登录成功', icon: 'success', duration: 100 });
              //2s后隐藏提示
              setTimeout(function () { wx.hideToast() }, 2000);
            } else {
              console.log("登录失败, " + tmpdata.errMsg);
              //todo 失败的处理
              loginFail();
            }
          },
          fail: function (err) {
            console.log("登录失败, " + err);
            //todo 失败的处理
            loginFail();
          }
        })
        // ------------------------------------
      } else {
        console.log('获取用户登录态失败：' + res.errMsg);
        loginFail();
      }
    }
  });
}

//登录失败的处理
function loginFail(){
  wx.showModal({
    title: '提示',
    content: '登录失败，请检查网络后重试...',
    success: function (res) {
      if (res.confirm) {
        //重新登录
        doLogin();
      }
    }
  });
}

//检查缓存中的sessionid的值是否过期
function checkSessionId(sessionid_local){
  if(sessionid_local){
    wx.request({
      url: Api.checkSessionId(sessionid_local),
      method:'GET',
      success (res) {
        var tmpdata = res.data.data;
        if(tmpdata.code == 0 && tmpdata.isEffect == 1){
          return true;
        }else{
          console.log("发送验证sessionid请求接口返回错误， "+tmpdata.errMsg);
          return false;
        }
      },
      fail (e) {
        console.error("发送验证sessionid的请求失败， "+e);
        return false;
      }
    });
  }else{
    return false;
  }
}

//主程序
App({
  onLaunch: function () {
    //从缓存中读取sessionid
    var sessionid_local = wx.getStorageSync('sessionid');
    if(sessionid_local && checkSessionId(sessionid_local)){
      // wx.showToast({ title: '已登录', icon: 'success', duration: 100 });
      // //2s后隐藏提示
      // setTimeout(function () { wx.hideToast() }, 2000);
    }else{
      doLogin();
    }
  },
  getUserInfo(cb) {
    if (typeof cb !== "function") return;
    let that = this;
    if (that.globalData.userInfo) {
      cb(that.globalData.userInfo);
    } else {
      promiseHandle(wx.login).then(() => promiseHandle(wx.getUserInfo)).then(res => {
        that.globalData.userInfo = res.userInfo;
        cb(that.globalData.userInfo);
      }).catch(err => {
        log(err);
      });
    }
  },

  globalData: {
    userInfo: null
  },

  //自定义配置
  settings: {
    debug: true, //是否调试模式
    moreLink: 'http://github.com/oopsguy'
  }
});