/**
 * Created by Andyliwr on 2017/4/4.
 */
module.exports = function mountLoopBackExplorer(server) {
  var explorer;
  try {
    explorer = require('loopback-component-explorer');
  } catch(err) {
    // Print the message only when the app was started via `server.listen()`.
    // Do not print any message when the project is used as a component.
    server.once('started', function(baseUrl) {
      console.error(
        'Run `npm install loopback-component-explorer` to enable the LoopBack explorer'
      );
    });
    return;
  }
  //用户名 test 密码 123456
  server.use('/explorer', require('node-basicauth')({'admin': '123456' }));

  server.use('/explorer', explorer.routes(server, { basePath: server.get('restApiRoot') }));

  // server.once('started', function() {
  //   var baseUrl = server.get('url').replace(/\/$/, '');
  //   console.log('查看你的 REST API  %s%s', baseUrl, '/explorer');
  // });
};
