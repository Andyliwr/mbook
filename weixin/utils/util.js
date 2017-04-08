import Promise from './es6-promise.min';

//判断用户填写的是username还是email
function judgeTelOrName(str){
  var phoneRegExp = new RegExp('^1[3|4|5|8][0-9]\d{4,8}$', 'g');
  var usernameRegExp = new RegExp('^(?![^a-zA-Z_]+$)(?!\D+$).{6,18}$', 'g');
  if(usernameRegExp.test(str)){
    return 'using_name';
  }else if(phoneRegExp.test(str)){
    return 'using_email';
  }else{
    return 'error';
  }
}

function eNumToCNum(num){
  if(typeof num == "number"){
    switch(num){
      case 0:
        return '一'
        break;
      case 1:
        return '二'
        break;
      case 2:
        return '三'
        break;
      case 3:
        return '四'
        break;
      case 4:
        return '五'
        break;
      case 5:
        return '六'
        break;
      case 6:
        return '七'
        break;
      case 7:
        return '八'
        break;
      case 8:
        return '九'
        break;
      case 9:
        return '十'
        break;
      case 10:
        return '十一'
        break;
      case 11:
        return '十二'
        break;
    }
  }else{
    console.log("传入的参数不是数字.");
    return '';
  }
}
//格式化时间函数01
function formatTime(date) {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//格式化时间函数02
function formatTime2(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

/**
 * format date to 'a minute ago, an hour ago, one day ago'
 * date nowtime
 */
function formatDate3(date) {
  var resultStr = '';
  var timePre = date.getTime();
  var now = new Date();
  var timeNow = now.getTime();
  if(timeNow >= timePre){
    var distance = (timeNow - timePre)/1000;
    if(distance >= 0 && distance < 60){
      resultStr = '刚刚';
    }else if(distance >= 60 && distance <= (60*60)){
      resultStr = Math.floor(distance/60)+'分钟前';
    }else if(distance > 3600 && distance <= (24*60*60)){
      resultStr = Math.floor(distance/3600)+"小时前";
    }else if(distance > 86400 && distance/(30*24*60*60)){
      resultStr = Math.floor(distance/86400)+"天前"
    }else{
      resultStr = formatTime(date);
    }
  }else{
    console.log('nowTime is behind on this time');
  }
  return resultStr;
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getDateStr(date) {
  if (!date) return '';
  return date.getFullYear() + '年' +  (date.getMonth() + 1) + '月' +date.getDate() + '日';
}

/**
 * 生成GUID序列号
 * @returns {string} GUID
 */
function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 记录日志
 * @param {Mixed} 记录的信息
 * @returns {Void}
 */
function log(msg) {
  if (!msg) return;
  if (getApp().settings['debug'])
    console.log(msg);
  let logs = wx.getStorageSync('logs') || [];
  logs.unshift(msg)
  wx.setStorageSync('logs', logs)
}

/**
 * @param {Function} func 接口
 * @param {Object} options 接口参数
 * @returns {Promise} Promise对象
*/
function promiseHandle(func, options) {
  options = options || {};
  return new Promise((resolve, reject) => {
    if (typeof func !== 'function')
        reject();
    options.success = resolve;
    options.fail = reject;
    func(options);
  });
}

/**
 * 显示错误函数
 * @param obj 操作对象
 * @param errorMsg 需要显示的错误信息
 */
function showErrMsg(obj, errorMsg, time){
  obj.setData({err_tips_data: {err_tips_show: true, err_tips_text: errorMsg}});
  setTimeout(function(){
      obj.setData({err_tips_data: {err_tips_show: false, err_tips_text: ''}});
  }, time || 3000);
}

//导出以上函数
module.exports = {
  formatTime: formatTime,
  formatTime2: formatTime2,
  formatDate3: formatDate3,
  judgeTelOrName: judgeTelOrName,
  eNumToCNum: eNumToCNum,
  guid: guid,
  log: log,
  promiseHandle: promiseHandle,
  getDateStr: getDateStr,
  formatNumber: formatNumber,
  showErrMsg: showErrMsg
}