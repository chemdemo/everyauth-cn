var path = require('path');
var fs = require('fs');
var everyauth = require('./node_modules/everyauth');

var files = fs.readdirSync(__dirname + '/lib/modules').filter(function(file) {return path.extname(file).match(/\.js/);});
var includes = files.map(function(fname) {return path.basename(fname, '.js');});

includes.forEach(function(name) {
    Object.defineProperty(everyauth, name, {
        get: (function(name) {
            return function() {
                var mod = this.modules[name] || (this.modules[name] = require('./lib/modules/' + name));
                if(!mod.everyauth) mod.everyauth = this;
                this.enabled[name] = mod;
                return mod;
            };
        })(name)
    });
});

var socialoauth = module.exports = everyauth;

// socialoauth.middleware = function(opts) {
//     var bak = everyauth.middleware;// function(req, res, next)
// };
