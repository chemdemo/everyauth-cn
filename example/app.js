/**
 * social-oauth.
 * @Author: <yangdemo@gmail.com>
 */

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var swig = require('swig');

var everyauthCN = require('../index');
var app = express();

require('./auth-settings');

swig.setDefaults({autoescape: false, cache: false});

app
    .set('port', process.env.PORT || 3015)
    .engine('html', swig.renderFile)
    .set('view engine', 'html')
    .set('views', __dirname + '/views')
    .set('view cache', false)
    .use(logger())
    .use(express.static(__dirname + '/pub'))
    .use(bodyParser())
    .use(cookieParser('everyauth-cn'))
    .use(session({secret: 'everyauth-cn'}))
    .use(everyauthCN.middleware());

app.get('/', function(req, res, next) {
    res.render('index');
});

app.get('/user', function(req, res, next) {
    res.render('user', {sess: req.session});
});

app.use(handler404, errorHandler);

app.listen(app.get('port'), function() {
    console.log("Application listening on port %s in %s mode, pid: %s.",
        app.get('port'), app.settings.env, process.pid);
});

process.on('uncaughtException', function(err) {
    console.error('crached', err);
});

function handler404(req, res, next) {
    res.status(404).end('Page Not Found');
};

function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).end('server error');
};
