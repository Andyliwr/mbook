## **微书--小程序阅读应用**
毕业设计--基于微信小程序的在线免费小说的开发，该项目借助微信小程序的便捷特性，为用户提供快速，并且舒适的阅读体验。负责项目的原型设计，和小程序代码的开发。实现了书城，我的书单，以及在线阅读器功能，目前该项目已经吸引了一批身边爱好阅读的好友用户。

>ps: 这个项目只是一个毕业设计，作者已经将它商业化并上线，github上公开的只是它早期的代码，如果想要商业合作，可以联系作者邮箱 `andyliwr@outlook.com`

## 体验一下
微信扫码，立即进入小程序

![小程序二维码](https://file.lantingshucheng.com/1547434703456.jpeg?imageView2/1/w/200/h/200/q/75%7Cimageslim)

或者可以搜索小程序---美景阅读

![微信搜一搜](https://file.lantingshucheng.com/1547435360766.jpeg)

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


## 爬虫
[爬虫部分说明](https://github.com/Andyliwr/mbook/blob/develop/reptile/README.md)

### **目录说明**

```
api --- 提供后台接口
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
## 项目截图
<div>
<img src="https://file.lantingshucheng.com/1521214550813.png" alt="" style="width: 250px; height: auto">
<img src="https://file.lantingshucheng.com/1521214553929.png" alt="" style="width: 250px; height: auto">
<img src="https://file.lantingshucheng.com/1521214558128.png" alt="" style="width: 250px; height: auto">
<img src="https://file.lantingshucheng.com/1521214565101.png" alt="" style="width: 250px; height: auto">
<img src="https://file.lantingshucheng.com/1521214567465.png" alt="" style="width: 250px; height: auto">
<img src="https://file.lantingshucheng.com/1521214571074.png" alt="" style="width: 250px; height: auto">
<img src="https://file.lantingshucheng.com/1521214572862.png" alt="" style="width: 250px; height: auto">
<img src="https://file.lantingshucheng.com/1521214576135.png" alt="" style="width: 250px; height: auto">
<img src="https://file.lantingshucheng.com/1521214578084.png" alt="" style="width: 250px; height: auto">
<img src="https://file.lantingshucheng.com/1521214580699.png" alt="" style="width: 250px; height: auto">
<img src="https://file.lantingshucheng.com/1521214583072.png" alt="" style="width: 250px; height: auto">
<img src="https://file.lantingshucheng.com/1521214585790.png" alt="" style="width: 250px; height: auto">
</div>
