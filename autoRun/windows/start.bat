@echo off
echo Welcome to use FollowHeart automated deployment tools, %username% ....
echo Before use, make sure that both the Mongo and redis installation addresses has been added to the system environment variable.
ECHO.
:: setting start
If %username% == Andyliwr (
  :: ANDYLIWRTHS, company PC
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
  IF %username% == andyl (
    set projectAddr=E:\graduationDesign
    set mongoDbPath=D:\mongo\data
    set mongoLogPath=D:\mongo\logs\mongodb.log
    set mongoConfAddr=D:\mongo\mongod.conf
    set redisConfAddr=D:\redis\redis.windows.conf
  ) Else (
    If %username% == Greenovia (
        set projectAddr=G:\git项目\graduationDesign
        set mongoDbPath=F:\mongo\data
        set mongoLogPath=F:\mongo\log\mongo.log
        set mongoConfAddr=F:\mongo\mongod.conf
        set redisConfAddr=F:\redis\redis.windows.conf
    ) Else (
        echo This computer has not been preset, please use edit the bat file...
        :: set project basic address:
        set projectAddr=xxx
        :: set project mongo data address(such as F:\mongo\data):
        set mongoDbPath=xxx
        :: set project mongo logger address(such as F:\mongo\log\mongo.log):
        set mongoLogPath=xxx
        :: set project mongo config file address(such as F:\mongo\mongod.conf):
        set mongoConfAddr=xxx
        :: set project redis config file address(such as F:\redis\redis.windows.conf):
        set redisConfAddr=xxx
    )
  )
  
)
:: end
:: display
rem cls
goto start
:start
    echo ------------------------------------------------
    echo --   FollowHeart Automated Deployment Tools   --
    echo --  1.Open redis and mongo                    --
    echo --  2.Open Api                                --
    echo --  3.Run rank reptile                        --
    echo --  4.Run BaiduTieBa reptile                  --
    echo --  5.Run wechat app                          --
    echo --  6.Automated Deploy                        --
    echo --  7.END                                     --
    echo ------------------------------------------------
    ECHO.
    echo (Please input the index of operation)
    set /p ans=                   
    if %ans%==1 goto startMongoAndRedis
    if %ans%==2 goto startApi
    if %ans%==3 goto startRankReptile
    if %ans%==4 goto startBdReptile
    if %ans%==5 goto startWechat
    if %ans%==6 goto deploy
    if %ans%==7 goto END
:startMongoAndRedis
    echo echo is starting redis and mongo...
    start "start redis and mongo" startMongoAndRedis.bat %redisConfAddr% %mongoLogPath% %mongoDbPath%
    echo echo redis and mongo has been started...
    ECHO.
    ECHO.
    goto start
:startApi
    ECHO.
    echo is starting api, please confirm operation1 has been run before you do this...
    start "start api" startApi.bat %projectAddr%
    echo api has been started....
    ECHO.
    ECHO.
    goto start
:startBdReptile
    ECHO.
    echo is starting BaiduTieBa reptile...
    start "start BaiduTieBa reptile" startBdReptile.bat %projectAddr%
    ECHO.
    ECHO.
    goto start
:startRankReptile
    ECHO.
    echo is starting rank reptile...
    start "start rank reptile" startRankReptile.bat %projectAddr%
    ECHO.
    ECHO.
    goto start
:startWechat
    ECHO.
    echo is starting wechat app...
   start "start wechat app" startWechat.bat %projectAddr%
    ECHO.
    ECHO.
    goto start
:deploy
    ECHO.
    start static.bat %uatPath% %sourcePath% %sourceDisk%
    goto start
:END
    ECHO.
    echo goodbye
pause