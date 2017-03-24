//wxlogin.js
import { getUploadToken } from '../../utils/api/api';
import { qiniuUploader } from '../../utils/qiniuUploader';
import { showErrMsg } from '../../utils/util';

// 初始化七牛相关参数
function initQiniu() {
  var options = {
    region: 'SCN', // 华东区，生产环境应换成自己七牛帐户bucket的区域
    uptokenURL: getUploadToken(), // 生产环境该地址应换成自己七牛帐户的token地址，具体配置请见server端
    domain: 'https://olpkwt43d.qnssl.com/' // 生产环境该地址应换成自己七牛帐户对象存储的域名
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
      wx.chooseImage({
        sourceType: ['camera', 'album'],
        sizeType: ['compressed'], //压缩图片
        count: 1, //最多一张
        success: function (res) {
          console.log('拍照之后：');
          console.log(res);
          that.setData({
            src: res.tempFilePath
          });
          //七牛上传文件
          var vedioObject = res;
          var filePath = res.tempFilePath;
          qiniuUploader.upload(filePath, (res) => {
            console.log('此时的videoObject：'+JSON.stringify(vedioObject));
            var allPicture = [];
            for(var i=0; i<vedioObject.duration; i++){
              allPicture.push(res.imageURL+'?vframe/jpg/offset/'+i+'/w/'+vedioObject.width+'/h/'+vedioObject.height+'/rotate/0');
            }
            that.setData({
              'afterUploadVedio': res,
              'allPicture': allPicture
            });
            wx.showToast({
              title: '请稍候...',
              icon: 'loading',
              duration: 3000
            });
            //上传成功，开始发送检测图片的请求
            wx.request({
              url: that.data.analysisVideoUrl + '?video_url=' + res.imageURL + '&duration=' + vedioObject.duration + '&width=' + vedioObject.width + '&height=' +vedioObject.height, //仅为示例，并非真实的接口地址
              header: { 'content-type': 'application/json' },
              success: function (res) {
                that.setData({ analysisRes: res.data, isShowRes: true });
                //检测用户是否微笑
                console.log('第一个result是数组吗？'+(res.data.result instanceof Array));
                var isSimle = res.data.result.some(function(item){
                  console.log('第二个result是数组吗？'+(item.result instanceof Array));
                  if(item.result instanceof Array){
                    return item.result.some(function(item2){
                      return item2.expression == '1';
                    })
                  }else{
                    return item.result.expression == '1';
                  }
                });
                console.log('isSimle:  '+isSimle);
                if(isSimle){
                  wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000
                  });
                }else{
                  wx.showModal({
                    title: '提示',
                    content: '你在视频中没有微笑...',
                    success: function(res) {
                      if (res.confirm) {
                        console.log('用户点击确定');
                      }
                    }
                  })
                }
              }
            });
          }, (error) => {
            console.error('error: ' + JSON.stringify(error));
          });
        },
        fail: function(err){

        }
      })
    }
});