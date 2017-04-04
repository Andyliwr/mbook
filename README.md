# **graduationDesign**
毕业设计--基于微信小程序的在线免费小说的开发，该项目借助微信小程序的便捷特性，为用户提供快速，并且舒适的阅读体验。负责项目的原型设计，和小程序代码的开发。实现了书城，我的书单，以及在线阅读器功能，目前该项目已经吸引了一批身边爱好阅读的好友用户。

## **项目截图**
<div style="width: 100%;display:flex;flex-flow:row wrap;justify-content:space-around">
    <img src="https://olpkwt43d.qnssl.com/myapp/show/1.png" alt="" style="flex: 30%;">
    <img src="https://olpkwt43d.qnssl.com/myapp/show/2.png" alt="" style="flex: 30%;">
    <img src="https://olpkwt43d.qnssl.com/myapp/show/3.png" alt="" style="flex: 30%;">
    <img src="https://olpkwt43d.qnssl.com/myapp/show/4.png" alt="" style="flex: 30%;">
    <img src="https://olpkwt43d.qnssl.com/myapp/show/5.png" alt="" style="flex: 30%;">
    <img src="https://olpkwt43d.qnssl.com/myapp/show/6.png" alt="" style="flex: 30%;">
    <img src="https://olpkwt43d.qnssl.com/myapp/show/7.png" alt="" style="flex: 30%;">
    <img src="https://olpkwt43d.qnssl.com/myapp/show/9.png" alt="" style="flex: 30%;">
</div>


