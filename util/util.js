function formatTime(time) {
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
module.exports = {
  formatTime: formatTime,
  judgeTelOrName: judgeTelOrName,
  eNumToCNum: eNumToCNum
}
