//today.js
var Api = require('../../utils/api/api');
var util = require('../../utils/util');

Page({
  data: {
    currentEmailPageid: 1,
    totalEmailsNum: 5,
    emails: [
      {
        id: '12312312311231',
        bgImgUrl: 'https://olpkwt43d.qnssl.com/myapp/email_bg01.jpg',
        digest: {
          author_img: 'https://olpkwt43d.qnssl.com/myapp/user/personal.png',
          author_name: '熊猫老师',
          author_des: '宣传部',
          title: "“阅读推行赠书计划”已经开始",
          content: {
            button: {
              text: '加入计划',
              url: '../index/index',
              eventHandler: 'goToUrl'
            },
            other: '或者到【我的--邀请好友加入】查看'
          }

        }
      },
      {
        id: '1231221331231',
        bgImgUrl: 'https://olpkwt43d.qnssl.com/myapp/email_bg01.jpg',
        digest: {
          author_img: 'https://olpkwt43d.qnssl.com/myapp/user/personal.png',
          author_name: '熊猫老师',
          author_des: '宣传部',
          title: "“阅读推行赠书计划”已经开始",
          content: {
            button: {
              text: '加入计划',
              url: '../index/index',
              eventHandler: 'goToUrl'
            },
            other: '或者到【我的--邀请好友加入】查看'
          }
        }
      },
      {
        id: '12312312123131',
        bgImgUrl: 'https://olpkwt43d.qnssl.com/myapp/email_bg01.jpg',
        digest: {
          author_img: 'https://olpkwt43d.qnssl.com/myapp/user/personal.png',
          author_name: '熊猫老师',
          author_des: '宣传部',
          title: "“阅读推行赠书计划”已经开始",
          content: {
            button: {
              text: '加入计划',
              url: '../index/index',
              eventHandler: 'goToUrl'
            },
            other: '或者到【我的--邀请好友加入】查看'
          }
        }
      },
      {
        id: '12312312123131',
        bgImgUrl: 'https://olpkwt43d.qnssl.com/myapp/email_bg01.jpg',
        digest: {
          author_img: 'https://olpkwt43d.qnssl.com/myapp/user/personal.png',
          author_name: '熊猫老师',
          author_des: '宣传部',
          title: "“阅读推行赠书计划”已经开始",
          content: {
            button: {
              text: '加入计划',
              url: '../index/index',
              eventHandler: 'goToUrl'
            },
            other: '或者到【我的--邀请好友加入】查看'
          }
        }
      },
      {
        id: '12312312123131',
        bgImgUrl: 'https://olpkwt43d.qnssl.com/myapp/email_bg01.jpg',
        digest: {
          author_img: 'https://olpkwt43d.qnssl.com/myapp/user/personal.png',
          author_name: '熊猫老师',
          author_des: '宣传部',
          title: "“阅读推行赠书计划”已经开始",
          content: {
            button: {
              text: '加入计划',
              url: '../index/index',
              eventHandler: 'goToUrl'
            },
            other: '或者到【我的--邀请好友加入】查看'
          }
        }
      }
    ],
    tasks: {
      isSigned: false,
      allTasks: [
        {
          bookId: '123123121231231',
          img: 'https://olpkwt43d.qnssl.com/myapp/dazhuzai.jpg',
          bookName: '大主宰',
          bookDes: '大千世界,位面交汇,万族林立,群雄荟萃,一位位来自下位面的天之至尊,在这无尽世界,演绎着令人向往的传奇,追求着那主宰之',
          bookHot: 4,
          progressRate: 5
        },
        {
          bookId: '1231231231',
          img: 'https://olpkwt43d.qnssl.com/myapp/chenyuan.jpg',
          bookName: '尘缘',
          bookDes: '那一天，我摇动所有的经桶，不为超度，只为触摸你的指尖；那一年，在山路匍匐，不为觐见',
          bookHot: 2,
          progressRate: 2
        }
      ]
    },
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    currentEmail: 1,
    avatar: '',
    hasReadTime: 0,
    continueReadDay: 0,
    hasBookNum: 0
  },
  onLoad: function () {
    var self = this;
    // 得到邮件的数据
    self.getEmailsByPageid(self.data.currentEmailPageid);
    // 从缓存中读取用户信息
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        self.setData({avatar: res.data.avatar, hasReadTime: res.data.hasReadTime, continueReadDay: res.data.continueReadDay, hasBookNum: res.data.books})
        console.log('从缓存中读取个人信息成功');
      }
    });
  },
  getEmailsByPageid: function (pageid) {
    // wx.request({
    //     url: Api.getEmailsByPageid(pageid),
    //     method: 'GET',
    //     success: function (res) {
    //         self.setData({totalEmailsNum: res.totalNum, emails: res.data});
    //         //将邮件数据存入缓存
    //         wx.setStorageSync(emails, res.data);
    //     },
    //     fail: function () {
    //         // 尝试读取缓存中的值
    //         // try {self.setData({emails: wx.getStorageSync('emails')});} catch (err) { console.log(err) }
    //     }
    // });
  },
  changeEmail: function (event) {
    var self = this;
    var currentIndex = event.detail.current;
    self.setData({currentEmail: currentIndex});
    if (currentIndex <= 0) {
      //提示用户当前为第一封邮件
      self.setData({err_tips_data: {err_tips_show: true, err_tips_text: '当前为第一封邮件'}});
      setTimeout(function () {
        self.setData({err_tips_data: {err_tips_show: false, err_tips_text: ''}});
      }, 3000);
    } else if (currentIndex >= (self.data.totalEmailsNum - 1)) {
      //提示用户当前为最后一封
      self.setData({err_tips_data: {err_tips_show: true, err_tips_text: '当前为最后一封邮件'}});
      setTimeout(function () {
        self.setData({err_tips_data: {err_tips_show: false, err_tips_text: ''}});
      }, 3000);
    }
    //当加载到第五篇，就为下面的数据做准备
    if ((currentIndex + 1) % 5 != 0) {
      self.setData({currentEmailPageid: currentIndex});
      // self.getEmailsByPageid(self.data.currentEmailPageid);
    } else {
      //请求后面的邮件数据
    }
  },
  //email中按钮的处理事件
  goToUrl: function (event) {
    //获取位于button上的url参数
    var gotoUrl = event.currentTarget.dataset.gotourl;
    console.log('正在执行邮件按钮的点击事件，传入的参数是: ' + gotoUrl);
    wx.navigateTo({
      url: gotoUrl,
    });
  },
  goToBookList: function () {
    wx.navigateTo({
      url: '../booklist/booklist',
    });
  },
  gotoUserInfo: function () {
    wx.navigateTo({
      url: './userInfo/userInfo',
    });
  },
  headimgError: function () {
    this.setData({avatar: 'https://olpkwt43d.qnssl.com/myApp/unknown_headimg.png?imageView2/1/w/60/h/60/format/jpg/interlace/1/q/75|imageslim'});
  }
})