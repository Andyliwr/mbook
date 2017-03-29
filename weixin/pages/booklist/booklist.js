//booklist.js
var Api = require('../../utils/api/api');
var Util = require('../../utils/util');
//获取应用实例
var app = getApp();
Page({
  data: {
    headerText: '',
    showMonths: [],
    books: [{
      factionName: '大主宰',
      author: '天蚕土豆',
      shortDes: '神秘古怪的嬉命小丑百城联邦，三大帝国，异族横行，魂兽霸幽这是一....""双月当空，无限可能的英魂世界孤神秘古怪的嬉命小丑百城联邦，三大帝国，异异...',
      des: '神秘古怪的嬉命小丑百城联邦，三大帝国，异族横行，魂兽霸幽这是一....""双月当空，无限可能的英魂世界孤神秘古怪的嬉命小丑百城联邦，三大帝国，异族横行，魂兽霸幽这是一....""双月当空，无限可能的英魂世界孤神秘古怪的嬉命小丑百城联邦，三大帝国，异族横行，魂兽霸幽这是一....""双月当空，无限可能的英魂世界孤22',
      headerImage: 'https://olpkwt43d.qnssl.com/myapp/dazhuzai.jpg'
    }],
    isSearching: false,
    searchValue: '',
    userInfo: {}
  },
  onReady: function() {
    var self = this;
    var timeResult = self.allMonths();
    self.setData({
      showMonths: timeResult.showMonths,
      headerText: timeResult.headerText
    });
  },
  onLoad: function(e) {
    var self = this;
    var books = e.books
    wx.request({
      url: Api.getFactionList(),
      success: function(res) {
        var books = res.data.slice(0,3);
        self.setData({
          books: books
        })
      },
      fail: function() {
        console.log("请求书籍列表失败")
      }
    });
    wx.setStorage({
     key:'booklist',
     data:books,
     success:function(res){
       console.log('成功保存书籍列表到本地缓存');
     }
   });
    wx.getStorage({
      key: 'booklist',
      success: function(res) {
      console.log(res.data)
      }
    })
      // console.log('onLoad')
      // var that = this
      // //调用应用实例的方法获取全局数据
      // app.getUserInfo(function(userInfo){
      //   //更新数据
      //   that.setData({
      //     userInfo:userInfo
      //   })
      // })
    },
    allMonths: function() {
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
        hasRecord: true
      });
    }
    return {
      headerText: today.getFullYear() + '年' + resultArray[0].monthCname,
      showMonths: resultArray.reverse()
    }
  },
  goToShop: function() {
    wx.navigateTo({
      url: '../shop/shop'
    });
  },
  goToBookDetail: function(e) {
    var currentBookId = e.currentTarget.id
    console.log(currentBookId)
    wx.navigateTo({
      url: '../book_detail/book_detail?bookId=' + currentBookId
    })
  },
  setIsSearching: function() {
    this.setData({
      isSearching: true
    });
  },
  judgeIsNull: function(event) {
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
  finishedInput: function(event) {
    var self = this;
    var searchStr = event.detail.value;
    if (searchStr) {
      var allBooks = self.data.books;

      allBooks.forEach(function(item, index, array) {
        //标志位，用来标志是不是需要设置item.isShow = false，如果经历foreach循环没有被设置为false，就认为这不小说不是搜索的结果
        var isNeedtoChage = true;
        //查询小说名字
        if (item.bookName.indexOf(searchStr) >= 0) {
          // item.bookName = self.findAndSigned(searchStr, item.bookName); //小程序暂时不支持动态修改dom, 我也没想到好的解决方案
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
        if (item.bookDes.indexOf(searchStr) >= 0) {
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
  findAndSigned: function(searchString, readyToBeSearch) {
    if (typeof searchString == 'string') {
      var regExp = new RegExp(searchString, 'igm');
      var leftStr = ''; //记录关键词左边的字符串
      var rightStr = ''; //记录关键词右边的字符串
      var count = 0; //计数器
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
  clearSearchContent: function() {
    //将不显示的书籍设置显示
    var allBooks = this.data.books;
    allBooks.forEach(function(item) {
      item.isShow = true;
    });
    this.setData({
      searchValue: '',
      books: allBooks
    });
  }
});