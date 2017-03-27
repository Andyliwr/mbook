@echo off
echo echo 正在启动redis...
set redisConfAddr=%1
set mongoLogPath=%2
set mongoDbPath=%3
redis-server.exe %redisConfAddr% --loglevel verbose
If errorlevel 1 (
    echo Redis已经启动，请打开新的窗口输入redis-cli.exe开启你的管理吧...
) Else (
    echo Redis启动失败，请检查你配置的目录是否正确...
)
ECHO.
echo 正在启动Mongo...
mongod.exe --logpath=%mongoLogPath% --dbpath=%mongoDbPath% --journal --maxConns 20000
echo %errorlevel%
If errorlevel 1 (
    echo Mongo已经启动，请打开新的窗口输入mongo开启你的管理吧...
) Else (
    echo Mongo启动失败，请检查你配置的目录是否正确...
)