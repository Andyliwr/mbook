//booklist.js
var Api = require('../../utils/api/api');
var Util = require('../../utils/util');
//获取应用实例
var app = getApp();
Page({
  data: {
    headerText: '',
    showMonths: [],
    books: [],
    isSearching: false,
    searchValue: '',
    userInfo: {},
    err_page_data: null, //app状态页
    monthIndex: 6
  },
  onReady: function () {
    var self = this;
    var timeResult = self.allMonths();
    self.setData({
      showMonths: timeResult.showMonths,
      headerText: timeResult.headerText
    });
    //先获取本地缓存中的书单数据，等接口返回之后再更新
    // wx.getStorage({
    //   key: 'booklist',
    //   success: function (res) {
    //     console.log('使用本地缓存的书单数据');
    //     self.setData({books: res.data});
    //   }
    // });
  },
  onLoad: function (e) {
    var self = this;
    //显示加载中
    wx.showToast({
      title: '正在获取书单...',
      icon: 'loading',
      duration: 0
    });
  },
  onShow: function () {
    var self = this;
    //获取我的书单
    //读取缓存中的userid
    wx.getStorage({
      key: 'id',
      success: function (res) {
        var id = res.data;
        if (id && id.userid) {
          self.getMyBooks(id.userid);
          self.getUserinfo(id.userid);
        } else {
          wx.hideToast();
          //显示还未登录提示页面
          self.setData({
            err_page_data: {
              show: true,
              image_url: 'https://olpkwt43d.qnssl.com/myapp/err_tips/nologin_err.png',
              text: '你还未登录呢，还能不能愉快的交朋友！',
              buttonText: '登录',
              click: 'doLogin'
            }
          });
        }
      }
    });
  },
  //获取我的书单
  getMyBooks: function (userid) {
    var self = this;
    wx.request({
      url: Api.getMyBooks(userid),
      success: function (res) {
        var books = res.data.data.books;
        console.log('书籍信息');
        console.log(books);
        books.forEach(function (item) {
          item.isShow = true;
        });
        //更新视图books
        self.setData({ books: books });
        //将书单数据缓存到本地
        wx.setStorage({
          key: 'booklist',
          data: books,
          success: function (res) {
            console.log('成功保存书籍列表到本地缓存');
          }
        });
      },
      fail: function () {
        //显示网络错误提示页面
        //先获取本地缓存中的书单数据，并提示网络错误，若本地没有缓存数据，显示app状态页
        wx.getStorage({
          key: 'booklist',
          success: function (res) {
            console.log('使用本地缓存的书单数据');
            if (res.data && res.data[0].factionName) {
              self.setData({ books: res.data });
            } else {
              self.setData({
                err_page_data: {
                  show: true,
                  image_url: 'https://olpkwt43d.qnssl.com/myapp/err_tips/network_err.png',
                  text: '努力找不到网络>_<请检查后重试',
                  buttonText: '重试',
                  click: 'getMyBooks'
                }
              });
            }
          },
          fail: function (err) {
            console.log('获取缓存失败' + err);
            self.setData({
              err_page_data: {
                show: true,
                image_url: 'https://olpkwt43d.qnssl.com/myapp/err_tips/network_err.png',
                text: '努力找不到网络>_<请检查后重试',
                buttonText: '重试',
                click: 'getMyBooks'
              }
            });
          }
        });
        console.log("请求书籍列表失败");
        self.setData({
          err_page_data: {
            show: true,
            image_url: 'https://olpkwt43d.qnssl.com/myapp/err_tips/network_err.png',
            text: '努力找不到网络>_<请检查后重试',
            buttonText: '重试',
            click: 'getMyBooks'
          }
        });
      },
      complete: function () {
        //请求完成结束loading
        wx.hideToast();
      }
    });
  },
  getUserinfo: function (userid) {
    wx.request({
      url: Api.getUserInfo(userid),
      success: function (res) {
        var tmpData = res.data.data;
        console.log('用户信息');
        console.log(tmpData);
        if (tmpData && tmpData.code == 0) {
          //将书单数据缓存到本地
          wx.setStorage({
            key: 'userInfo',
            data: tmpData.info,
            success: function (res) {
              console.log('成功保存用户信息到本地缓存');
            }
          });
        } else {
          console.log('请求用户信息失败....');
          Util.showErrMsg(self, '获取个人信息失败', 1000);
        }
      },
      fail: function (err) {
        console.log(err);
        self.setData({
          err_page_data: {
            show: true,
            image_url: 'https://olpkwt43d.qnssl.com/myapp/err_tips/network_err.png',
            text: '努力找不到网络>_<请检查后重试',
            buttonText: '重试',
            click: 'getUserinfo'
          }
        });
      }
    });
  },
  //执行登录操作
  doLogin: function () {
    var self = this;
    app.doLogin(function () {
      self.setData({ err_page_data: null });
      self.getMyBooks();
    });
  },
  allMonths: function () {
    var self = this;
    var resultArray = [];
    var today = new Date();
    var month = today.getMonth();
    // todo给出是否有记录的判断
    resultArray.push({
      monthCname: Util.eNumToCNum(Math.abs(month)) + '月',
      hasRecord: false
    });
    for (var i = 1; i <= 6; i++) {
      resultArray.push({
        monthCname: Util.eNumToCNum(Math.abs(month - i < 0 ? month + 12 - i : month - i)) + '月',
        hasRecord: ((Math.random() > 0.5) ? true : false),
        monthIndex: i
      });
    }
    return {
      headerText: today.getFullYear() + '年' + resultArray[0].monthCname,
      showMonths: resultArray.reverse()
    }
  },
  goToShop: function () {
    wx.switchTab({
      url: '../shop/shop'
    });
  },
  goToBookDetail: function (e) {
    var currentBookId = e.currentTarget.dataset.bookid;
    wx.navigateTo({
      url: '../book_detail/book_detail?bookid=' + currentBookId
    });
  },
  setIsSearching: function () {
    this.setData({
      isSearching: true
    });
  },
  judgeIsNull: function (event) {
    if (event.detail.value == '') {
      this.setData({
        isSearching: false
      });
    } else {
      this.setData({
        isSearching: true
      });
    }
  },
  finishedInput: function (event) {
    var self = this;
    var searchStr = event.detail.value;
    if (searchStr) {
      var allBooks = self.data.books;

      allBooks.forEach(function (item, index, array) {
        //标志位，用来标志是不是需要设置item.isShow = false，如果经历foreach循环没有被设置为false，就认为这不小说不是搜索的结果
        var isNeedtoChage = true;
        //查询小说名字
        if (item.name.indexOf(searchStr) >= 0) {
          // item.name = self.findAndSigned(searchStr, item.name); //小程序暂时不支持动态修改dom, 我也没想到好的解决方案
          //设置这本小说在搜索之后会显示
          item.isShow = true;
          isNeedtoChage = false;
        }
        //查询小说作者名称
        if (item.author.indexOf(searchStr) >= 0) {
          // item.author = self.findAndSigned(searchStr, item.author);
          item.isShow = true;
          isNeedtoChage = false;
        }
        //查询小说描述
        if (item.des.indexOf(searchStr) >= 0) {
          // item.bookDes = self.findAndSigned(searchStr, item.bookDes);
          item.isShow = true;
          isNeedtoChage = false;
        }
        if (isNeedtoChage) {
          item.isShow = false;
        }
      });

      self.setData({
        books: allBooks
      });
    } else {
      console.log('查询数据为空，不做任何操作');
    }

  },
  findAndSigned: function (searchString, readyToBeSearch) {
    if (typeof searchString == 'string') {
      var regExp = new RegExp(searchString, 'igm');
      var leftStr = ''; //记录关键词左边的字符串
      var rightStr = ''; //记录关键词右边的字符串
      var count = 1; //计数器
      var tempStr = readyToBeSearch; //用于正则匹配的字符串
      var notChageStr = readyToBeSearch; //用于截取字符串，和上面一样的值是因为不能把一个值既用于正则运算又用于记录加入<code></code>的新的字符串,这样会使得循环变成无限循环
      var lastIndex = 0; //记录关键词的位置
      while (regExp.exec(tempStr) != null) {
        console.log(++count);
        lastIndex = regExp.lastIndex + 13 * (count - 1); //每次循环notChageStr并非不变，而是多了<code></code>共计13个字符，所以为了保证后续循环中lastindex的正确性应该将lastindex自增13
        leftStr = notChageStr.substring(0, lastIndex - searchString.length);
        rightStr = notChageStr.substring(lastIndex);
        notChageStr = leftStr + '<code>' + searchString + '</code>' + rightStr;
      }
      return notChageStr;
    } else {
      console.log('The param of findAndSigned is error!....')
      return '';
    }
  },
  clearSearchContent: function () {
    //将不显示的书籍设置显示
    var allBooks = this.data.books;
    allBooks.forEach(function (item) {
      item.isShow = true;
    });
    this.setData({
      searchValue: '',
      books: allBooks
    });
  },
  //选择月份
  chooseMonth: function (event) {
    var self = this;
    var month = event.currentTarget.dataset.month;
    self.setData({ monthIndex: month });
  }
});