## **运行**
建议使用VSCode+wept开发微信小程序，VSCode安装JWSnippets-For-VSCode就可以将wxml、wxss解析成html和css，而wept支持使用chrome来调试微信小程序。下面讲讲这两种方法的使用：
### **`JWSnippets-For-VSCode`**
1. [下载安装VSCode](https://code.visualstudio.com)
2. 下载[JWSnippets-For-VSCode](http://pan.baidu.com/s/1miuOy84)， 提取码：8xan
3. 安装JWSnippets-For-VSCode
    ---
    **A. 将json文件放入IDE的sinppets目录：**

    `VSCode`
    - Windows版本：`C:\Users\用户名\AppData\Roaming\Code\User\snippets`
    - Mac版本：`/Users/用户名/Library/Application Support/Code/User/snippets`

    `Wing`
    - Windows版本：C:\Users\用户名\AppData\Roaming\EgretWing\User\snippets
    - Mac版本：/Users/用户名/Library/Application Support/EgretWing/User/snippets


    > 如果找不到上述目录，可以打开IDE菜单->首选项->用户代码片段，分别选择Javasript、HTML(或者WXML)，将下载的文件代码手动copy进去，保存即可。

    **B. 打开IDE菜单->首选项->用户设置，在settings.json加入以下代码：**

    `VSCode：`
    ```
    "files.associations": { "*.wxml": "html", "*.wxss": "css"}
    ```
    `Wing：`
    ```
    "files.associations": { "*.wxss": "css"}
    ```

    **C. 为防止和其他命令冲突，本sinppet触发命令以'jw'开头。**
    如有疑问，可参照johnwang77大神的[github](https://github.com/johnwang77/JWSnippets-For-VSCode/blob/master/README.md)

### **`WEPT`**

`WEPT` 是一个微信小程序实时开发环境，它的目标是为小程序开发提供高效、稳定、友好、无限制的运行环境。项目后台使用 node 提供服务完全动态生成小程序，前端实现了 view 层、service 层和控制层之间的相关通讯逻辑。支持 Mac, Window 以及 Linux

**1. 主要特性**:
+ 支持 wxml, wxss, javascript 和 json 保存后热更新
+ 支持系统 notification 更早提示构建和请求错误
+ 使用后台转发 XMLHttpRequest 请求，无需配置 CORS, 可 配置代理
+ 支持 所有小程序公开 API
+ 可使用 Chrome 移动页面调试，可在移动端体验
+ 支持 appData 和 storage 面板，需下载 [Chrome 插件](https://chrome.google.com/webstore/detail/wechat-devtools-extension/cmpjfobofbhbghjodehbohchlghacmll)

**2.安装与运行**
```
npm i wept -g
cd 微信小程序所在目录
wept -p 3100
```
启动之后直接在浏览器里打开`localhost:3100`并启用手机调试模式就好了。

## **启动后台接口**
```
启动mongodb
mongod --config=E:\mongod_install\mongod.conf

启动redis
redis-server.exe redis.windows.conf

启动接口
cd api
node .

```

## **目录说明**

```
api --- 提供后台接口
    |-client --- 暂无用处
    |-common --- loopback的公共模型
    |-server --- loopback的服务器模型
            |- boot --- 初始化执行脚本
            |- modle --- 所有定义的模型目录
            |- datasources.json --- 数据源定义文件
            |- middleware.json --- 中间件配置文件
            |- modle-config.json --- 模型定义文件
            |- server.js --- 主程序
reptile --- 所有的爬虫目录
        |- connectDB --- 连接数据库，操作数据库方法类
        |- tools --- 实用方法类
        |- networkReptile.js --- 爬虫主程序
        |- config.js --- 爬虫配置js
weixin --- 微信小程序目录
       |- assets --- 静态资源文件
       |- datas --- 静态数据
       |- images --- 图片资源文件
       |- page --- 所有微信小程序的页面
       |- util --- 工具类
       |- app.js --- 微信小程序入口文件
```

## **前端完成进度**

1. 登录页面 --- done
2. 今日页面 --- 改版成为个人中心页
3. 我的书单页面 --- 完成了静态页面，尚未写接口逻辑
4. 教务页面 --- 完成了静态页面，尚未写接口逻辑
5. 书单排行榜页面 --- 完成了静态页面，并调用了获取排行榜的接口，现余下要修复的bug如下，A:纵横网言情分类返回的数据都是xxx的模拟数据，B:排行每本书的点击事件，这个要等book_detail完成之后才会得到解决
6. 书城页面 --- 完成了静态页面，尚未写接口逻辑
7. 开始book_detail页面的编写 ---
8. 使用gulp和scss来管理微信小程序的代码 --- 废弃使用webpack打包小程序
9. 阅读器 --- 已完成

## **后端完成进度**
1. 爬虫升级 --- done ，现在可以同时爬去百度贴吧和爱下电子书两个来源的小说
2. 排行榜的爬虫 --- 已完成
3. 新增排行榜的接口 --- 已完成，今天又修复了两个bug，A:rank中的书籍信息增加bookId方便以后根据此id定位到bookDetai页面，B:攻破起点网小说图片防盗链的小关卡
4. 开始书城中推荐版块，免费新书版块后端接口的建设
5. 改进之前的factionContents模块，增加根据bookId获取书籍包括所有章节和一些其他信息的接口
6. 微信登录 --- 正在进行

### 测试未绑定的微信的用户
auth: {\"type\": \"wechat\", \"wxOpenId\": \"oj7fq0NOUGhlm798MwxrIGmmFXTM\"}

### 爱下电子书过滤章节的规则
+ 爱下电子书常用的小说章节命名：
    ```
    5.第5章 忠心弟子
    第四章 大浮屠诀
    公告！此书暂停！
    完本感言以及新书发布！
    〖免费公告〗关于结局加更一章！！！
    010 强化训练(四)
    第0228章 哈赤之墓（2）
    五　驯服
    ```

+ 过滤正则表达式：
    ```
    第[一二...十0123...9]章
    [0-9]
    没有任何数字的，全部去掉
    ```
+ 注释：

    过滤之后trim去掉空格

### 常用的mongo查询
```
//查询所有这部小说的章节并排序
db.getCollection('factioncontents').find({des: /天影/, sectionResource:'爱下电子书'}).sort({sectionNum: 1})
//查询这部小说的详细信息
db.getCollection('factionlists').find({factionName: '天影'})
```
### mongoose查询链式语法
```
 Person
      .find({ occupation: /host/ })
      .where('name.last').equals('Ghost')
      .where('age').gt(17).lt(66)
      .where('likes').in(['vaporizing', 'talking'])
      .limit(10)
      .sort('-occupation')
      .select('name occupation')
      .exec(callback);
```
### 如何使用node promise
```
var promise = require('bluebrid');
Myappuser.find({username: 'lidikang'})
      .then(function(res){
        console.log(res);
        callback(null, 'hi');
      })
      .catch(function (err) {
        console.log(err);
      });
```
### find
```
var docs = yield collection.find({})
  .skip(1).limit(1).project({b:1}).toArray();
    test.equal(1, docs.length);
    test.equal(null, docs[0].a);
    test.equal(2, docs[0].b);

    // Close db
    db.close();
```

### 剩余要做的
+ 前端在每次用户离开的时候存储一个时间，后端getMyBooks接口的时候返回updateTime这个字段，前端用这个字段做判断，已经阅读的不再提示
+ 后端直接对比最新章节数和以阅读章节数