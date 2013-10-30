var connect = require('connect');
var http = require('http');

var server = http.Server();
server.on('request', function(req, res) {
	console.log(req.url);
	res.end('e2e2');
});
server.listen(5000);

var app = connect()
	.use(connect.logger('dev'))
	.use(connect.vhost('xo.qq.com', server))

http.createServer(app).listen(5001);
