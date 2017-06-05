@echo off
echo is starting redis...
set redisConfAddr=%1
set mongoLogPath=%2
set mongoDbPath=%3
redis-server.exe %redisConfAddr% --loglevel verbose
If errorlevel 1 (
    echo redis started success...
) Else (
    echo redis started failed...
)
ECHO.
echo is starting mongo...
If %username% == andyl (
    cd D:/mongo/bin
    D:
    mongod.exe --logpath=%mongoLogPath% --dbpath=%mongoDbPath% --journal --maxConns 20000
) Else (
    mongod.exe --logpath=%mongoLogPath% --dbpath=%mongoDbPath% --journal --maxConns 20000
)
echo %errorlevel%
If errorlevel 1 (
    echo mongo started success...
) Else (
    echo mongo started failed...
)