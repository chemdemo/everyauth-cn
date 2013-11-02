var path = require('path');
var fs = require('fs');

var seq = require('node-seq');
var flow = require('flow');

// app.use(require('social-oauth')(conf))
var socialOAuth = module.exports = function(options) {
	var conf = options.conf || require(__dirname + '/lib/config-default');

	// TODO
	return function(req, res, next) {
		// This middleware must be set after connect.session
		if(!req.session) return next();
	}
};

function fetchUser(req, callback) {
	;
};

function setLocals(req, res, alias) {
	;
};
