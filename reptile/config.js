var websiteConfig = [
  {
    factionName: '大主宰',
    des: '大千世界，位面交汇，万族林立，群雄荟萃，一位位来自下位面的天之至尊，在这无尽世界，演绎着令人向往的传奇，追求着那主宰之路。 无尽火域，炎帝执掌，万火焚苍穹。 武境之内，武祖之威，震慑乾坤。 西天之殿，百战之皇，战威无可敌。 北荒之丘，万墓之地，不死之主镇天地。 ...... 少年自北灵境而出，骑九幽冥雀，闯向了那精彩绝伦的纷纭世界，主宰之路，谁主沉浮？ 大千世界，万道争锋，吾为大主宰。',
    headerImage: 'http://qiniu.andylistudio.com/myblog/images/dazhuzai.jpg',
    author: '烟雨江南',
    allResources: [
      {
        sourceName: '爱下电子书',
        url: 'http://read.ixdzs.com/66/66485/',
        coreUrl: 'http://read.ixdzs.com/66/66485/',
        des: '爱下电子书-大主宰，再给出的页面中罗列了所有的小说章节，在爬取的时候得分不同的情况',
        firstSign: '.catalog .chapter > a',
        inWhatAttr: 'href',//链接存储的属性
        secondSign: '.content'
      },
      {
        sourceName: "百度贴吧",
        url: 'http://tieba.baidu.com/f?kw=%E5%A4%A7%E4%B8%BB%E5%AE%B0&ie=utf-8',
        coreUrl: 'http://tieba.baidu.com',
        des: '百度贴吧-大主宰吧，大主宰吧只把最新的小说章节放在置顶ul里, 贴吧每篇文章的url：http://tieba.baidu.com/p/4753875404，贴吧入口data-field="{"id":4755659306...}，百度贴吧吧内容都放在了data_field里，content.content即可访问到内容，不过内容进行了unicode的编码',
        firstSign: '.thread_top_list_folder .thread_top_list li .threadlist_title.pull_left.j_th_tit a',
        inWhatAttr: 'href',//链接存储的属性
        secondSign: '.p_postlist .l_post.l_post_bright.j_l_post .d_post_content.j_d_post_content'
      }
    ]
  }
];
var localMongoJson = {
  url: 'localhost',
  port: '27017',
  dbName: 'myapp',
  username: 'lidikang',
  password: '123456'
};
var mongoConfig = {
  url: 'ds021326.mlab.com',
  port: '21326',
  dbName: 'myapp',
  username: 'lidikang',
  password: '121960425mongo'
}
//暴露websiteConfig
exports.websiteConfig = websiteConfig;
exports.mongoConfig = mongoConfig;
exports.localMongoJson = localMongoJson;
