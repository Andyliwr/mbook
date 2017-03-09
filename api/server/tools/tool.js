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

exports.overflowDeal = overflowDeal;
exports.getQdTrueImgUrl = getQdTrueImgUrl;
