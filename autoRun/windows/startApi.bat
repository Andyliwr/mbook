@echo off
set projectAddr=%1
echo is starting api...
cd %projectAddr%/api
If exist node_modules (
   echo "node modules has been installed..."
) Else (
    cnpm install
)
node server/server.js
If errorlevel 1 (
    echo api has been started, please open httt://localhost:3000/explorer in Chrome...
) Else (
    echo api started failed...
)