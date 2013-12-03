/**
 * social-oauth.
 * @Author: <yangdemo@gmail.com>
 */

var express = require('express');
var so = require('../index');
var app = express();

require('./auth-settings');

app
    .set('port', process.env.PORT || 3015)
    .use(express.static(__dirname + '/pub'))
    .use(express.logger('dev'))
    .use(express.bodyParser())
    .use(express.cookieParser('social_oauth'))
    .use(express.session())
    .use(so.middleware());

app.configure( function () {
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/views');
});

app.get('/', function(req, res, next) {
    res.render('home');
});

app.listen(app.get('port'), function() {
    console.log("Application listening on port %s in %s mode, pid: %s.", app.get('port'), app.settings.env, process.pid);
});
