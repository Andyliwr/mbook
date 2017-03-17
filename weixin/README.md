# **graduationDesign**
毕业设计--基于微信小程序的在线免费小说的开发

## **运行**
建议使用VSCode+wept开发微信小程序，VSCode安装JWSnippets-For-VSCode就可以将wxml、wxss解析成html和css，而wept支持使用chrome来调试微信小程序。下面讲讲这两种方法的使用：
### **`JWSnippets-For-VSCode`**
1. [下载安装VSCode](https://code.visualstudio.com)
2. 下载[JWSnippets-For-VSCode](http://pan.baidu.com/s/1miuOy84)， 提取码：8xan
3. 安装JWSnippets-For-VSCode
    ---
    **1.将json文件放入IDE的sinppets目录：**

    `VSCode`
    - Windows版本：C:\Users\用户名\AppData\Roaming\Code\User\snippets
    - Mac版本：/Users/用户名/Library/Application Support/Code/User/snippets

    `Wing`
    - Windows版本：C:\Users\用户名\AppData\Roaming\EgretWing\User\snippets
    - Mac版本：/Users/用户名/Library/Application Support/EgretWing/User/snippets


    > 如果找不到上述目录，可以打开IDE菜单->首选项->用户代码片段，分别选择Javasript、HTML(或者WXML)，将下载的文件代码手动copy进去，保存即可。

    **2.打开IDE菜单->首选项->用户设置，在settings.json加入以下代码：**

    `VSCode：`
    ```
    "files.associations": { "*.wxml": "html", "*.wxss": "css"}
    ```

    `Wing：`
    ```
    "files.associations": { "*.wxss": "css"}
    ```

    **3.为防止和其他命令冲突，本sinppet触发命令以'jw'开头。**

    ### 命令说明：
    ---
    - 组件命令和API命令分别关联wxml和wxss文件，不用担心触发命令会冲突

    ### 组件命令列表：
    ---

    组件命令 | 命令说明 | 组件命令 | 命令说明
    ---|---|---|---
    jwview | 创建view组件 | jwradio-group | 创建radio-group组件
    jwscroll-view | 创建组件 | jwradio | 创建radio组件
    jwswiper | 创建swiper组件 | jwslider | 创建slider组件
    jwicon | 创建icon组件 | jwswitch | 创建switch组件
    jwtext | 创建text组件 | jwaction-sheet | 创建action-sheet组件
    jwprogress | 创建progress组件 | jwmodal | 创建modal组件
    jwbutton | 创建button组件 | jwtoast | 创建toast组件
    jwcheckbox-group | 创建checkbox-group组件 | jwloading | 创建loading组件
    jwcheckbox| 创建checkbox组件 | jwnavigator | 创建navigator组件
    jwform | 创建form组件 | jwaudio | 创建audio组件
    jwinput | 创建input组件 | jwimage | 创建image组件
    jwlabel | 创建label组件 | jwvideo | 创建video组件
    jwpicker-selector | 创建picker-selector组件 | jwmap | 创建map组件
    jwpicker-time | 创建picker-time组件 | jwcanvas | 创建canvas组件
    jwpicker-date | 创建picker-date组件

    其他命令 | 命令说明 | 其他命令 | 命令说明
    ---|---|---|---
    jwtemplate | 创建template模板 | jwimport wxml | import wxml文件
    jwtemplate is | 创建template组件 | jwinclude wxml | include wxml文件

    ### API命令列表：
    ---

    API命令 | 命令说明 | API命令 | API说明
    ---|---|---|---
    jwwxrequst | 创建wx.request API 网络-发起请求 | jwwxclearStorage | 创建wx.clearStorage API(异步) 数据-缓存
    jwwxuploadFile | 创建wx.uploadFile API 网络-上传 | jwwxclearStorageSync | 创建wx.clearStorageSync API(同步) 数据-缓存
    jwwxdownloadFile | 创建wx.downloadFile API 网络-下载 | jwwxgetLocation | 创建wx.getLocation API 位置-获取
    jwwxwebSocket | 创建wx.webSocket API(全局唯一) 网络 | jwwxopenLocation | 创建wx.openLocation API 位置-查看
    jwwxchooseImage | 创建wx.chooseImage API 媒体-图片| jwwxgetNetworkType | 创建wx.getNetworkType API 设置-网络状态
    jwwxpreviewImage | 创建wx.previewImage API 媒体-图片 | jwwxgetSystemInfo | 创建wx.getSystemInfo API 设置-系统信息
    jwwxrecord | 创建wx.start&stop Record API 媒体-录音 | jwwxonAccelerometerChange | 创建wx.onAccelerometerChange API 设置-重力感应
    jwwxvoice | 创建wx.play&pause&stop Vioce API 媒体-音频播放控制 | jwwxonCompassChange | 创建wx.onCompassChange API 设置-罗盘
    jwwxaudio| 创建wx.get&play&pause&seek&stop Audio API 媒体-音乐播放控制 | jwwxsetNavigationBarTitle | 创建wx.setNavigationBarTitle API 界面-导航条
    jwwxsaveFile | 创建wx.saveFile API 媒体-文件 | jwwxnavigateTo | 创建wx.navigateTo API 界面-导航
    jwwxchooseVideo | 创建wx.chooseVideo API 媒体-视频 | jwwxredirectTo | 创建wx.redirectTo API 界面-导航
    jwwxsetStorage | 创建wx.setStorage API(异步) 数据-缓存 | jwwxnavigateBack | 创建wx.navigateBack API 界面-导航
    jwwxsetStorageSync | 创建wx.setStorageSync API(同步) 数据-缓存 | jwwxlogin | 创建wx.login API 登录
    jwwxgetStorage | 创建wx.getStorage API(异步) 数据-缓存| jwwxgetUserInfo | 创建wx.getUserInfo API 用户信息
    jwwxgetStorageSync | 创建wx.getStorageSync API(同步) 数据-缓存 | jwwxrequestPayment | 创建wx.requestPayment API 微信支付
    jwwxhideKeyboard | 创建wx.hideKeyboard API 界面-键盘 | jwwxstopPullDownRefresh | 创建wx.stopPullDownRefresh API 界面-刷新

    其他命令 | 命令说明 | 其他命令 | 命令说明
    ---|---|---|---
    jwapp | 创建App实例 | jwarray | 创建数组
    jwpage | 创建Page实例 | jwlog | 日志输出
    jwfunction | 创建普通方法 | jwsetData | 同步视图层数据
    jwevent | 创建事件方法 |  | 

    如果上述安装过程无误，效果应该如下所示：

    ![img](http://upload-images.jianshu.io/upload_images/2961518-46a377f66c376592.gif?imageMogr2/auto-orient/strip)

    如有疑问，可参照johnwang77大神的[github](https://github.com/johnwang77/JWSnippets-For-VSCode/blob/master/README.md)

4. **wept**
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
    wept
    ```

## **项目截图**
采用gulp和scss来管理微信小城序的代码，gulp会监听文件的变化刷新到页面上，把wxml改成html，把wxss改成scss，省的每次打开sublime都得改文件解析方式。
![1.png](//dn-cnode.qbox.me/FinpcvLksk3XCJ92L8cfBzkLtwjX)
![2.png](//dn-cnode.qbox.me/FibKjoWt5-EFiYLqts0_KQqzA_N2)
![3.png](//dn-cnode.qbox.me/FvkanLPAIUpdoYcZ4Wj1bIzcjDtU)
![5.png](//dn-cnode.qbox.me/FjoDRHkkvt-QAvgg9KxNn8N8V941)
![7.png](//dn-cnode.qbox.me/FlExqkfuLlDLCjV1nLL8iP835msr)
![8.png](//dn-cnode.qbox.me/FoPMe3PKCxQATog2D0EesE4Hb5HL) 