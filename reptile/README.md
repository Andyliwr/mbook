# 小迪小说爬取器

## + 用法
### 1. 如何设置程序的执行时间
使用的是node的node-schedule，具体的你可以参考官网[node-schedule](https://www.npmjs.com/package/node-schedule#recurrence-rule-scheduling)

```
var schedule = require('node-schedule');

var j = schedule.scheduleJob('42 * * * *', function(){
  console.log('The answer to life, the universe, and everything!');
});
```
  + 格式：
```
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
```

### 2. 如何新增自己想扒的小说

这个你就得理解程序的实质了。程序大体上技术如下，使用node-schedule控制爬虫每隔一天执行一次，所有网站的配置未见在config.js里（你可以在里面新建一个网站源）。对于每隔网站源，使用superangent发请求去获取网页html源码，在使用cheerio分析html源码，解析出你想要的数据所在的标签-firstSign和secondSign，对于二级网页，使用eventproxy控制并发，当所有爬虫都返回，整理数据，并存入mongo。所以等后期程序完毕，你只需要在config里新增网页源就可以拿到你想要的数据，不过这应该还差很远，继续努力吧。


## + 注释

由于本人水平有限，下载的源码会比较难运行成功，如果console中看到如下输出：

1. 数据库无数据，请释放initDB函数，初始化数据！！

   请在/connectDB/connectDB.js中早到init方法，将其从注释状态释放，然后打开terminal输入node connectDB.js初始化数据库

2. 现在程序只会每隔一天时间从百度贴吧扒文章，以后会继续加入起点，以及其他小说源网页的爬虫。

## + 截图

![img1](http://res.cloudinary.com/idwzx/image/upload/v1472804218/Screenshot_from_2016-09-02_16-16-13_m0psdb.png)

![img1](http://res.cloudinary.com/idwzx/image/upload/v1472804354/Screenshot_from_2016-09-02_16-19-02_fzdmpk.png)

![img1](http://res.cloudinary.com/idwzx/image/upload/v1472804324/Screenshot_from_2016-09-02_16-18-13_f7rulp.png)

3. mongo菜鸟笔记
+ 怎更新文档：
```javascript
db.factionlistmodels.update({factionName: '大主宰'}, {$set: {sectionArray:  [....]}});
```

,
      {
        sourceName: "百度贴吧",
        url: 'http://tieba.baidu.com/f?kw=%E5%A4%A7%E4%B8%BB%E5%AE%B0&ie=utf-8',
        coreUrl: 'http://tieba.baidu.com',
        des: '百度贴吧-大主宰吧，大主宰吧只把最新的小说章节放在置顶ul里, 贴吧每篇文章的url：http://tieba.baidu.com/p/4753875404，贴吧入口data-field="{"id":4755659306...}，百度贴吧吧内容都放在了data_field里，content.content即可访问到内容，不过内容进行了unicode的编码',
        firstSign: '.thread_top_list_folder .thread_top_list li .threadlist_title.pull_left.j_th_tit a',
        inWhatAttr: 'href',//链接存储的属性
        secondSign: '.p_postlist .l_post.l_post_bright.j_l_post .d_post_content.j_d_post_content'
      }