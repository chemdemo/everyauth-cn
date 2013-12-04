var path = require('path');
var fs = require('fs');
var everyauth = require('./node_modules/everyauth');

var socialoauth = module.exports = everyauth;

var files = fs.readdirSync(__dirname + '/lib/modules').filter(function(file) {return path.extname(file).match(/\.js/);});
var includes = files.map(function(fname) {return path.basename(fname, '.js');});

includes.forEach(function(name) {
    Object.defineProperty(socialoauth, name, {
        get: (function(name) {
            return function() {
                var mod = this.modules[name] || (this.modules[name] = require('./lib/modules/' + name));
                if(!mod.socialoauth) mod.socialoauth = this;
                this.enabled[name] = mod;
                return mod;
            };
        })(name)
    });
});

// socialoauth.middleware = function(opts) {
//     var bak = everyauth.middleware;// function(req, res, next)
// };
