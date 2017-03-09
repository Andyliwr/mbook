//login.js
var Api = require('../../utils/api/api.js');
var Util = require('../../utils/util.js');

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
            isRead: true
        },
        {
            bookId: '1231231231',
            img: '../../image/today/chenyuan.jpg',
            bookName: '尘缘',
            author: '烟雨江南',
            bookDes: '那一天，我摇动所有的经桶，不为超度，只为触摸你的指尖；那一年，在山路匍匐，不为觐见',
            isRead: false
        }
    ]
  },
  onReady: function() {
    var self = this;
    var timeResult = self.allMonths();
    self.setData({showMonths: timeResult.showMonths, headerText: timeResult.headerText});
  },
  allMonths: function(){
  	var resultArray = [];
  	var today = new Date();
  	var month = today.getMonth();
    // todo给出是否有记录的判断
  	resultArray.push({
      monthCname: Util.eNumToCNum(Math.abs(month))+'月',
      hasRecord: false
    });
  	for(var i=1; i<=6; i++){
  		resultArray.push({
        monthCname: Util.eNumToCNum(Math.abs(month-i<0? month+12-i: month-i))+'月',
        hasRecord: true
      });
  	}
  	return {
  		headerText: today.getFullYear()+'年'+resultArray[0].monthCname,
  		showMonths: resultArray.reverse()
  	}
  }
});