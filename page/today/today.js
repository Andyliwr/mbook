//today.js
var Api = require('../../util/api/api.js');
var util = require('../../util/util.js');

Page({
    data: {
        currentEmailPageid: 0,
        totalEmailsNum: 4,
        emails: [
            {
                index: 0,
                bgImgUrl: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
                digest: {
                    author_img: 'http://qiniu.andylistudio.com/myapp/personal.png',
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
                index: 1,
                bgImgUrl: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
                digest: {
                    author_img: 'http://qiniu.andylistudio.com/myapp/personal.png',
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
                index: 2,
                bgImgUrl: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
                digest: {
                    author_img: 'http://qiniu.andylistudio.com/myapp/personal.png',
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
                index: 3,
                bgImgUrl: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
                digest: {
                    author_img: 'http://qiniu.andylistudio.com/myapp/personal.png',
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
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        currentEmail: 0
    },
    onLoad: function () {
        var self = this;
        //得到邮件的数据
        self.getEmailsByPageid(self.data.currentEmailPageid);
    },
    getEmailsByPageid: function(pageid){
        wx.request({
            url: Api.getEmailsByPageid(pageid),
            method: 'GET',
            success: function (res) {
                self.setData({totalEmailsNum: res.totalNum, emails: res.data});
                //将邮件数据存入缓存
                wx.setStorageSync(emails, res.data);
            },
            fail: function () {
                // 尝试读取缓存中的值
                try {this.setData({emails: wx.getStorageSync('emails')});} catch (err) { console.log(err) }
            }
        });
    },
    changeEmail: function (event) {
        var self = this;
        var currentIndex = event.detail.current;
        self.setData({ currentEmail: currentIndex });
        if(currentIndex <= 0){
            //提示用户当前为第一封邮件
            self.setData({err_tips_data: {err_tips_show: true, err_tips_text: '当前为第一封邮件'}});
            setTimeout(function(){
                self.setData({err_tips_data: {err_tips_show: false, err_tips_text: ''}});
            }, 3000);
        }else if(currentIndex >= (self.data.totalEmailsNum-1)){
            //提示用户当前为最后一封
            self.setData({err_tips_data: {err_tips_show: true, err_tips_text: '当前为最后一封邮件'}});
            setTimeout(function(){
                self.setData({err_tips_data: {err_tips_show: false, err_tips_text: ''}});
            }, 3000);
        }
        //当加载到第五篇，就为下面的数据做准备
        if(currentIndex%5 != 4){
            self.setData({currentEmailPageid: ++self.data.currentEmailPageid});
            self.getEmailsByPageid(self.data.currentEmailPageid);
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
    }
})