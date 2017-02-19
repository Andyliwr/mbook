//login.js
var Api = require('../../util/api/api.js');
var Util = require('../../util/util.js');

Page({
  data: {
    headerText: '',
    showMonths: [],
    books: [
      {
        bookId: '123123121231231',
        img: '../../image/today/dazhuzai.jpg',
        bookName: '大主宰',
        author: '烟雨江南',
        bookDes: '大千世界,位面交汇,万族林立,群雄荟萃,一位位来自下位面的天之至尊,在这无尽世界,演绎着令人向往的传奇,追求着那主宰之',
        isRead: true,
        isShow: true //判断是不是搜索结果
      },
      {
        bookId: '1231231231',
        img: '../../image/today/chenyuan.jpg',
        bookName: '尘缘',
        author: '烟雨江南',
        bookDes: '那一天，我摇动所有的经桶，不为超度，只为触摸你的指尖；那一年，在山路匍匐，不为觐见',
        isRead: false,
        isShow: true //判断是不是搜索结果
      }
    ],
    isSearching: false,
    searchValue: ''
  },
  onReady: function () {
    var self = this;
    var timeResult = self.allMonths();
    self.setData({ showMonths: timeResult.showMonths, headerText: timeResult.headerText });
  },
  allMonths: function () {
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
  goToShop: function () {
    wx.navigateTo({
      url: '../shop/shop'
    });
  },
  setIsSearching: function () {
    this.setData({ isSearching: true });
  },
  judgeIsNull: function (event) {
    if (event.detail.value == '') {
      this.setData({ isSearching: false });
    } else {
      this.setData({ isSearching: true });
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
        if(item.bookName.indexOf(searchStr) >=0){
          // item.bookName = self.findAndSigned(searchStr, item.bookName); //小程序暂时不支持动态修改dom, 我也没想到好的解决方案
          //设置这本小说在搜索之后会显示
          item.isShow = true;
          isNeedtoChage = false;
        }
        //查询小说作者名称
        if(item.author.indexOf(searchStr) >=0){ 
          // item.author = self.findAndSigned(searchStr, item.author);
          item.isShow = true;
          isNeedtoChage = false;
        }
        //查询小说描述
        if(item.bookDes.indexOf(searchStr) >=0){
          // item.bookDes = self.findAndSigned(searchStr, item.bookDes);
          item.isShow = true;
          isNeedtoChage = false;
        }
        if(isNeedtoChage){
          item.isShow = false;
        }
      });
      
      self.setData({books: allBooks});
    } else {
      console.log('查询数据为空，不做任何操作');
    }

  },
  findAndSigned: function (searchString, readyToBeSearch) {
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
  clearSearchContent: function(){
    //将不显示的书籍设置显示
    var allBooks = this.data.books;
    allBooks.forEach(function(item){
      item.isShow = true;
    });
    this.setData({searchValue: '', books: allBooks});
  }
});