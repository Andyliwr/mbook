/**
 * Created by Andyliwr on 2017/2/23.
 */
var qiniu = require("qiniu");
var config = require('../config');

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
            if(typeof success == 'function'){
                success(ret);
            }
        } else {
            // 上传失败， 处理返回代码
            if(typeof fail == 'function'){
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

var success = function (ret) {
    /**
     * ret一般有两个值：
     * hash： Fi1tl4j7NjPlt5xyFdhvIBpokrK6 上传图片的hash值
     * key：me_test2.jpg 远程服务器图片的名字
     */
    console.log('success');
    console.log(JSON.stringify(ret));
};
var fail = function (err) {
    console.log('fail');
    console.log(err);
};
uploadFileToQiNiu('me_test.jpg', 'me_test20170326.jpg', success, fail);

exports.uploadFileToQiNiu = uploadFileToQiNiu;