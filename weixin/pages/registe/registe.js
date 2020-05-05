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
        // wx.getSetting({
        //     success(res) {
        //         if (res.authSetting['scope.userInfo']) {
        //             // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        //             wx.getUserInfo({
        //                 success: function (res) {
        //                     console.log("用户已授权获取个人信息,信息内容为:")
        //                     console.info(res)
        //                 }
        //             })
        //         } else {
        //             console.log("用户未授权获取个人信息");
        //             //未授权跳转到授权页面
        //             // wx.redirectTo({ url: '/pages/registe/registe' });
        //         }
        //     }
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
        wx.showLoading({
            title: '授权登录中',
          })
        app.doLogin(function(){
            wx.hideLoading();
            wx.switchTab({
                url: '/pages/booklist/booklist'
              })
        });
    },
    showRank: function (event) {
        this.setData({
            currentIndex: event.currentTarget.dataset.index
        });
    }
});