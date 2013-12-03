var path = require('path');
var fs = require('fs');
var util = require('util');
var everyauth = require('./node_modules/everyauth');

var socialoauth = module.exports = {};

util.inherits(socialoauth, everyauth);

var files = fs.readdirSync(__dirname + '/lib/modules');
var includes = files.map(function(fname) {return path.basename(fname, '.js');});

includes.forEach(function(name) {
    Object.defineProperty(socialoauth, name, {
        get: (function(name) {
            return function() {
                var mod = this.modules[name] || this.modules[name] = require('lib/modules/' + name);
                if(!mod.socialoauth) mod.socialoauth = this;
                this.enabled[name] = mod;
                return mod;
            };
        })(name)
    });
});
