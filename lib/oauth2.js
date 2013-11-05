// 这个模块实现OAuth2类，比如授权、获取access_token等，继承自SubModule类
var util = require('util');
var request = require('request');
// var seq = require('node-seq');
// var Module = require('./module');

/*var OAuth2 = module.exports = function() {
    Module.prototype.call(this);
    if(!(this instanceof Module)) return new Module();
};
util.inherits(OAuth2, Module);

var proto = OAuth2.prototype;

proto.authorize = function(emitFlag) {
    https.request(this.oauthUrl, options, );
}

proto.accessToken = function(emitFlag) {
    ;
};

proto.getUser = function(emitFlag) {
    ;
};*/

require('./module')
    .config({})
    .get('entryPath')
        .then('getAuthUri')
        .then('requestAuthUri')
        .err('pathError')
    .get('callbackPath')
        .then('getCode')
        .then('getAccessToken')
        .then('fetchOAuthUser')
        .then('sendResponse')
        .err('callbackError')
    .getAuthUri(fn)
    .requestAuthUri(fn)
    .flow('requestAuth', 'callbackPath') // .flow(['entryPath', 'callbackPath'])
    ;
