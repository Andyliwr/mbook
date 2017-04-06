//login.js
var Api = require('../../utils/api/api.js');
var Util = require('../../utils/util.js');

Page({
  data: {
    commentInputHide: true,
    showAllDes: false,
    bookDetail: null,
    shortDes: '神秘古怪的嬉命小丑百城联邦，三大帝国，异族横行，魂兽霸幽这是一....""双月当空，无限可能的英魂世界孤神秘古怪的嬉命小丑百城联邦，三大帝国，异异...',
    des: '神秘古怪的嬉命小丑百城联邦，三大帝国，异族横行，魂兽霸幽这是一....""双月当空，无限可能的英魂世界孤神秘古怪的嬉命小丑百城联邦，三大帝国，异族横行，魂兽霸幽这是一....""双月当空，无限可能的英魂世界孤神秘古怪的嬉命小丑百城联邦，三大帝国，异族横行，魂兽霸幽这是一....""双月当空，无限可能的英魂世界孤22',
    img: 'https://olpkwt43d.qnssl.com/myapp/dazhuzai.jpg',
    comments: [
      {
        headImg: '../../image/user.png',
        commentId: 123123,
        readerName: '路人甲',
        comment: '这是一条不走心的评论，这是一条不走心的评论，这是一条不走心的评论，这是一条不走心的评论'
      },
      {
        headImg: '../../image/user.png',
        commentId: 123123,
        readerName: '路人乙',
        comment: '这是一条不走心的评论，这是一条不走心的评论，这是一条不走心的评论，这是一条不走心的评论'
      },
      {
        headImg: '../../image/user.png',
        commentId: 123123,
        readerName: '路人丙',
        comment: '这是一条不走心的评论，这是一条不走心的评论，这是一条不走心的评论，这是一条不走心的评论'
      }
    ],
    err_page_data: null, //app状态页
  },
  onLoad: function (options) {
    var self = this;
    // show loading
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 0
    });
    self.setData({showAllDes: false});
    self.getBookDetail(options.bookid);
  },
  getBookDetail: function (bookid) {
    var self = this;
    wx.request({
      url: Api.getBookDetail(bookid),
      success: function (res) {
        var tmpData = res.data.data;
        if (tmpData && tmpData.code == 0) {
          //格式化日期
          var date = new Date(tmpData.detail.updateTime);
          tmpData.detail.updateTime = Util.formatDate3(date);
          self.setData({bookDetail: tmpData.detail});
          // des

        } else {
          console.log('请求书籍信息失败....');
          self.setData({err_page_data: {show: true, image_url: 'https://olpkwt43d.qnssl.com/myapp/err_tips/network_err.png', text: '努力找不到网络>_<请检查后重试', buttonText: '重试', click: 'getBookDetail'}});
        }
      },
      fail: function (err) {
        console.log('书籍不存在....'+err);
        self.setData({err_page_data: {show: true, image_url: 'https://olpkwt43d.qnssl.com/myapp/err_tips/network_err.png', text: '努力找不到网络>_<请检查后重试', buttonText: '登录', click: 'getBookDetail'}});
      },
      complete: function () {
        //hide loading
        setTimeout(function(){
          wx.hideToast()
        },1000)
      }
    });
  },
  showAllDes: function () {
    if (this.data.showAllDes) {
      this.setData({showAllDes: false})
    } else {
      this.setData({showAllDes: true})
    }
  },
  addToList: function () {

  },
  goToReader: function () {
    wx.navigateTo({
      url: 'reader/reader'
    });
  },
  //评论相关
  toWriteComment: function () {
    this.setData({commentInputHide: false})
  },
  hideCommentBar: function () {
    this.setData({commentInputHide: true})
  },
  stageCommentValue: function (e) {
    this.setData({currentCommentValue: e.detail.value})
  },
  sendComment: function (e) {
    console.log(e.detail.value);
    var comments = this.data.comments
    comments.push({
      headImg: '../../image/user.png',
      commentId: 123123,
      readerName: '我',
      comment: e.detail.value
    })
    console.log(comments);
    this.setData({comments: comments, currentCommentValue: ''});
  }
});