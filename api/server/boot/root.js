module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  // router.get('/', server.loopback.status());
  console.log(__dirname);
  // judge is windows or linux
  var windowsPathReg = new RegExp('[A-Za-z][:]', 'igm');
  if(windowsPathReg.test(__dirname)){
    router.use(server.loopback.static(__dirname.replace('\\server\\boot', '') + '\\client'))
  }else{
    router.use(server.loopback.static(__dirname.replace('/server/boot', '') + '/client'))
  }
  server.use(router);
};
