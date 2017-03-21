import {log, promiseHandle} from './utils/util';
import Api from 'utils/api/api';

App({
  onLaunch: function() {
    wx.login({
      success: function(res) {
        var code = res.code;
          if (code) {
          console.log('获取用户登录凭证：' + code);
          // --------- 发送凭证 ------------------
          wx.request({
            url: Api.getSessionId(code),
            success: function(res){
              console.log(res);
            },
            fail: function(err){
              console.log(err);
            }
          })
          // ------------------------------------
        } else {
          console.log('获取用户登录态失败：' + res.errMsg);
        }
      }
    });
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