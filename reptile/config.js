var websiteConfig = [
  {
    factionName: '第一序列',
    des: '诸位，我是会说话的肘子，我回来了。这是一个新的故事。',
    headerImage: 'https://img22.aixdzs.com/a9/a7/a9a7ce2a6c648fe4bbaecb6098708a06.jpg',
    author: '会说话的肘子',
    allResources: [
      {
        sourceName: '爱下电子书',
        url: 'https://read.aixdzs.com/217/217733/',
        coreUrl: 'https://read.aixdzs.com/217/217733/',
        des: '爱下电子书-大主宰，再给出的页面中罗列了所有的小说章节，在爬取的时候得分不同的情况',
        firstSign: '.catalog .chapter > a',
        inWhatAttr: 'href',//链接存储的属性
        secondSign: '.content'
      }
    ]
  }
];
var localMongoJson = {
  url: 'server.vmware.local',
  port: '27017',
  dbName: 'myapp',
  username: 'admin',
  password: '196925'
};
var mongoConfig = {
  url: 'server.vmware.local',
  port: '27017',
  dbName: 'myapp',
  username: 'admin',
  password: '196925'
};

//七牛配置
var qiniuConfig = {
  accessKey: 'pz1XaE-dFVk3VZuYURIG2clGaXIep9awYrpzILprxHtX1ZP', //七牛账号的key值，https://portal.qiniu.com/user/key
  secretKey: 'z8zfwNwIFo_Uy6w5gKLHjYvubafTgCuBNAhUXiY1',
  bucket: 'andyliwr-server-song', //空间名称
  isUseHttps: false, //配置使用https，并且对应到正确的区域，详情请查考https://github.com/gpake/qiniu-wxapp-sdk/blob/master/README.md
};
//暴露websiteConfig
exports.websiteConfig = websiteConfig;
exports.mongoConfig = mongoConfig;
exports.localMongoJson = localMongoJson;
exports.qiniuConfig = qiniuConfig;
