//wxlogin.js
//获取应用实例
var app = getApp();
Page({
    data: {
    	rankData: [],
        currentIndex: 0,
        isShowLoading: true
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
    confirmLogin: function(event){
        var self = this;
        //设置button的loading显示
        self.setData({isShowLoading: true});
        app.getwxUserInfo(function(userinfo){

        });
    }
});