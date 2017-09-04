// page/shop/shop.js
var Api = require('../../utils/api/api');
var Util = require('../../utils/util');

Page({
  data: {
    topic: [
      {
        headImg: 'https://olpkwt43d.qnssl.com/myapp/shop/recommend01.jpg',
        id: '01',
      },
      {
        headImg: 'https://olpkwt43d.qnssl.com/myapp/shop/recommend02.jpg',
        id: '02',
      },
      {
        headImg: 'https://olpkwt43d.qnssl.com/myapp/shop/recommend02.jpg',
        id: '03',
      }
    ],
    recommend: [
      {
        bookId: '590efa449003c56177e63646',
        headImg: 'http://static.zongheng.com/upload/cover/10/1e/101ecef1545403f69722d665c41c7122.jpeg',
        name: '超品站兵',
        author: '梁不凡'
      },
      {
        bookId: '590efaeb9003c56177e63647',
        headImg: 'http://static.zongheng.com/upload/cover/2016/12/1482972103534.jpg',
        name: '医品宗师 ',
        author: '缘分0'
      },
      {
        bookId: '03',
        headImg: 'http://static.zongheng.com/upload/cover/2015/12/1449926451589.jpg',
        name: '原血神座 ',
        author: '步行天下'
      },
      {
        bookId: '04',
        headImg: 'http://static.zongheng.com/upload/cover/2016/12/1482972103534.jpg',
        name: '诸天谣 ',
        author: '龙七二十一'
      },
      {
        bookId: '05',
        headImg: 'http://static.zongheng.com/upload/cover/2015/06/1434416579785.jpg',
        name: '最强狂兵 ',
        author: '烈焰滔滔'
      },
      {
        bookId: '06',
        headImg: 'http://static.zongheng.com/upload/cover/2016/07/1467708575259.jpg',
        name: '轮回剑主 ',
        author: '风起夏天'
      }
    ],
    new: [
      {
        bookId: '01',
        headImg: 'http://static.zongheng.com/upload/cover/10/1e/101ecef1545403f69722d665c41c7122.jpeg',
        name: '超品站兵',
        author: '梁不凡'
      },
      {
        bookId: '02',
        headImg: 'http://static.zongheng.com/upload/cover/2016/12/1482972103534.jpg',
        name: '医品宗师 ',
        author: '缘分0'
      },
      {
        bookId: '03',
        headImg: 'http://static.zongheng.com/upload/cover/2015/12/1449926451589.jpg',
        name: '原血神座 ',
        author: '步行天下'
      },
      {
        bookId: '04',
        headImg: 'http://static.zongheng.com/upload/cover/2016/12/1482972103534.jpg',
        name: '诸天谣 ',
        author: '龙七二十一'
      },
      {
        bookId: '05',
        headImg: 'http://static.zongheng.com/upload/cover/2015/06/1434416579785.jpg',
        name: '最强狂兵 ',
        author: '烈焰滔滔'
      },
      {
        bookId: '06',
        headImg: 'http://static.zongheng.com/upload/cover/2016/07/1467708575259.jpg',
        name: '轮回剑主 ',
        author: '风起夏天'
      }
    ],
    isSearching: false,
    searchValue: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 0
    });
    setTimeout(function(item){
      wx.hideToast();
    }, 2000);
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
  goRecommendDetai: function (event) {

  },
  gotoBookDetail: function(event){
    var bookid = event.currentTarget.dataset.bookid;
    // 判断当前书籍在不在我的书单中
    wx.navigateTo({
      url: '../book_detail/book_detail?bookid=' + bookid
    });
  },
  gotoRank: function(event){
    var rankType = event.target.dataset.ranktype;
    wx.navigateTo({
      url: '../rank/rank?rankType='+rankType
    });
  }
})