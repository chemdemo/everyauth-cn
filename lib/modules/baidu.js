var oauthModule = require('./oauth2');
var url = require('url');

var baidu = module.exports =
oauthModule.submodule('baidu')
    .configurable({
        scope: '非必须参数，以空格分隔的权限列表，若不传递此参数，代表请求用户的默认权限'
    })

    .oauthHost('https://openapi.baidu.com')
    .apiHost('https://openapi.baidu.com')

    .customHeaders({'User-Agent': 'everyauth-baidu'})
    .customHeaders({'Content-Type': 'application/json; charset=utf-8'})

    .authPath('/oauth/2.0/authorize')
    .authQueryParam('response_type', 'code')

    .accessTokenPath('/oauth/2.0/token')
    .accessTokenParam('grant_type', 'authorization_code')

    .entryPath('/auth/baidu')
    .callbackPath('/auth/baidu/callback')

    .authQueryParam('scope', function () {
        return this._scope && this.scope();
    })

    .authCallbackDidErr( function (req) {
        var parsedUrl = url.parse(req.url, true);
        return parsedUrl.query && !!parsedUrl.query.error;
    })

    .fetchOAuthUser( function (accessToken) {
        var p = this.Promise();
        this.oauth.get(this.apiHost() + '/rest/2.0/passport/users/getInfo', accessToken, function (err, data) {
            if (err) return p.fail(err);
            var oauthUser = JSON.parse(data);
            p.fulfill(oauthUser);
        });
        return p;
    })

    .handleAuthCallbackError(function(req, res) {
        var parsedUrl = url.parse(req.url, true);
        var errorDesc = parsedUrl.query.error + "; " + parsedUrl.query.error_description;

        // Remove the jade template dependent
        if(everyauth.debug) console.log(util.inspect(errorDesc, {colors: true, depth: null}));
        res.send(500, errorDesc);
    })

    .moduleErrback( function (err, seqValues) {
        if (err instanceof Error) {
            var next = seqValues.next;
            return next(err);
        } else if (err.extra) {
            var dbResponse = err.extra.res;
            var serverResponse = seqValues.res;

            serverResponse.writeHead(dbResponse.statusCode, dbResponse.headers);
            serverResponse.end(err.extra.data);
        } else if (err.statusCode) {
            var serverResponse = seqValues.res;

            serverResponse.writeHead(err.statusCode);
            serverResponse.end(err.data);
        } else {
            console.error(err);
            throw new Error('不支持的错误类型！');
        }
    });
