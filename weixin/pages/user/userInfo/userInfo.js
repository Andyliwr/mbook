//today.js
var Api = require('../../../utils/api/api');
var util = require('../../../utils/util');

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
    hasBookNum: 0
  },
  onLoad: function () {
    var self = this;
    // 从缓存中读取用户信息
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        self.setData({avatar: res.data.avatar, hasReadTime: res.data.hasReadTime, continueReadDay: res.data.continueReadDay, hasBookNum: res.data.books, address: res.data.address, signature: res.data.signature, email: res.data.email, nickname: res.data.nickName, birthday: res.data.birthday, realm: res.data.realm, age: res.data.age})
        console.log('从缓存中读取个人信息成功');
      }
    });
  },
  headimgError: function () {
    this.setData({avatar: 'https://olpkwt43d.qnssl.com/myApp/unknown_headimg.png?imageView2/1/w/60/h/60/format/jpg/interlace/1/q/75|imageslim'});
  }
})