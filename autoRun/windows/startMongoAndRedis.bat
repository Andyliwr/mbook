@echo off
echo echo ������redis...
set redisConfAddr=%1
set mongoLogPath=%2
set mongoDbPath=%3
redis-server.exe %redisConfAddr% --loglevel verbose
If errorlevel 1 (
    echo Redis�Ѿ��������µĴ�������redis-cli.exe������Ĺ����...
) Else (
    echo Redis��ʧ�ܣ����������õ�Ŀ¼�Ƿ���ȷ...
)
ECHO.
echo ������Mongo...
If %username% == andyl (
    cd D:/mongo/bin
    D:
    mongod.exe --logpath=%mongoLogPath% --dbpath=%mongoDbPath% --journal --maxConns 20000
) Else (
    mongod.exe --logpath=%mongoLogPath% --dbpath=%mongoDbPath% --journal --maxConns 20000
)
echo %errorlevel%
If errorlevel 1 (
    echo Mongo�Ѿ��������µĴ�������mongo������Ĺ����...
) Else (
    echo Mongo��ʧ�ܣ����������õ�Ŀ¼�Ƿ���ȷ...
)