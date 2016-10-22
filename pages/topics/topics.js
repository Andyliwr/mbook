var Api = require('../../utils/api/api.js');
Page({
  data: {
    title: '首页列表',
    hidden: true
  },
  loadingChange: function () {
    this.setData({
      hidden: true
    })
  },
  loadingTap: function () {
    this.setData({
      hidden: false
    })

    var that = this
    setTimeout(function () {
      that.setData({
        hidden: true
      })
    }, 1500)
  },
  onLoad: function () {
    console.log('onLoad by topics');
    //获取数据
    this.fetchData();
  },
  fetchData: function(data){
  	//处理参数
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
  		}
  	})
  }
});
