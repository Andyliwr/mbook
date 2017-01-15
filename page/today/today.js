//today.js
var Api = require('../../util/api/api.js');
var util = require('../../util/util.js');

Page({
    data: {
         digest_data: {
                    author_img: 'http://qiniu.andylistudio.com/myapp/personal.png',
                    author_name: '熊猫老师',
                    author_des: '宣传部',
                    title: "“阅读推行赠书计划”已经开始",
                    content: '<button class="email-digest-btn">加入计划</button><text>或者到【我的--邀请好友加入】查看</text>'
                },
        emails: [
            {
                index: 0,
                bgImgUrl: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
                digest: {
                    author_img: 'http://qiniu.andylistudio.com/myapp/personal.png',
                    author_name: '熊猫老师',
                    author_des: '宣传部',
                    title: "“阅读推行赠书计划”已经开始",
                    content: '<button class="email-digest-btn">加入计划</button><text>或者到【我的--邀请好友加入】查看</text>'
                }
            },
            {
                index: 1,
                bgImgUrl: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
                digest: {
                    author_img: 'http://qiniu.andylistudio.com/myapp/personal.png',
                    author_name: '熊猫老师',
                    author_des: '宣传部',
                    title: "“阅读推行赠书计划”已经开始",
                    content: '<button class="email-digest-btn">加入计划</button><text>或者到【我的--邀请好友加入】查看</text>'
                }
            },
            {
                index: 2,
                bgImgUrl: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
                digest: {
                    author_img: 'http://qiniu.andylistudio.com/myapp/personal.png',
                    author_name: '熊猫老师',
                    author_des: '宣传部',
                    title: "“阅读推行赠书计划”已经开始",
                    content: '<button class="email-digest-btn">加入计划</button><text>或者到【我的--邀请好友加入】查看</text>'
                }
            }
        ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    currentEmail: 0
  },
  changeEmail: function(event){
      console.log(event.detail.current);
      this.setData({currentEmail: event.detail.current});
  }
})