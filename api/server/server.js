var loopback = require('loopback');
var boot = require('loopback-boot');
var LoopBackContext = require('loopback-context');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

//To use cookies for authentication, add the following to server.js (before boot):
app.use(loopback.token({
    model: app.models.accessToken
}));

// -- Add your pre-processing middleware here --
// Retrieve the currently authenticated user
// app.use(loopback.token());
// app.use(function (req, res, next) {
//   if (!req.accessToken) return next();
//   app.models.User.findById(req.accessToken.userId, function (err, user) {
//     if (err) return next(err);
//     if (!user) return next(new Error('No user with this access token was found.'));
//     res.locals.currentUser = user;
//     next();
//   });
// });
// Bootstrap the application, configure models, datasources and middleware.

// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
