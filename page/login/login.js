//login.js
var Api = require('../../util/api/api.js');
var util = require('../../util/util.js');

Page({
  data: {
    welcome_text: "Hello, here is FlowerHeart.",
    umt: '',
    password: '',
    err_tips_data: null,
    toast_data: null,
    // 定义密码是否可见
    password_input_type: 'password',
    see_password_class: 'see-password-icon'
  },
  onReady: function() {
    var self = this;
    //检查缓存中是否有token
    wx.getStorage({
      key: 'token',
      success: function(res) {
          console.log(res.data);
      } 
    });
  },
  doLogin: function(event){
    var self = this,
        umt = event.detail.value.umt,
        password = event.detail.value.password,
        telOrname = util.judgeTelOrName(umt),
        loginData = null;

    if(telOrname == 'using_name'){
      loginData = {'username': umt, 'password': password};
    }else if(telOrname == 'using_email'){
      loginData = {'email': umt, 'password': password};
    }else{
      //错误处理
      self.setData({err_tips_data: {err_tips_show: true, err_tips_text: '您输入的用户名或邮箱不合法'}, umt: ''});
      //3s后隐藏错误处理
      setTimeout(function(){
        self.setData({err_tips_data: {err_tips_show: false, err_tips_text: ''}});
      }, 3000);
    }
    
    wx.request({
      method: "POST",
      url: Api.login(),
      data: loginData,
      // header: { 'Content-Type': 'application/json' },
      success: function (res) {
        if(res.data.userId){
          self.setData({toast_data: {toast_show: true, toast_text: '登录成功', toast_icon_type:'success-toast-icon'}});
          //3s后隐藏错误处理
          setTimeout(function(){
            self.setData({toast_data: {toast_show: false, toast_text: '', toast_icon_type:'success-toast-icon'}});
            // 存储token
            wx.setStorage({
              key:"token",
              data: res.data
            })
            //去到index页
            wx.navigateTo({
              url: '../index/index'
            });
          }, 1500);
        }else{
          if(res.data.error){
            self.setData({err_tips_data: {err_tips_show: true, err_tips_text: res.data.error.message}});
            //3s后隐藏错误处理
            setTimeout(function(){
              self.setData({err_tips_data: {err_tips_show: false, err_tips_text: ''}});
            }, 3000);
          }
        }
      },
      error: function(err){
        console.log(err);
      }
    });
  },
  clearUmt: function(){
    this.setData({umt: ' '});
  },
  changeUmt: function(event){
    this.setData({umt: event.detail.value});
  },
  seePassword: function(event){
    if(this.data.password_input_type == 'password'){
      this.setData({password_input_type: 'text', see_password_class: 'unsee-password-icon'});
    }else{
      this.setData({password_input_type: 'password', see_password_class: 'see-password-icon'});
    }
  }
});