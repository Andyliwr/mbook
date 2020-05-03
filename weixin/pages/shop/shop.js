// page/shop/shop.js
var Api = require('../../utils/api/api');
var Util = require('../../utils/util');

Page({
  data: {
    topic: [
      {
        headImg: 'https://file.lantingshucheng.com/myapp/shop/recommend01.jpg',
        id: '01'
      },
      {
        headImg: 'https://file.lantingshucheng.com/myapp/shop/recommend02.jpg',
        id: '02'
      },
      {
        headImg: 'https://file.lantingshucheng.com/myapp/shop/recommend02.jpg',
        id: '03'
      }
    ],
    recommend: [],
    new: [],
    isSearching: false,
    searchValue: ''
  },
  onLoad: function (options) {
    this.getData();
  },
  onReady: function () {
    // 页面渲染完成
  },
  finishedInput: function (event) {
    var self = this;
    var searchStr = event.detail.value;
    if (searchStr) {
    } else {
      self.setData({ isSearching: false });
      console.log('查询数据为空，不做任何操作');
    }
  },
  judgeIsNull: function (event) {
    if (event.detail.value == '') {
      this.setData({ isSearching: false });
    } else {
      this.setData({ isSearching: true });
    }
  },
  setIsSearching: function () {
    this.setData({ isSearching: true });
  },
  clearSearchContent: function () {
    this.setData({ searchValue: '' });
  },
  // 跳转到详情页
  goRecommendDetai: function (event) {},
  gotoBookDetail: function (event) {
    var bookid = event.currentTarget.dataset.bookid;
    // 判断当前书籍在不在我的书单中
    wx.navigateTo({
      url: '../book_detail/book_detail?bookid=' + bookid
    });
  },
  gotoRank: function (event) {
    var rankType = event.target.dataset.ranktype;
    wx.navigateTo({
      url: '../rank/rank?rankType=' + rankType
    });
  },

  getData() {
    var self = this;
    wx.request({
      url: Api.getAllBooks(),
      method: 'GET',
      success(res) {
        if (!res.data || res.data.length === 0) {
          wx.request({
            url: Api.initDataBase(),
            method: 'GET',
            success(res) {
              self.getData();
            },
            fail(e) {
              wx.showToast({ title: '获取书籍失败', icon: 'none' });
            }
          });
          return;
        }
        self.setData({
          recommend: res.data,
          new: res.data
        });
      },
      fail(e) {
        wx.showToast({ title: '获取书籍失败', icon: 'none' });
      }
    });
  }
});
