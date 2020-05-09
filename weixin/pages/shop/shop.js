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
    searchValue: '',
    searchData: []
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
      wx.request({
        url: Api.searchBook(searchStr),
        header: { 'content-type': 'application/json' },
        success: function (res) {
        console.log('Debug: res', res);
          const data = res.data.data;
          //隐藏加载信息  
          setTimeout(function () {
            wx.hideToast();
          }, 300);
          if (data.list) {
            self.setData({ searchData: data.list });
          } else {
            wx.showToast({ title: '搜索书籍失败' + data.msg ? '，' + data.msg : '', icon: 'none' });
          }
        },
        error: function (err) {
          setTimeout(function () {
            wx.hideToast();
            wx.showToast({ title: '搜索书籍失败~', icon: 'none' });
          }, 500);
        }
      });
    } else {
      self.setData({ isSearching: false });
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
          console.log(res)
          wx.request({
            url: Api.initDataBase(),
            method: 'GET',
            success(res) {
              console.log(res)
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
