/**
 * social-oauth.
 * @Author: <yangdemo@gmail.com>
 */

var express = require('express');
var swig = require('swig');
var everyauthCN = require('../index');
var app = express();

require('./auth-settings');

app
    .set('port', process.env.PORT || 3015)
    .use(express.static(__dirname + '/pub'))
    .use(express.logger('dev'))
    .use(express.bodyParser())
    .use(express.cookieParser('everyauth_cn'))
    .use(express.session())
    .use(everyauthCN.middleware());

app.configure( function () {
    app.engine('html', swig.renderFile);
    app.set('view engine', 'html');
    app.set('views', __dirname + '/views');
    // app.set('view cache', false);
    // swig.setDefaults({ cache: false });
});

app.get('/', function(req, res, next) {
    res.render('index');
});

app.listen(app.get('port'), function() {
    console.log("Application listening on port %s in %s mode, pid: %s.", app.get('port'), app.settings.env, process.pid);
});
