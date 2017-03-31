var Compare = require('./compareJSON');

//判断是否有重复项
var isInArray = function (array, sameElement) {
  if (!(array instanceof Array)) {
    return false;
  } else {
    for (var i = 0; i < array.length; i++) {
      //json1={a:1}, json2={a:1}, json1 != json2
      if (sameElement instanceof Object) {
        // console.log("我是一个对象");
        // console.log('此次比对结果是：'+Compare(array[i], sameElement));
        // console.log('原告人：');
        // console.log(sameElement);
        // console.log('被告人：');
        // console.log(array[i]);
        if (Compare(array[i], sameElement) == true) {
          return true;
        } else {
          continue;
        }
      } else {
        if (array[i] == sameElement) {
          return true;
        }
      }
    }
    return false;
  }
};

//于千军万马中挑出中意的小说内容
var selectCorrect = function (array) {
  if (!(array instanceof Array)) {
    return '';
  } else {
    for (var i = 0; i < array.length; i++) {
      if (array[i].length > 300 && array[i].match('第*章')) {
        return array[i];
      }
    }
    return '';
  }
};

//联合两个JSON数组, 比如JSON1=[{a:1, b:2}],JSON2=[{c:3, d:4}], concatJSON(JSON1, JSON2)结果为[{a:1, b:2, c:3, d:4}]
var concatJSON = function (JSONArray1, JSONArray2) {
  var finalJSONArray = [];
  if (JSONArray1.length != JSONArray2.length) {
    console.log('两个JSON数组长度不一致！！');
    return null;
  }
  for (var i = 0; i < JSONArray1.length; i++) {
    if ((!JSONArray1[i] instanceof Array) || (!JSONArray2 instanceof Array)) {
      console.log('不是JSON数组');
      return null;
    }
    var finalJSONArrayTemp = {};

    for (var attr in JSONArray1[i]) {
      finalJSONArrayTemp[attr] = JSONArray1[i][attr];
    }
    for (var attr in JSONArray2[i]) {
      finalJSONArrayTemp[attr] = JSONArray2[i][attr];
    }
    finalJSONArray.push(finalJSONArrayTemp);
  }
  return finalJSONArray;
};

//提取JSON数组里某个特殊字段形成数组
function getElementArray (jsonArray, element) {
  if (!jsonArray instanceof Object) {
    console.log("提取json数组中特定值时传入的json数组格式错误1！");
    return null;
  }
  var resultArray = [];
  for (var i = 0; i < jsonArray.length; i++) {
    //这个地方不能直接用变量来引用json的属性，会出现undefined的错误
    if (jsonArray[i][element] == undefined) {
      console.log("提取json数组中特定值时传入的json数组格式错误2！");
      return null;
    } else {
      resultArray[i] = jsonArray[i][element];
    }
  }
  return resultArray;
};

//去掉第和章之间的非数字
var removeNaN = function (str) {
  var standardNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '千', '百', '万', '亿'];
  if (typeof str == 'string') {
    var strArray = str.split("");
    for (var i = 0; i < strArray.length; i++) {
      if (!isInArray(standardNum, strArray[i])) {
        strArray[i] = '';
      }
    }
    return strArray.join('');
  } else {
    console.log('你传给removeNaN的参数格式错误，不是一个string！');
    return '';
  }
};

//获取今天的日期
var getToDayStr = function () {
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth();
  month = month > 9 ? month : '0' + month;
  var day = today.getDate();
  day = day > 9 ? day : '0' + day;
  var week = today.getDay();
  switch (week) {
    case 1:
      week = '星期一';
      break;
    case 2:
      week = '星期二';
      break;
    case 3:
      week = '星期三';
      break;
    case 4:
      week = '星期四';
      break;
    case 5:
      week = '星期五';
      break;
    case 6:
      week = '星期六';
      break;
    case 0:
      week = '星期天';
      break;
    default:
      week = '';
      break;
  }
  return year + '年' + month + '月' + day + '日 ' + week;
};

var isTwoJSONArrSame = function (jsonArr1, jsonArr2) {
  if (jsonArr1 instanceof Array && jsonArr2 instanceof Array) {
    if (jsonArr1.length == jsonArr2.length) {
      return jsonArr1.every(function (item, index) {
        var str1 = JSON.stringify(item);
        var str2 = JSON.stringify(jsonArr2[index]);
        return str1 == str2;
      });
    } else {
      return false;
    }
  } else {
    console.log('传给isTwoJSONArrSame的参数格式错误....');
    return false;
  }
}
/**
 * 格式化日期函数，给定一个日期对象，会被格式化成"2017/03/18 01:01:02"这种格式
 * @param dateObj 日期对象
 */
function formatDate (dateObj) {
  var year = dateObj.getFullYear();
  var month = dateObj.getMonth() + 1;
  month = month < 9 ? '0' + month : month;
  var day = dateObj.getDate();
  day = day < 9 ? '0' + day : day;
  var hour = dateObj.getHours();
  hour = hour < 9 ? '0' + hour : hour;
  var minute = dateObj.getMinutes();
  minute = minute < 9 ? '0' + minute : minute;
  var second = dateObj.getSeconds();
  second = second < 9 ? '0' + second : second;
  return year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
}

/**
 * remove duplicate item from a JSON Array
 * @param jsonArr
 * @param according remove duplicate item according what
 * @param whenDuplicate the callback when found duplicate item
 */
function removeDuplicate (jsonArr, according, whenDuplicate) {
  var result = []; //the fianl result needing return
  if((jsonArr instanceof Array) && typeof according == 'string'){
    var sectionNumArr = []; // an array contains all contents sectionNum
    jsonArr.forEach(function(item, index){
      try{
        if(!isInArray(sectionNumArr, item[according])){
          result.push(item);
          sectionNumArr.push(item[according]);
        }else{
          if(typeof whenDuplicate === 'function' && item.id){
            whenDuplicate(item.id);
          }
          // console.log('when running removeDuplicate, index '+ (index+1) +' of item is duplicate, item: '+JSON.stringify(item));
        }
      } catch (e){
        console.log('when running removeDuplicate, index '+ (index+1) +'of item do not have the property of '+according)
      }
    });
  }else{
    console.log('The parameter of fuction---removeDuplicate is illegal')
  }
  return result.sort(function(item1, item2){
      if(typeof item1[according] === 'number'){
        return item1[according] - item2[according];
      }else if(typeof item1[according] === 'string'){
        return item1[according].length - item2[according].length;
      }else{
        var number1 = new Number(item1[according]);
        var number2 = new Number(item2[according]);
        return number1 - number2;
      }
    }
  );
}

exports.isInArray = isInArray;
exports.selectCorrect = selectCorrect;
exports.concatJSON = concatJSON;
exports.getElementArray = getElementArray;
exports.removeNaN = removeNaN;
exports.getToDayStr = getToDayStr;
exports.isTwoJSONArrSame = isTwoJSONArrSame;
exports.formatDate = formatDate;
exports.removeDuplicate = removeDuplicate;