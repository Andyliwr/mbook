//wxlogin.js
var Api = require('../../../utils/api/api');
var qiniuUploader = require('../../../utils/qiniuUpload');
var Util = require('../../../utils/util');

// 初始化七牛相关参数
function initQiniu(callback) {
  var options = {
    region: 'SCN', // 华东区，生产环境应换成自己七牛帐户bucket的区域
    uptokenURL: Api.getUploadToken(), // 生产环境该地址应换成自己七牛帐户的token地址，具体配置请见server端
    domain: 'https://olpkwt43d.qnssl.com' // 生产环境该地址应换成自己七牛帐户对象存储的域名
  };
  qiniuUploader.init(options);
}

//获取应用实例
var app = getApp();
Page({
    data: {
    	rankData: [],
        currentIndex: 0,
        isShowLoading: true,
        userInfoFromUrl: null,
        err_tips_data: {err_tips_show: false, err_tips_text: ''}
    },
    onLoad: function(options) {
        var self = this;
        //options rankType
        console.log(options.bookId);
        self.setData({userInfoFromUrl: {avatar: options.avatar, nickName: options.nickName, city: options.city, gender: options.gender}});
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
    },
    uploadAvatar: function(){
      initQiniu();
      var  self = this;
      wx.chooseImage({
        sourceType: ['camera', 'album'],
        sizeType: ['compressed'], //压缩图片
        count: 1, //最多一张
        success: function (res) {
          console.log('拍照之后：');
          console.log(res);
          self.setData({
            userInfoFromUrl: res.tempFilePaths[0]
          });
          //七牛上传文件
          var filePath = res.tempFilePaths[0];
          qiniuUploader.upload(filePath, (res) => {
            console.log(res);
            //更新图片地址
            self.setData({
              userInfoFromUrl: res.tempFilePaths[0]
            });
          }, (error) => {
            console.error('error: ' + JSON.stringify(error));
          });
        },
        fail: function(err){
          console.log("选择图片失败, "+err);
        }
      })
    }
});