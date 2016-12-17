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

module.exports = {
  formatTime: formatTime,
  judgeTelOrName: judgeTelOrName
}
