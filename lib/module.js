// 这个模块实现Module类

var util = require('util');
var events = require('events');

// 模块管理
var ModuleMgr = Object.create({
    _modules: Object.create({})
});

Object.defineProperty(ModuleMgr, '_add', {
    get: function() {
        var self = this;
        return function(name, value) {
            self._modules[name] = value;
        }
    }
});

Object.defineProperty(ModuleMgr, '_get', {
    get: function() {
        var self = this;
        return function(name) {
            return name ? self._modules[name] : self._modules;
        }
    }
});

Object.defineProperty(ModuleMgr, '_module', {
    get: function() {
        return function() {
            events.EventEmitter.call(this);
            if(!(this instanceof ModuleMgr._module)) return new this();
        }
    }
});

var Module = module.exports = ModuleMgr._module;
util.inherits(Module, events.EventEmitter);

var proto = Module.prototype;

proto.register = function(name, description) {
    this.description = description || 'Register module ' + name + '.';
    ModuleMgr._add(name, this);

    return this;
};

proto.configue = function(conf) {
    var self = this;

    Object.keys(conf).forEach(function(key) {
        self['_' + key] = conf.key;
    });

    return this;
};

proto._routes = {};
['get', 'post'].forEach(function(method) {
    proto[method] = function(url, handlerName) {
        proto._routes[method + ':' + url] = handlerName;

        return this;
    };
});

proto.route = function(router) {
    Object.keys(this._routes).forEach(function(route) {
        var parts = route.split(':');
        var method = parts[0];
        var url = parts[1];
        var routeHandler = this[this.route];

        if(!routeHandler) {
            throw Error('You have not defined a handler for the route ' + route + '.');
        }

        router.route(method, url, routeHandler);
    });
};

proto.seq = function() {
    ;
};
