var path = require('path');
var fs = require('fs');
var everyauth = require('./node_modules/everyauth');

// var socialoauth = module.exports = everyauth;

var files = fs.readdirSync(__dirname + '/lib/modules');
var includes = files.filter(function(file) {return path.basename(file, '.js');});

includes.forEach(function(name) {
    Object.defineProperty(everyauth, name, {
        get: (function(name) {
            return function() {
                var mod = everyauth.modules[name] || everyauth.modules[name] = require('lib/modules/' + name);
                if(!mod.everyauth) mod.everyauth = everyauth;
                if(mod.shouldSetup) {
                    everyauth.enabled[name] = mod;
                }
                return mod;
            };
        })(name)
    });
});

module.exports = everyauth;
