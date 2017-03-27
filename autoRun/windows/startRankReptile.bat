@echo off
set projectAddr=%1
echo 正在运行排行榜爬虫...
cd %projectAddr%/reptile
If exist node_modules (
   echo node包已安装...
) Else (
   cnpm install
)
node rankReptile.js