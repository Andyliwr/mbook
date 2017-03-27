@echo off
set projectAddr=%1
echo 正在启动后端接口，请确保在启动接口之前已经执行过1了...
cd %projectAddr%/api
If exist node_modules (
   echo "node包已安装..."
) Else (
    cnpm install
)
node .
If errorlevel 1 (
    echo 后端接口已经启动，请在浏览器中打开localhost:3000/explorer来查看吧...
) Else (
    echo 后端接口启动失败...
)