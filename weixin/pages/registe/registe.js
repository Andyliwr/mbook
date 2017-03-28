//login.js
var Api = require('../../utils/api/api');
var Util = require('../../utils/util');

Page({
    data: {
    	rankData: [],
        currentIndex: 0
    },
    onLoad: function(options) {
        var self = this;
        //options rankType
        console.log(options.bookId);
  //       wx.request({
		//   url: Api.getRank(options.rankType),
		//   header: {'content-type': 'application/json'},
		//   success: function(res) {
  //           if(res.data.data){
  //               self.setData({rankData: res.data.data.ranks});
  //           }else{
  //               console.log('请求排行榜数据失败....')
  //           }
		//   },
  //         error(function() {
  //             /* Act on the event */
  //         });
		// });
    },
    showRank: function(event){
        this.setData({currentIndex: event.currentTarget.dataset.index});
    }
});