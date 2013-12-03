var path = require('path');
var fs = require('fs');
var everyauth = require('./node_modules/everyauth');

var socialoauth = module.exports = everyauth;

var files = fs.readdirSync(__dirname + '/lib/modules');
var includes = files.filter(function(file) {return path.basename(file, '.js');});

includes.forEach(function(name) {
    Object.defineProperty(socialoauth, name, {
        get: function(name) {
            return function() {
                var mod = this.modules[name] || this.modules[name] = require('lib/modules/' + name);
                if(!mod.socialoauth) mod.socialoauth = this;
                if(mod.shouldSetup) {
                    this.enabled[name] = mod;
                }
                return mod;
            };
        }(name)
    });
});
