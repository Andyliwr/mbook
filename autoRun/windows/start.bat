@echo off
echo 欢迎使用FollowHeart自动化工具，%username% ....
echo 使用之前请确保mongo和redis安装地址都已经加入到到了系统环境变量里
ECHO.
:: 公共参数设置 start
If %username% == Andyliwr (
  :: 记得改成ANDYLIWRTHS
  echo %computername%
  If %computername% == ANDYLIWRTHS ( 
     set projectAddr=C:\Users\Andyliwr\Documents\graduationDesign
     set mongoDbPath=D:\mongo\data
     set mongoLogPath=D:\mongo\log\mongo.log
     set mongoConfAddr=D:\mongo\mongod.conf
     set redisConfAddr=D:\redis\redis.windows.conf
  ) Else (
     set projectAddr=C:\Users\Andyliwr\Documents\graduationDesign
     set mongoDbPath=E:\mongo_install\data
     set mongoLogPath=E:\mongo_install\log\mongo.log
     set mongoConfAddr=E:\mongo_install\mongod.conf
     set redisConfAddr=E:\redis\redis.windows.conf
  )
) Else (
  If %username% == Greenovia (
     set projectAddr=G:\git项目\graduationDesign
     set mongoDbPath=F:\mongo\data
     set mongoLogPath=F:\mongo\log\mongo.log
     set mongoConfAddr=F:\mongo\mongod.conf
     set redisConfAddr=F:\redis\redis.windows.conf
  ) Else (
     echo 请使用文本编辑器打开start.bar手动配置地址：
     :: 请输入你当前的FollowHeart根目录地址:
     set projectAddr=xxx
     :: 请输入mongo数据存储地址(类似F:\mongo\data):
     set mongoDbPath=xxx
     :: 请输入mongo日志文件地址(类似F:\mongo\log\mongo.log):
     set mongoLogPath=xxx
     :: 请输入mongo配置文件的地址(类似F:\mongo\mongod.conf):
     set mongoConfAddr=xxx
     :: 请输入mongo配置文件的地址(类似F:\redis\redis.windows.conf):
     set redisConfAddr=xxx
  )
)
:: 公共参数设置 end
::清屏操作
rem cls
goto start
:start
    echo --------------------------------------------------
    echo --                FollowHeart部署               --
    echo --  1.启动mongo和redis                          --
    echo --  2.启动接口                                  --
    echo --  3.排行榜爬虫                                --
    echo --  4.百度贴吧榜爬虫                            --
    echo --  5.启动微信小城程序                          --
    echo --  6.新环境部署(该选项操作完成后会自动部署)    --
    echo --  7.END                                       --
    echo --------------------------------------------------
    ECHO.
    echo (请输入数字选择操作命令)
    set /p ans=                   
    if %ans%==1 goto startMongoAndRedis
    if %ans%==2 goto startApi
    if %ans%==3 goto startRankReptile
    if %ans%==4 goto startBdReptile
    if %ans%==5 goto startWechat
    if %ans%==6 goto deploy
    if %ans%==7 goto END
:startMongoAndRedis
    echo echo 正在启动redis和mongo...
    start "启动mongo和redis" startMongoAndRedis.bat %redisConfAddr% %mongoLogPath% %mongoDbPath%
    echo echo 已经启动redis和mongo...
    ECHO.
    ECHO.
    goto start
:startApi
    ECHO.
    echo 正在启动后端接口，请确保在启动接口之前已经执行过1了...
    start "启动后端接口" startApi.bat %projectAddr%
    echo 后端接口启动成功...
    ECHO.
    ECHO.
    goto start
:startBdReptile
    ECHO.
    echo 正在运行百度贴吧爬虫...
    start "启动百度贴吧爬虫" startBdReptile.bat %projectAddr%
    ECHO.
    ECHO.
    goto start
:startRankReptile
    ECHO.
    echo 正在运行排行榜爬虫...
    start "启动百度贴吧爬虫" startRankReptile.bat %projectAddr%
    ECHO.
    ECHO.
    goto start
:startWechat
    ECHO.
    echo 正在启动微信小程序...
   start "启动微信小程序" startWechat.bat %projectAddr%
    ECHO.
    ECHO.
    goto start
:deploy
    ECHO.
    echo ----执行static项目解压操作----
    :: 执行的逻辑命令--为bat文件传参
    start static.bat %uatPath% %sourcePath% %sourceDisk%
    echo ----static项目解压操作完成----
    goto start
:END
    ECHO.
    echo 退出批处理操作
pause