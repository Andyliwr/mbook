//login.js
var Api = require('../../util/api/api.js');
var Util = require('../../util/util.js');

Page({
    data: {
    	rankData: [],
        currentIndex: 0
    },
    onLoad: function(options) {
        var self = this;
        //options rankType
        wx.request({
		  url: Api.getRank(options.rankType),
		  header: {'content-type': 'application/json'},
		  success: function(res) {
            if(res.data.data){
                self.setData({rankData: res.data.data.ranks});
            }else{
                console.log('请求排行榜数据失败....')
            }
		  }
		});
    },
    showRank: function(event){
        this.setData({currentIndex: event.currentTarget.dataset.index});
    }
});