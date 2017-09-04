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
    isShowLoading: false,
    userInfoFromApp: null,
    err_tips_data: { err_tips_show: false, err_tips_text: '' },
    username: '',
    email: '',
    password: '',
    nickName: '',
    city: '',
    address: ''
  },
  onLoad: function (options) {
    var self = this;
    if (app.globalData.registerParam) {
      self.setData({
        userInfoFromApp: {
          openid: app.globalData.registerParam.openid,
          avatar: app.globalData.registerParam.avatar,
          nickName: app.globalData.registerParam.nickName,
          gender: app.globalData.registerParam.gender
        }, nickName: app.globalData.registerParam.nickName
      });
      //获取完清除全局变量的缓存
      app.globalData.registerParam = null;
    }
    // 获取当前地理位置
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        // 向高德请求地址转换
        console.log(Api.getPosition(latitude, longitude));
        wx.request({
          url: Api.getPosition(latitude, longitude),
          method: 'GET',
          success: function(res){
            console.log(res);
            self.setData({city: res.data.regeocode.addressComponent.city, address: res.data.regeocode.addressComponent.country + ' ' + res.data.regeocode.addressComponent.city + ' ' + res.data.regeocode.addressComponent.district});
          },
          fail: function(err){
            console.log('地址转换失败');
          }
        })
      },
      fail: function(){
        console.log('获取定位失败');
      }
    });
  },
  //监听用户输入
  userInput: function (event) {
    var self = this;
    var type = event.target.dataset.type;
    switch (type) {
      case 'username':
        self.setData({ username: event.detail.value });
        break;
      case 'email':
        self.setData({ email: event.detail.value });
        break;
      case 'password':
        self.setData({ password: event.detail.value });
        break;
      case 'nickname':
        self.setData({ nickName: event.detail.value });
        break;
      case 'city':
        self.setData({ city: event.detail.value });
        break;
    }
  },
  //用户改变性别
  genderChange: function (event) {
    var self = this;
    var genderSelect = (event.target.dataset.gender == 'male' ? 1 : 0);
    self.setData({ userInfoFromApp: { openid: self.data.userInfoFromApp.openid, avatar: self.data.userInfoFromApp.avatar, nickName: self.data.userInfoFromApp.nickName, gender: genderSelect } })
  },
  confirmRegiste: function (event) {
    var self = this;
    //设置button的loading显示
    self.setData({ isShowLoading: true });
    //校验
    var usernameReg = /^[0-9a-zA-Z]{4,16}$/; // 4-16位
    var emailReg = /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/;
    var passwordReg = /^[a-zA-Z\d_]{8,}$/; //最少8位
    var nickNameReg = /^[\u4e00-\u9fa5\w]{2,8}$/; //2-8位数字或者字母或者中文
    var cityReg = /^[\u4e00-\u9fa5\w]{2,10}$/; //2-10位数字或者字母或者中文
    if (usernameReg.test(self.data.username)) {
      if (emailReg.test(self.data.email)) {
        if (passwordReg.test(self.data.password)) {
          if (nickNameReg.test(self.data.nickName)) {
            if (cityReg.test(self.data.city)) {
              //校验成功，开始注册
              var registeData = {
                "nickName": self.data.nickName,
                "realm": '',
                "signature": '',
                "age": -1,
                "avatar": self.data.userInfoFromApp.avatar + '?imageView2/1/w/60/h/60/format/jpg/interlace/1/q/75|imageslim', // 调用七牛的图片处理api
                "gender": self.data.userInfoFromApp.gender,
                "myBooks": [],
                "setting": [],
                "hasReadTime": 0,
                "continueReadDay": 0,
                "address": self.data.address,
                "auth": "{\"type\": \"wechat\", \"wxOpenId\": \"" + self.data.userInfoFromApp.openid + "\"}",
                "username": self.data.username,
                "email": self.data.email,
                "password": self.data.password,
                "emailVerified": true
              };
              wx.request({
                url: Api.registe(),
                method: 'POST',
                data: registeData,
                success: function (res) {
                  var tmpData = res.data;
                  //注册成功，缓存userid和openid
                  if(tmpData.id){
                    var idStr = JSON.stringify({userid: tmpData.id, openid: self.data.userInfoFromApp.openid});
                    wx.setStorageSync("id", idStr);
                    //登录,  wx.navigateTo 和 wx.redirectTo 不允许跳转到 tabbar 页面，只能用 wx.switchTab 跳转到 tabbar 页面
                    app.doLogin(function(){wx.switchTab({ url: '../../booklist/booklist' })});
                  }else{
                    // 提示错误
                    var msg = tmpData.error.details.messages;
                    var msgArr = [];
                    for(var i in msg){
                      msgArr.push(msg[i][0]);
                    }
                    Util.showErrMsg(self, msgArr.join(' ,'), 1500);
                  }
                },
                fail: function (err) {
                  console.log('注册失败， ' + err);
                }
              });
            } else {
              Util.showErrMsg(self, '请输入所在城市', 1500);
            }
          } else {
            Util.showErrMsg(self, '请输入2-8位的昵称', 1500);
          }
        } else {
          Util.showErrMsg(self, '请输入至少8位数字或者字母组成的密码', 1500);
        }
      } else {
        Util.showErrMsg(self, '请输入有效邮箱', 1500);
      }
    } else {
      Util.showErrMsg(self, '请输入4-16字母或者数字组成的用户名', 1500);
    }
  },
  uploadAvatar: function () {
    wx.hideToast();
    wx.showToast({ title: '上传中', icon: 'loading', duration: 300 })
    initQiniu();
    var self = this;
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed'], //压缩图片
      count: 1, //最多一张
      success: function (res) {
        //七牛上传文件
        var filePath = res.tempFilePaths[0];
        // self.setData({
        //   userInfoFromApp: { openid: self.data.userInfoFromApp.openid, avatar: res.tempFilePaths[0], nickName: self.data.userInfoFromApp.nickName, gender: self.data.userInfoFromApp.gender }
        // });
        qiniuUploader.upload(filePath, (res) => {
          console.log(res);
          //更新图片地址
          self.setData({
            userInfoFromApp: { openid: self.data.userInfoFromApp.openid, avatar: res.imageURL, nickName: self.data.userInfoFromApp.nickName, gender: self.data.userInfoFromApp.gender }
          });
          wx.hideToast();
          wx.showToast({ title: '上传成功', icon: 'success', duration: 2000 });
          setTimeout(function () { wx.hideToast() }, 2000)
        }, (error) => {
          console.error('error: ' + JSON.stringify(error));
        }, self.data.userInfoFromApp.openid);
      },
      fail: function (err) {
        console.log("选择图片失败, " + err);
      }
    })
  },
  gotoRegiste: function () {
    wx.navigateTo({
      url: '../../registe/registe'
    })
  }
});