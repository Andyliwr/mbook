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
    err_page_data: null, //app状态页
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
      var cityReg = /^[\u4e00-\u9fa5\w ]{2,18}$/; //2-10位数字或者字母或者中文
      var numberReg = /\d+/;
      if (nickNameReg.test(self.data.nickname)) {
        if (emailReg.test(self.data.email)) {
          var updateData = {};
          updateData.nickname = self.data.nickname;
          updateData.email = self.data.email;
          if(self.data.realm && realNameReg.test(self.data.realm)){
            updateData.realm = self.data.realm;
          }
          if(self.data.age && numberReg.test(self.data.age)){
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
          var userid = wx.getStorageSync('id').userid;
          wx.request({
            url: Api.updateUserInfo(),
            method: 'POST',
            data: {userid: userid, info: updateData},
            success: function (res) {
              var tmpData = res.data.data;
              //注册成功，缓存userid和openid
              if(tmpData.code == 0){
                console.log('更新个人信息成功');
                wx.showToast({
                  title: '修改成功',
                  icon: 'success',
                  duration: 0
                });
                setTimeout(function(){
                  wx.hideToast()
                }, 2000)
                self.setData({changeOrSubmit: true});
                //更新缓存中的userInfo
                self.getUserInfo(userid);
              }
            },
            fail: function (err) {
              console.log('注册失败， ' + err);
              self.setData({errTips: '更新个人信息失败', changeOrSubmit: false});
            }
          });
        } else {
         self.setData({errTips: '请输入有效邮箱', changeOrSubmit: false});
        }
      } else {
        self.setData({errTips: '请输入2-10字母或、数字或者中文组成的昵称', changeOrSubmit: false});
      }
    }else{
      self.setData({changeOrSubmit: !self.data.changeOrSubmit});
    }
  },
  getUserInfo: function (userid) {
    wx.request({
      url: Api.getUserInfo(userid),
      success: function (res) {
        var tmpData = res.data.data;
        if (tmpData && tmpData.code == 0) {
          //将书单数据缓存到本地
          wx.setStorage({
            key: 'userInfo',
            data: tmpData.info,
            success: function (res) {
              console.log('成功更新本地缓存中用户信息');
            }
          });
        } else {
          console.log('请求用户信息失败....');
          Util.showErrMsg(self, '获取个人信息失败', 1000);
        }
      },
      fail: function (err) {
        console.log(err);
        self.setData({
          err_page_data: {
            show: true,
            image_url: 'https://olpkwt43d.qnssl.com/myapp/err_tips/network_err.png',
            text: '努力找不到网络>_<请检查后重试',
            buttonText: '重试',
            click: 'getUserInfo'
          }
        });
      }
    });
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
  },
  // 生日输入框的输入事件
  userInput: function(e){
    var self = this;
    var type = e.currentTarget.dataset.type;
    switch(type){
      case 'nickname':
        self.setData({nickname: e.detail.value});
        break;
      case 'email':
        self.setData({email: e.detail.value});
        break;
      case 'realm':
        self.setData({realm: e.detail.value});
        break;
      case 'age':
        self.setData({age: e.detail.value});
        break;
      case 'birthday':
        self.setData({birthday: e.detail.value});
        break;
      case 'address':
        self.setData({address: e.detail.value});
        break;
      case 'signature':
        self.setData({signature: e.detail.value});
        break;
    }
  }
})