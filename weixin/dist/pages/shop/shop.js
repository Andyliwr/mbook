/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(97);


/***/ },

/***/ 97:
/***/ function(module, exports) {

	'use strict';

	// page/shop/shop.js
	Page({
	  data: {
	    topic: [{
	      headImg: '../../image/shop/recommend01.jpg',
	      id: '01'
	    }, {
	      headImg: '../../image/shop/recommend02.jpg',
	      id: '02'
	    }, {
	      headImg: '../../image/shop/recommend02.jpg',
	      id: '03'
	    }],
	    recommend: [{
	      bookId: '01',
	      headImg: 'http://static.zongheng.com/upload/cover/10/1e/101ecef1545403f69722d665c41c7122.jpeg',
	      name: '超品站兵',
	      author: '梁不凡'
	    }, {
	      bookId: '02',
	      headImg: 'http://static.zongheng.com/upload/cover/2016/12/1482972103534.jpg',
	      name: '医品宗师 ',
	      author: '缘分0'
	    }, {
	      bookId: '03',
	      headImg: 'http://static.zongheng.com/upload/cover/2015/12/1449926451589.jpg',
	      name: '原血神座 ',
	      author: '步行天下'
	    }, {
	      bookId: '04',
	      headImg: 'http://static.zongheng.com/upload/cover/2016/12/1482972103534.jpg',
	      name: '诸天谣 ',
	      author: '龙七二十一'
	    }, {
	      bookId: '05',
	      headImg: 'http://static.zongheng.com/upload/cover/2015/06/1434416579785.jpg',
	      name: '最强狂兵 ',
	      author: '烈焰滔滔'
	    }, {
	      bookId: '06',
	      headImg: 'http://static.zongheng.com/upload/cover/2016/07/1467708575259.jpg',
	      name: '轮回剑主 ',
	      author: '风起夏天'
	    }],
	    new: [{
	      bookId: '01',
	      headImg: 'http://static.zongheng.com/upload/cover/10/1e/101ecef1545403f69722d665c41c7122.jpeg',
	      name: '超品站兵',
	      author: '梁不凡'
	    }, {
	      bookId: '02',
	      headImg: 'http://static.zongheng.com/upload/cover/2016/12/1482972103534.jpg',
	      name: '医品宗师 ',
	      author: '缘分0'
	    }, {
	      bookId: '03',
	      headImg: 'http://static.zongheng.com/upload/cover/2015/12/1449926451589.jpg',
	      name: '原血神座 ',
	      author: '步行天下'
	    }, {
	      bookId: '04',
	      headImg: 'http://static.zongheng.com/upload/cover/2016/12/1482972103534.jpg',
	      name: '诸天谣 ',
	      author: '龙七二十一'
	    }, {
	      bookId: '05',
	      headImg: 'http://static.zongheng.com/upload/cover/2015/06/1434416579785.jpg',
	      name: '最强狂兵 ',
	      author: '烈焰滔滔'
	    }, {
	      bookId: '06',
	      headImg: 'http://static.zongheng.com/upload/cover/2016/07/1467708575259.jpg',
	      name: '轮回剑主 ',
	      author: '风起夏天'
	    }],
	    isSearching: false,
	    searchValue: ''
	  },
	  onLoad: function onLoad(options) {
	    // 页面初始化 options为页面跳转所带来的参数
	  },
	  onReady: function onReady() {
	    // 页面渲染完成
	  },
	  finishedInput: function finishedInput(event) {
	    var self = this;
	    var searchStr = event.detail.value;
	    if (searchStr) {} else {
	      self.setData({ isSearching: false });
	      console.log('查询数据为空，不做任何操作');
	    }
	  },
	  judgeIsNull: function judgeIsNull(event) {
	    if (event.detail.value == '') {
	      this.setData({ isSearching: false });
	    } else {
	      this.setData({ isSearching: true });
	    }
	  },
	  setIsSearching: function setIsSearching() {
	    this.setData({ isSearching: true });
	  },
	  clearSearchContent: function clearSearchContent() {
	    this.setData({ searchValue: '' });
	  },
	  // 跳转到详情页
	  goRecommendDetai: function goRecommendDetai(event) {},
	  gotoRank: function gotoRank(event) {
	    var rankType = event.target.dataset.ranktype;
	    wx.navigateTo({
	      url: '../rank/rank?rankType=' + rankType
	    });
	  }
	});

/***/ }

/******/ });