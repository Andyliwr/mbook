module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  // router.get('/', server.loopback.status());
  console.log(__dirname);
  router.use(server.loopback.static(__dirname.replace('/server/boot', '') + '/client'))
  server.use(router);
};
