//login.js
var Api = require('../../util/api/api.js');
var Util = require('../../util/util.js');

Page({
  data: {
    headerText: '',
    showMonths: []
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