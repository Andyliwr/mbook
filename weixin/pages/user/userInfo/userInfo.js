//today.js
var Api = require('../../../utils/api/api');
var util = require('../../../utils/util');
var qiniuUploader = require('../../../utils/qiniuUpload');

// 初始化七牛相关参数
function initQiniu(callback) {
  var options = {
    region: 'SCN', // 华东区，生产环境应换成自己七牛帐户bucket的区域
    uptokenURL: Api.getUploadToken(), // 生产环境该地址应换成自己七牛帐户的token地址，具体配置请见server端
    domain: 'https://olpkwt43d.qnssl.com/' // 生产环境该地址应换成自己七牛帐户对象存储的域名
  };
  qiniuUploader.init(options);
}

Page({
  data: {
    age: '',
    nickname: '',
    birthday: '',
    signature: '',
    address: '',
    realm: '',
    email: '',
    avatar: '',
    hasReadTime: 0,
    continueReadDay: 0,
    hasBookNum: 0,
    changeOrSubmit: true, // 用户正在执行的操作，是修改（true）还是已经修改好了准备提交（false）
    errTips: '',
    err_tips_data: { err_tips_show: false, err_tips_text: '' },
    is_click_img: false // 是否点击了上传头像
  },
  onLoad: function () {
    var self = this;
    // 从缓存中读取用户信息
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        self.setData({avatar: res.data.avatar, hasReadTime: res.data.hasReadTime, continueReadDay: res.data.continueReadDay, hasBookNum: res.data.books, address: res.data.address, signature: res.data.signature, email: res.data.email, nickname: res.data.nickName, birthday: res.data.birthday, realm: res.data.realm, age: (res.data.age > 0 ? res.data.age : '')})
        console.log('从缓存中读取个人信息成功');
      }
    });
  },
  headimgError: function () {
    this.setData({avatar: 'https://olpkwt43d.qnssl.com/myApp/unknown_headimg.png?imageView2/1/w/60/h/60/format/jpg/interlace/1/q/75|imageslim'});
  },
  // 表单提交事件
  formSubmit: function () {
    var self = this;
    // 只有当前处于提交状态才会执行下面的代码
    if(!self.data.changeOrSubmit){
      // 校验合法性
      var emailReg = /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/;
      var passwordReg = /^[a-zA-Z\d_]{8,}$/; //最少8位
      var nickNameReg = /^[\u4e00-\u9fa5\w]{2,8}$/; //2-8位数字或者字母或者中文
      var realNameReg = /^[\u4e00-\u9fa5\w]{2,8}$/; //2-8位数字或者字母或者中文
      var cityReg = /^[\u4e00-\u9fa5\w]{2,18}$/; //2-10位数字或者字母或者中文
      if (nickNameReg.test(self.data.nickname)) {
        if (emailReg.test(self.data.email)) {
          var updateData = {};
          updateData.nickname = self.data.nickname;
          updateData.email = self.data.email;
          if(self.data.realm && realNameReg.test(self.data.realm)){
            updateData.realm = self.data.realm;
          }
          if(self.data.age && (typeof self.data.age === 'number')){
            updateData.age = self.data.age;
          }
          if(self.data.birthday && (typeof self.data.birthday === 'string')){
            updateData.birthday = self.data.birthday;
          }
          if(self.data.address && cityReg.test(self.data.address)){
            updateData.address = self.data.address;
          }
          if(self.data.signature && (typeof self.data.signature === 'string')){
            updateData.signature = self.data.signature;
          }
          if(self.data.avatar && self.data.is_click_img){
            updateData.avatar = self.data.avatar;
          }
          wx.request({
            url: Api.updateUserInfo(),
            method: 'POST',
            data: updateData,
            success: function (res) {
              var tmpData = res.data;
              //注册成功，缓存userid和openid
              if(tmpData.id){
                var idStr = JSON.stringify({userid: tmpData.id, openid: self.data.userInfoFromApp.openid});
                wx.setStorageSync("id", idStr);
                //登录,  wx.navigateTo 和 wx.redirectTo 不允许跳转到 tabbar 页面，只能用 wx.switchTab 跳转到 tabbar 页面
                app.doLogin(function(){wx.switchTab({ url: '../../booklist/booklist' })});
              }
            },
            fail: function (err) {
              console.log('注册失败， ' + err);
            }
          });
        } else {
          Util.showErrMsg(self, '请输入有效邮箱', 1500);
        }
      } else {
        Util.showErrMsg(self, '请输入4-16字母或者数字组成的用户名', 1500);
      }
    }
    self.setData({changeOrSubmit: !self.data.changeOrSubmit});
  },
  uploadAvatar: function () {
    wx.hideToast();
    wx.showToast({ title: '上传中', icon: 'loading', duration: 300 })
    initQiniu();
    var self = this;
    self.setData({is_click_img: false});
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed'], //压缩图片
      count: 1, //最多一张
      success: function (res) {
        //七牛上传文件
        var filePath = res.tempFilePaths[0];
        // self.setData({avatar: res.tempFilePaths[0]});
        qiniuUploader.upload(filePath, (res) => {
          console.log(res);
          //更新图片地址
          self.setData({avatar: res.imageURL, is_click_img: true});
          wx.hideToast();
          wx.showToast({ title: '上传成功', icon: 'success', duration: 2000 });
          setTimeout(function () { wx.hideToast() }, 2000)
        }, (error) => {
          console.error('error: ' + JSON.stringify(error));
        }, wx.getStorageSync('id').openid);
      },
      fail: function (err) {
        console.log("选择图片失败, " + err);
      }
    })
  }
})