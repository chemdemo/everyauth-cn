// copy from socialoauth

var path = require('path');
var EventEmitter = require('events').EventEmitter;
var connect = require('connect');
var express = require('express');
var ExpressRouter = require('express/lib/router');
var __pause = connect.utils.pause;
var merge = function() {
    var to = {};
    for (var i = 0, l = arguments.length, from, k; i < l; i++) {
        from = arguments[i];
        for (k in from) {
            to[k] = from[k];
        }
    }
    return to;
};

var socialoauth = module.exports = {};

socialoauth.helpExpress = function () {
    console.warn('socialoauth.helpExpress is being deprecated. helpExpress is now automatically invoked when it detects express. So remove socialoauth.helpExpress from your code');
    return this;
};

socialoauth.debug = false;

socialoauth.middleware = function (opts) {
    opts = merge({autoSetupRoutes: true}, opts);

    var userAlias = socialoauth.expressHelperUserAlias || 'user';
    var router = new ExpressRouter;

    if (opts.autoSetupRoutes) {
        var router = new ExpressRouter();
        var modules = socialoauth.enabled;
        for (var _name in modules) {
            var _module = modules[_name];
            _module.validateSequences();
            _module.routeApp(router);
        }
    }

    return function (req, res, next) {
        fetchUserFromSession(req, function (err) {
            addRequestLocals(req, res, userAlias);
            registerReqGettersAndMethods(req);
            if (router) {
                router._dispatch(req, res, next);
            } else {
                next();
            }
        });
    }
};

function addRequestLocals (req, res, userAlias) {
    if (res.locals) {
        var session = req.session;
        var auth = session && session.auth;
        var socialoauthLocal = merge(auth, {
            loggedIn: !! (auth && auth.loggedIn)
            , user: req.user
        });

        if (socialoauth.enabled.password) {
            // Add in access to loginFormFieldName() + passwordFormFieldName()
            socialoauthLocal.password || (socialoauthLocal.password = {});
            socialoauthLocal.password.loginFormFieldName = socialoauth.password.loginFormFieldName();
            socialoauthLocal.password.passwordFormFieldName = socialoauth.password.passwordFormFieldName();
        }

        res.locals.socialoauth = socialoauthLocal;
        res.locals[userAlias] = req.user;
    }
}

function registerReqGettersAndMethods (req) {
    var methods = socialoauth._req._methods
    var getters = socialoauth._req._getters;

    for (var name in methods) {
        req[name] = methods[name];
    }

    for (name in getters) {
        Object.defineProperty(req, name, {
            get: getters[name]
        });
    }
}

function fetchUserFromSession (req, callback) {
    var session = req.session
    var auth = session && session.auth;
    if (!auth || !auth.userId) return callback();
    var everymodule = socialoauth.everymodule;
    var pause = __pause(req);

    var findUserById_function = everymodule.findUserById();

    findUserById_function.length === 3
    ? findUserById_function( req, auth.userId, findUserById_callback )
    : findUserById_function(      auth.userId, findUserById_callback );

    function findUserById_callback (err, user) {
        if (err) {
            pause.resume();
            return callback(err);
        }

        if (user) req.user = user;
        else delete session.auth;

        callback();
        pause.resume();
    }
}

socialoauth._req = {
    _methods: {}
    , _getters: {}
};

socialoauth.addRequestMethod = function (name, fn) {
    this._req._methods[name] = fn;
    return this;
};

socialoauth.addRequestGetter = function (name, fn, isAsync) {
    this._req._getters[name] = fn;
    return this;
};

socialoauth
    .addRequestMethod('logout', function () {
        var req = this;
        delete req.session.auth;
    })
    .addRequestGetter('loggedIn', function () {
        var req = this;
        return !!(req.session && req.session.auth && req.session.auth.loggedIn);
    });

socialoauth.modules = {};
socialoauth.enabled = {};

var fs = require('fs');
var files = fs.readdirSync(__dirname + '/lib/modules');
var includeModules = files.map( function (fname) {
    return path.basename(fname, '.js');
});

for (var i = 0, l = includeModules.length; i < l; i++) {
    var name = includeModules[i];

    Object.defineProperty(socialoauth, name, {
        get: (function (name) {
            return function () {
                var mod = this.modules[name] || (this.modules[name] = require('./lib/modules/' + name));
                // Make `socialoauth` accessible from each auth strategy module
                if (!mod.socialoauth) mod.socialoauth = this;
                if (mod.shouldSetup)
                this.enabled[name] = mod;
                return mod;
            }
        })(name)
    });
};
