var Api = require('../../utils/api/api.js');
Page({
  data: {
    title: '首页列表',
    hidden: true,
    factionListData: []
  },
  // loadingChange: function () {
  //   this.setData({
  //     hidden: true
  //   })
  // },
  // loadingTap: function () {
  //   this.setData({
  //     hidden: false
  //   })

  //   var that = this
  //   setTimeout(function () {
  //     that.setData({
  //       hidden: true
  //     })
  //   }, 1500)
  // },
  onLoad: function () {
    console.log('onLoad by topics');
    //获取数据
    this.fetchData();
  },
  fetchData: function(data){
  	//处理参数
    var that = this;
  	if(!data){
  		data = {};
  	}
  	if(!data.page){
  		data.page = 1;
  	}
  	//发送请求
  	wx.request({
  		url: Api.getFactionList(),
  		success: function(res){
  			console.log(res);
  			//获取到小说的list信息之后
  			that.setData({
  				factionListData: res.data
  			});
  		},
  		error: function(err){
  			console.log("获取小说列表失败！！"+err);
  		}
  	})
  },
  redictDetail: function(e){
    var id = e.currentTarget.id;
    var url = '../factionDetail/factionDetail?id=' + id;
    // 这里的detail是需要创建对应的文件，以及页面注册的
    wx.navigateTo({
      url: url,
      success: function(res){
        console.log("基于当前页面导航成功，"+res);
      },
      fail: function(err){
        console.log("基于当前页面导航失败，"+err);
      }
    })
  }
});
