## **微书--小程序阅读应用**
毕业设计--基于微信小程序的在线免费小说的开发，该项目借助微信小程序的便捷特性，为用户提供快速，并且舒适的阅读体验。负责项目的原型设计，和小程序代码的开发。实现了书城，我的书单，以及在线阅读器功能，目前该项目已经吸引了一批身边爱好阅读的好友用户。

>ps: 这个项目只是一个毕业设计，作者已经将它商业化并上线，github上公开的只是它早期的代码，如果想要商业合作，可以联系作者邮箱 `andyliwr@outlook.com`

## 体验一下
微信扫码，立即进入小程序

![小程序二维码](https://file.lantingshucheng.com/1547434703456.jpeg?imageView2/1/w/200/h/200/q/75%7Cimageslim)

或者可以搜索小程序---美景阅读

![微信搜一搜](https://file.lantingshucheng.com/1547435360766.jpeg)

## 源码探讨
小程序开发、网站开发、咨询源码，可以加我微信
![dreamldk](https://img.vim-cn.com/ec/4d0369b5e7e836aa130fd4f47a1fc166447441.jpg)

## 运行
## 安装mongodb
windows系统可以参考我写的[教程](https://blog.csdn.net/u014374031/article/details/80268582)，mac自己捣鼓，总之你需要创建一个名为myapp的数据库，本地可以不开启认证，后端运行起来后可以正常连接mongo就行。

>ps: Mongo的连接配置都在 `api/server/datasources.json` 里，需要安装具体情况自行修改

### 安装redis
参考[教程](https://www.runoob.com/redis/redis-install.html)，安装成功之后启动redis，后端运行起来可以正常连接redis就可以了
>ps：redis的连接配置写在了 `api/server/models/my-app-user.js` 里，需要安装具体情况自行修改

### 快捷启动
因为本人以前也是用的 `windows` ，所以为了避免每次都敲代码启动 `mongo` 和 `redis` ，所以在 `autorun/windows`下写了一些脚本
但是这个不是立即就能使用的，需要自行改下mongo和redis的启动路径，具体的自己去看，如果你配置ok的话可以在cmd中直接运行 `./autorun/windows/start.bat` 来图像化界面启动各种程序。

## 启动后端程序

```bash
cd api
# 安装依赖，可以使用yarn或者cnpm
# cnpm不会装的参考 https://developer.aliyun.com/mirror/NPM?from=tnpm
cnpm install
# 启动程序
npm run start
# 
```
如果打印 `Web server listening at: http://localhost:9001`，恭喜你启动成功了

打开 `http://localhost:9001/explorer/` 就能看到项目下的所有接口

## 运行小程序
去[微信小程序官网](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)下载一个开发者工具，然后打开项目下的 `weixin` 目录即可
>ps 为了方便运行登录接口都是使用的mock数据，如果你有自己的小程序ID，可以到 `api/server/models/my-app-user.js` 自行修改

![2020-05-03-21-08-44](https://file.lantingshucheng.com/2020-05-03-21-08-44.png)


## 爬虫
[爬虫部分说明](https://github.com/Andyliwr/mbook/blob/develop/reptile/README.md)

### **目录说明**

```
reptile --- 所有的爬虫目录
  |- config.js --- 配置文件
  |- index.js --- 主程序
  |- init-database.js --- 初始化数据库，主要是往数据库写入一些书籍数据
  |- utils
    |- chineseToNum.js --- 解析数字，比如一千二百会变成1200
    |- fakeUserAgent.js --- 随机userAgent，反爬虫
    |- log.js --- 打日志到本地
    |- proxy.js --- ip代理
    |- redis.js --- redis方法
  |- models
    |- book.js --- 书籍表定义
    |- chapter.js --- 章节表定义
  |- package.json --- npm
```

### 其他
爬虫的原理是扫描数据库中所有的书籍，然后根据书籍的最新章节字段-newest，以及配置在source字段里的书籍来源去分析需要更新哪些章节。
这个爬虫可以用来初始化整本书，newest默认为0

### 运行
第一次下载项目可以运行 `npm run init`，这会往书籍表中写入测试书籍
修改mongo配置文件就可以运行爬虫了
执行爬虫可以运行 `npm run start`


## 项目截图
### 小程序
<div>
<img src="https://file.lantingshucheng.com/1521214550813.png" alt="" style="width: 180px; height: auto">
<img src="https://file.lantingshucheng.com/1521214553929.png" alt="" style="width: 180px; height: auto">
<img src="https://file.lantingshucheng.com/1521214558128.png" alt="" style="width: 180px; height: auto">
<img src="https://file.lantingshucheng.com/1521214565101.png" alt="" style="width: 180px; height: auto">
<img src="https://file.lantingshucheng.com/1521214567465.png" alt="" style="width: 180px; height: auto">
<img src="https://file.lantingshucheng.com/1521214571074.png" alt="" style="width: 180px; height: auto">
<img src="https://file.lantingshucheng.com/1521214572862.png" alt="" style="width: 180px; height: auto">
<img src="https://file.lantingshucheng.com/1521214576135.png" alt="" style="width: 180px; height: auto">
<img src="https://file.lantingshucheng.com/1521214578084.png" alt="" style="width: 180px; height: auto">
<img src="https://file.lantingshucheng.com/1521214580699.png" alt="" style="width: 180px; height: auto">
<img src="https://file.lantingshucheng.com/1521214583072.png" alt="" style="width: 180px; height: auto">
<img src="https://file.lantingshucheng.com/1521214585790.png" alt="" style="width: 180px; height: auto">
</div>

### 后台

![2020-05-03-20-56-31](https://file.lantingshucheng.com/2020-05-03-20-56-31.png)
