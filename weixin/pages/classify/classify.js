// page/classify/classify.js
import { getClassify } from '../../utils/api/api'

Page({
  data: {
    classifyTypes: ['全部书籍', '玄幻·奇幻', '修真·仙侠', '都市·青春', '历史·军事', '网游·竞技', '科幻·灵异', '言情·穿越', '耽美·同人', '侦探·推理'],
    page: 1,
    total: 0,
    classifyData: [],
    currentIndex: 0,
    scrollTop: { scrollTop_value: 0, backTop_show: false },
    hasSrollBottom: false
  },
  onLoad: function (options) {
    var self = this;
    //根据url中传过来的分类index，加载指定的分类数据，index默认值1
    if (options.index) {
      self.setData({ currentIndex: options.index });
      self.getClassifyData(options.index, self.data.page);
    } else {
      self.getClassifyData(self.data.currentIndex, self.data.page);
    }
    // 当前页面不予许分享
    wx.hideShareMenu();
  },
  getClassifyData: function (index, page, isLoadMore) {
    //显示加载中
    wx.showToast({ title: '加载中', icon: 'loading' });
    let self = this;
    if (!isLoadMore) {
      page = 1;
      self.setData({ page: 1 });
    }
    wx.request({
      url: getClassify(index, page),
      header: { 'content-type': 'application/json' },
      success: function (res) {
      console.log('Debug: res', res);
        const data = res.data.data;
        //隐藏加载信息  
        setTimeout(function () {
          wx.hideToast();
        }, 300);
        if (data.list) {
          if (isLoadMore) {
            self.setData({ classifyData: self.data.classifyData.concat(data.list), total: data.total });
          } else {
            self.setData({ classifyData: data.list, total: data.total });
          }
        } else {
          wx.showToast({ title: '获取书籍分类失败' + data.msg ? '，' + data.msg : '', icon: 'none' });
        }
      },
      error: function (err) {
        setTimeout(function () {
          wx.hideToast();
          wx.showToast({ title: '获取分类数据失败~', icon: 'none' });
        }, 500);
      }
    });
  },
  showClassify: function (event) {
    this.setData({ currentIndex: event.currentTarget.dataset.index });
    this.getClassifyData(this.data.currentIndex, this.data.page);
  },
  loadMoreData: function (event) {
    let page = this.data.page + 1;
    if (page >= Math.ceil(this.data.total / 8) + 1) {
      if (!this.data.hasScrollBottom) {
        wx.showToast({ title: '暂无更多数据~' });
        this.setData({ hasScrollBottom: true });
      }
    } else {
      this.setData({ page: page });
      this.getClassifyData(this.data.currentIndex, this.data.page, true);
    }
  },
  backToTop: function () {
    var topValue = this.data.scrollTop.scrollTop_value; //发现设置scroll-top值不能和上一次的值一样，否则无效，所以这里加了个判断
    if (topValue == 1) {
      topValue = 0;
    } else {
      topValue = 1;
    }
    this.setData({
      'scrollTop.scrollTop_value': topValue
    });
  },
  reloadData: function () {
    this.getClassifyData(this.data.currentIndex, this.data.page);
  }
});
