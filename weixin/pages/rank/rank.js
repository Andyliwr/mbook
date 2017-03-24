//login.js
var Api = require('../../utils/api/api');
var Util = require('../../utils/util');

Page({
    data: {
    	rankData: [],
        currentIndex: 0,
        scrollTop: {scrollTop_value: 0, backTop_show: false}
    },
    onLoad: function(options) {
        var self = this;
        //show loading
        wx.showToast({
          title: '加载中',
          icon: 'loading',
          duration: 10000
        });
        //options rankType
        wx.request({
		  url: Api.getRank(options.rankType),
		  header: {'content-type': 'application/json'},
		  success: function(res) {
            //hide loading
            setTimeout(function(){
                wx.hideToast();
            },500);
            if(res.data.data){
                self.setData({rankData: res.data.data.ranks});
            }else{
                console.log('请求排行榜数据失败....')
            }
		  },
          error: function(err){
            console.log('请求排行榜数据失败....'+err);
          }
        });
    },
    showRank: function(event){
        this.setData({currentIndex: event.currentTarget.dataset.index});
    },
    scrollFun: function(event){
        if(event.detail.scrollTop > 300){//触发backtop的显示条件  
          this.setData({  
            'scrollTop.backTop_show': true  
          });  
        }else{  
          this.setData({  
            'scrollTop.backTop_show': false  
          });  
        }  
    },
    backToTop: function(){
        var topValue = this.data.scrollTop.scrollTop_value;//发现设置scroll-top值不能和上一次的值一样，否则无效，所以这里加了个判断  
        if(topValue == 1){  
          topValue = 0;  
        }else{  
          topValue = 1;  
        }  
        this.setData({  
          'scrollTop.scrollTop_value': topValue  
        });  
    },
    gotoBookDetail: function(event){
        var bookId = event.currentTarget.dataset.bookid;
        wx.navigateTo({
          url: '../book_detail/book_detail?bookId='+bookId
        });
    }
});