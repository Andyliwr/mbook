var websiteConfig = [
    {
        factionName: '大主宰',
        publishSite: {
            baiduTieBa: {
                url: 'http://tieba.baidu.com/f?kw=%E5%A4%A7%E4%B8%BB%E5%AE%B0&ie=utf-8',
                coreUrl: 'http://tieba.baidu.com',
                des: '百度贴吧-大主宰吧+++++大主宰吧只把最新的小说章节放在置顶ul里, 贴吧每篇文章的url：http://tieba.baidu.com/p/4753875404，贴吧入口data-field="{"id":4755659306...}+++++百度贴吧吧内容都放在了data_field里，content.content即可访问到内容，不过内容进行了unicode的编码',
                firstSign: '.thread_top_list_folder .thread_top_list li .threadlist_title.pull_left.j_th_tit a',
                inWhatAttr: 'href',//链接存储的属性
                secondSign: '.p_postlist .l_post.l_post_bright.j_l_post .d_post_content.j_d_post_content'
            }
        }
    }

];
var localMongoJson = {
  url: '127.0.0.1',
  port: '27017',
  dbName: 'myApp',
  username: 'user001',
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
