/**
 * Created by Andyliwr on 2017/4/8.
 */
const program = require('commander');
const connectDB = require('./connectDB/connectDB');
const myAppTools = require('./tools/myAppTools');
const qiniuOperation = require('./qiniu/allOperation');
const fs = require('fs');
connectDB.configLog('operation');

var log4js = require('log4js');
//config log
log4js.configure({
  appenders: [
    {type: 'console'},
    {type: 'file', filename: './log/operation.log', category: 'operation'}
  ]
});
const logger = log4js.getLogger('operation');

fs.exists('./log', function (ret) {
  if (!ret) {
    logger.warn('日志目录不存在，正在为你创建....');
    fs.mkdir('log');
  }
  fs.open('./log/operation.log', 'a', function (err, fd) {
    if (err) {
      console.log('创建日志文件失败！');
    }
  });
});

logger.info('\n\n\n');
program
  .version('0.0.1')
  .option('-a, --action [action]', '指定要执行的动作，比如压缩图片compressImage，上传图片uploadImage，上传并压缩图片compresssAndUpload', /^(compressImage|uploadImage|compresssAndUpload)$/i)
  .option('-i, --inpath [inpath]', '指定源文件目录，相对路径')
  .option('-c, --collection [collection]', '指定上传到七牛云服务器哪个分类的目录下，如果为空则为myapp的根目录')
  .option('-o, --outpath [inpath]', '指定输出文件目录，相对路径')
  .parse(process.argv);

program.on('--help', function () {
  console.log('  Examples:');
  console.log('');
  console.log('    $ custom-help --help');
  console.log('    $ custom-help -h');
  console.log('');
});


var action = program.action;
switch (action) {
  case 'compressImage':
    logger.info('开始压缩');
    var inpath = program.inpath;
    var fileName = inpath.match(/[^\s/]+\.(jpg|png|jpeg|JPEG|PNG)/g)[0];
    if(inpath){
      var output = program.outpath;
      if(!output){
        output = './'+ 'c_' +fileName
      }
      qiniuOperation.imageComparess('./qiniu/tmp/andyliwr.jpg', './c_andyliwr.jpg', function(){
        logger.warn('图片已成功压缩至' + output);
      });
    }else{
      logger.warn('请指定要压缩文件的相对地址')
    }
    break;
  case 'uploadImage':
    logger.info('开始上传');
    break;
  case 'compresssAndUpload':
    logger.info('开始压缩并上传');
    break;
  default:
    logger.warn('参数错误，请参照帮助文档')
    program.help();
}
