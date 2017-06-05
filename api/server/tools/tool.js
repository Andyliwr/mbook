/**
 * Created by Andyliwr on 2017/2/23.
 * @function overflowDeal 对字符串做省略处理，超过50字省略
 * @param str 要格式化的字符串
 */
function overflowDeal(str){
  var returnStr = '';
  if(typeof str == 'string'){
    //先去除没有用的空格和换行
    var reg = new RegExp('[　　| |\n|\t]', 'igm');
    str = str.replace(reg, '');
    if(str.length > 60){
      returnStr = str.substring(0, 50)+'....';
    }else{
      returnStr = str;
    }
  }else{
    console.log('传给overflowDeal的参数错误....');
  }
  return returnStr;
}
/**
 * @param imgurl
 * @description 在爬取到的起点小说网的链接前方加上http协议，并且将末尾的\r\n给去掉
 */
function getQdTrueImgUrl(imgurl){
  var returnStr = '';
  if(typeof imgurl == "string"){
    returnStr = 'http:'+imgurl.substring(0, imgurl.length-2);
  }
  return returnStr;
}

/**
 * 格式化日期函数，给定一个日期对象，会被格式化成"2017/03/18 01:01:02"这种格式
 * @param dateObj 日期对象
 */
function formatDate (dateObj) {
  let year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1;
  month = month < 9 ? '0' + month : month;
  let day = dateObj.getDate();
  day = day < 9 ? '0' + day : day;
  let hour = dateObj.getHours();
  hour = hour < 9 ? '0' + hour : hour;
  let minute = dateObj.getMinutes();
  minute = minute < 9 ? '0' + minute : minute;
  let second = dateObj.getSeconds();
  second = second < 9 ? '0' + second : second;
  return year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
}

/**
 * Array delete one element, and return the array
 * @param arr
 * @parma ele the element needding to be deleted
 */
function removeElement(arr, ele){
  let result  = [];
  if(arr instanceof Array){
    if(ele instanceof Array){
      result = arr.filter(function(item){
        let isInEle = ele.some(function(eleItem){
          return item === eleItem;
        });
        return !isInEle
      })
    }else{
      result = arr.filter(function(item){
        return item !== ele
      })
    }
  }else{
    console.log('parameter error of function removeElement');
  }
  return result;
}

exports.overflowDeal = overflowDeal;
exports.getQdTrueImgUrl = getQdTrueImgUrl;
exports.formatDate = formatDate;
exports.removeElement = removeElement;
