var path = require('path');
var fs = require('fs');
var everyauth = require('everyauth');

var socialauth = module.exports = everyauth;

var files = fs.readdirSync(__dirname + '/lib/modules');
var includes = files.filter(function(file) {return path.basename(fname, '.js');});

includes.forEach(function(name) {
    Object.defineProperty(socialauth, name, {
        get: function(name) {
            return function() {
                var mod = this.modules[name] || this.modules[name] = require('lib/modules/' + name);
                if(!mod.socialauth) mod.socialauth = this;
                if(mod.shouldSetup) {
                    this.enabled[name] = mod;
                }
                return mod;
            };
        }(name)
    });
});
