//login.js
let Api = require('../../utils/api/api');
let Util = require('../../utils/util');
let app = getApp();
Page({
    data: {
        rankData: [],
        currentIndex: 0
    },
    onLoad: function () {
        var self = this;
        //options rankType
        // console.log(options.bookId);
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        success: function (res) {
                            console.log("用户已授权获取个人信息,信息内容为:")
                            console.info(res)
                        }
                    })
                } else {
                    console.log("用户未授权获取个人信息");
                    //未授权跳转到授权页面
                    // wx.redirectTo({ url: '/pages/registe/registe' });
                }
            }
        });
        // wx.request({
        //     url: Api.getRank(options.rankType),
        //     header: { 'content-type': 'application/json' },
        //     success: function (res) { }
        // });

    },
    bindGetUserInfo: function (e) {
        let self = app;
        //将获取的信息传到后端
        console.log(e);
        if (typeof e.detail.userInfo == "undefined") {
            console.log("用户拒绝授权");
            return false;
        }
        wx.login({
            success: function (res) {
                let code = res.code;
                console.log('获取用户登录凭证：' + code);
                if (code) {
                    //拿到用户详细信息
                    let res = e.detail;
                    let sendData = {
                        wxcode: code,
                        userInfo: JSON.stringify(res.userInfo),
                        rawData: res.rawData,
                        signature: res.signature,
                        encryptedData: res.encryptedData,
                        iv: res.iv
                    };
                    wx.request({
                        url: Api.getSessionId(code),
                        method: 'POST',
                        data: sendData,
                        success: function (res) {
                            var tmpdata = res.data.data;
                            if (tmpdata.code == 0) {
                                //如果用户未绑定myappuser
                                if (tmpdata.redirectParam) {
                                    self.globalData.registerParam = tmpdata.redirectParam;
                                    wx.redirectTo({
                                        url: '/pages/login/wxlogin/wxlogin'
                                    });
                                } else {
                                    //如果登录成功，将sessionid存储在本地缓存中
                                    wx.setStorage({
                                        key: "sessionid",
                                        data: tmpdata.sessionid
                                    });
                                    wx.setStorage({
                                        key: "id",
                                        data: {
                                            userid: tmpdata.userid,
                                            openid: tmpdata.openid
                                        }
                                    });
                                    self.globalData.sessionId = tmpdata.sessionid;
                                    if (typeof callback == "function") {
                                        callback();
                                    }
                                    wx.showToast({
                                        title: '登录成功',
                                        icon: 'success',
                                        duration: 100
                                    });
                                    //2s后隐藏提示
                                    setTimeout(function () {
                                        wx.hideToast()
                                    }, 2000);
                                }
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
                }
            }
        });
    },
    showRank: function (event) {
        this.setData({
            currentIndex: event.currentTarget.dataset.index
        });
    }
});