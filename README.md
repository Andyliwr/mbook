## **微书--小程序阅读应用**
毕业设计--基于微信小程序的在线免费小说的开发，该项目借助微信小程序的便捷特性，为用户提供快速，并且舒适的阅读体验。负责项目的原型设计，和小程序代码的开发。实现了书城，我的书单，以及在线阅读器功能，目前该项目已经吸引了一批身边爱好阅读的好友用户。

### 体验一下
微信扫码，立即进入小程序

![小程序二维码](https://file.lantingshucheng.com/1547434703456.jpeg?imageView2/1/w/200/h/200/q/75%7Cimageslim)

或者可以搜索小程序---美景阅读

![微信搜一搜](https://file.lantingshucheng.com/1547435360766.jpeg)

### **运行**
#### 使用`wept`启动小程序
```
npm i wept -g
cd 微信小程序所在目录
wept -p 3100
```
启动之后直接在浏览器里打开`localhost:3100`并启用手机调试模式就好了。

#### 启动后台接口
```
# 启动mongodb
mongod --config=E:\mongod_install\mongod.conf

# 启动redis
redis-server.exe redis.windows.conf

# 启动接口
cd api
node .

```

### **爬虫**
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
### **项目截图**
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
