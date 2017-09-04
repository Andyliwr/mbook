/**
 * Created by Andyliwr on 2017/2/23.
 */
const qiniu = require("qiniu");
const tinify = require("tinify"); // image compress
const eventproxy = require('eventproxy');
tinify.key = "Q0Q_7x6ppzaVY00KSOu1vc5-FVKyN20J";
const config = require('../config');

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = config.qiniuConfig.accessKey;
qiniu.conf.SECRET_KEY = config.qiniuConfig.secretKey;
if (config.qiniuConfig.isUseHttps) {
  qiniu.conf.SCHEME = 'https';
  // qiniu.conf.UP_HOST = 'https://up-z2.qbox.me';
  qiniu.conf.UP_HTTPS_HOST = 'https://up-z2.qbox.me';
}


//构建上传策略函数
function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
  return putPolicy.token();
}

//构造上传函数
function uploadFile(uptoken, key, localFile, success, fail) {
  var extra = new qiniu.io.PutExtra();
  qiniu.io.putFile(uptoken, key, localFile, extra, function (err, ret) {
    if (!err) {
      if (typeof success == 'function') {
        success(ret);
      }
    } else {
      // 上传失败， 处理返回代码
      if (typeof fail == 'function') {
        fail(err);
      }
    }
  });
}
//调用uploadFile上传

/**
 * @function uploadFileToQiNiu 上传文件的调用方法
 * @param localFileUrl 本地图片的url
 * @param remoteFileName 要上传的图片在远程服务器的名字
 * @param success 上传成功的回调
 * @param fail 上传失败的回调
 * @example uploadFileToQiNiu('./reptile/qn_upload/me_test2.jpg', 'me_test2.jpg', success, fail);
 *
 */
function uploadFileToQiNiu(localFileUrl, remoteFileName, success, fail) {
  //要上传的空间
  var bucket = config.qiniuConfig.bucket;
  //生成上传 Token
  var token = uptoken(bucket, remoteFileName);
  //要上传文件的本地路径
  uploadFile(token, remoteFileName, localFileUrl, success, fail);
}

// image compress
function imageComparess (url, saveName, callback){
  var urlReg = new RegExp('[a-zA-z]+://[^\s]*', '');
  if(urlReg.test(url)){
    if(typeof callback === "function"){
      tinify.fromUrl(url).toFile(saveName, callback);
    }else{
      tinify.fromUrl(url).toFile(saveName);
    }
  }else{
    console.log('It is not a url');
    if(typeof callback === "function"){
      console.log(url+' '+saveName)
      tinify.fromFile(url).toFile(saveName, callback);
    }else{
      tinify.fromFile(url).toFile(saveName);
    }
  }
}

// comparess and upload
function compressAndUpload(url, type, tmpPath, saveName, success, fail){
  var ep = new eventproxy();
  ep.all('hasFinishedCompress', function(data){
    // start to upload
    console.log('完成压缩'+data);
    if(typeof success !== 'function' && typeof fail !== 'function'){
      var success = function (ret) {
        console.log(url+ '  ===>  ' + 'https://olpkwt43d.qnssl.com/' + ret.key);
      };
      var fail = function (err) {
        console.log(url + '压缩失败....');
        console.log(err);
      };
    }
    uploadFileToQiNiu(tmpPath +data, 'myapp/'+ (type ? (type + '/') : '') + 'c_' + data, success, fail);
  });
  imageComparess(url, tmpPath + saveName, function(){
    ep.emit('hasFinishedCompress', saveName);
  });
}

// var success = function (ret) {
//   /**
//    * ret一般有两个值：
//    * hash： Fi1tl4j7NjPlt5xyFdhvIBpokrK6 上传图片的hash值
//    * key：me_test2.jpg 远程服务器图片的名字
//    */
//   console.log('success');
//   console.log(JSON.stringify(ret));
// };
// var fail = function (err) {
//   console.log('fail');
//   console.log(err);
// };
// uploadFileToQiNiu('me_test.jpg', 'avatar/me_test20170328.png', success, fail);
// imageComparess('http://avatar.csdn.net/E/2/7/1_u014374031.jpg', './tmp/1.jpg', function(){
//   console.log('success');
// })
// compressAndUpload('http://avatar.csdn.net/E/2/7/1_u014374031.jpg' ,'avatar', './tmp/', 'andyliwr.jpg', success, fail);

exports.uploadFileToQiNiu = uploadFileToQiNiu;
exports.imageComparess = imageComparess;
exports.compressAndUpload = compressAndUpload;