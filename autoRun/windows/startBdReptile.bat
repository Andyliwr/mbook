@echo off
set projectAddr=%1
echo is starting BaiduTieBa reptile...
cd %projectAddr%/reptile
If exist node_modules (
   echo node modules has been installed...
) Else (
   cnpm install
)
node networkReptile.js