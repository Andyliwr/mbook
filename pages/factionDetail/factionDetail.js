var Api = require('../../utils/api/api.js');
Page({
  data: {
    title: '首页列表',
    hidden: true,
    factionDetailInfo: []
  },
  onLoad: function (options) {
    //获取数据
    this.getFactionDetailById(options.id);
  },
  getFactionDetailById: function(id){
  	//处理参数
    var that = this;
  	if(id){
      //发送请求
      wx.request({
        url: Api.getFactionDetailById(id),
        success: function(res){
          //test
          console.log("根据传过来的id获取到的小说详情");
          console.log(res);
          //获取到小说的list信息之后
          that.setData({
            factionDetailInfo: res.data
          });
        },
        error: function(err){
          console.log("获取小说列表失败！！"+err);
        }
      })
    }else{
      console.log("传入参数为空！");
      return;
    }
  }
});
