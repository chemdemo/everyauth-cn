var fs = require('fs');

module.exports = function route(app) {
	app.get('/', function(req, res, next) {
		res.render('home');
	});
}