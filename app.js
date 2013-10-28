/**
 * social-oauth.
 * @Author: <yangdemo@gmail.com>
 */

var express = require('express')
  , routes = require('./routes')
  , everyauth = require('everyauth')
  , domain = require('domain');

require('./everyauth-settings');

var app = express();

app
  .set('port', process.env.PORT || 3000)
  // .use(express.static(__dirname + '/img'))
  .use(express.logger('dev'))
  .use(express.bodyParser())
  .use(express.methodOverride())
  .use(express.cookieParser('cooke_paser'))
  .use(express.session())
  .use(everyauth.middleware(app))
  .use(app.router)
  .configure('production', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

app.configure( function () {
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
});

/*app.use(function(req, res, next) {
  var d = domain.create();
  d.on('error', function(err) {
    logger(err);
    res.statusCode = 500;
    res.send(500, 'Server error.');
    d.dispose();
  });

  d.add(req);
  d.add(res);
  d.run(next);
});*/

routes(app);

function on404(req, res, next) {
    console.log(404, req.url);
    res.send(404, 'Page not found!');
}

function errorHandler(err, req, res, next) {
    console.error(err, err.status, err.stack);
    res.status(500);
    res.send(500, err);
}

app.use(on404);
app.use(errorHandler);

app.listen(app.get('port'), function() {
  console.log("Application listening on port %s in %s mode, pid: %s.", app.get('port'), app.settings.env, process.pid);
});
