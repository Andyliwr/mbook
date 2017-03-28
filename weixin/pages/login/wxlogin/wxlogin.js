//wxlogin.js
var Api = require('../../../utils/api/api');
var qiniuUploader = require('../../../utils/qiniuUpload');
var Util = require('../../../utils/util');

// 初始化七牛相关参数
function initQiniu(callback) {
  var options = {
    region: 'SCN', // 华东区，生产环境应换成自己七牛帐户bucket的区域
    uptokenURL: Api.getUploadToken(), // 生产环境该地址应换成自己七牛帐户的token地址，具体配置请见server端
    domain: 'https://olpkwt43d.qnssl.com/' // 生产环境该地址应换成自己七牛帐户对象存储的域名
  };
  qiniuUploader.init(options);
}

//获取应用实例
var app = getApp();
Page({
    data: {
    	rankData: [],
        currentIndex: 0,
        isShowLoading: true,
        userInfoFromApp: null,
        err_tips_data: {err_tips_show: false, err_tips_text: ''}
    },
    onLoad: function(options) {
        var self = this;
        if(app.globalData.registerParam){
          self.setData({userInfoFromApp: {openid: app.globalData.registerParam.openid, avatar: app.globalData.registerParam.avatar, nickName: app.globalData.registerParam.nickName, city: app.globalData.registerParam.city, gender: app.globalData.registerParam.gender}});
          //获取完清除全局变量的缓存
          app.globalData.registerParam = null;
        }
    },
    confirmLogin: function(event){
        var self = this;
        //设置button的loading显示
        self.setData({isShowLoading: true});
        app.getwxUserInfo(function(userinfo){

        });
    },
    uploadAvatar: function(){
      wx.hideToast();
      wx.showToast({title: '上传中',icon: 'loading',duration: 300})
      initQiniu();
      var  self = this;
      wx.chooseImage({
        sourceType: ['camera', 'album'],
        sizeType: ['compressed'], //压缩图片
        count: 1, //最多一张
        success: function (res) {
          //七牛上传文件
          var filePath = res.tempFilePaths[0];
          qiniuUploader.upload(filePath, (res) => {
            console.log(res);
            //更新图片地址
            self.setData({
              userInfoFromApp: {openid: self.data.userInfoFromApp.openid, avatar: res.imageURL, nickName: self.data.userInfoFromApp.nickName, city: self.data.userInfoFromApp.city, gender: self.data.userInfoFromApp.gender}
            });
            wx.hideToast();
            wx.showToast({title: '上传成功',icon: 'success',duration: 1000});
            setTimeout(function(){wx.hideToast()},2000)
          }, (error) => {
            console.error('error: ' + JSON.stringify(error));
          },self.data.userInfoFromApp.openid);
        },
        fail: function(err){
          console.log("选择图片失败, "+err);
        }
      })
    },
    gotoRegiste: function(){
      wx.navigateTo({
        url: 'pages/registe/registe'
      })
    }
});