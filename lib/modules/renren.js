var oauthModule = require('./oauth2');
var url = require('url');

var renren = module.exports =
oauthModule.submodule('renren')
    .configurable({
        scope: '可选。若不传递此参数表示请求用户的默认权限。'
    })

    .oauthHost('https://graph.renren.com')
    .apiHost('https://graph.renren.com')

    .customHeaders({'User-Agent': 'everyauth-renren'})
    .customHeaders({'Content-Type': 'application/json; charset=utf-8'})

    .authPath('/oauth/authorize')
    .authQueryParam('response_type', 'code')

    .accessTokenPath('/oauth/token')
    .accessTokenParam('grant_type', 'authorization_code')

    .entryPath('/auth/renren')
    .callbackPath('/auth/renren/callback')

    .authQueryParam('scope', function () {
        return this._scope && this.scope();
    })

    .authCallbackDidErr( function (req) {
        var parsedUrl = url.parse(req.url, true);
        return parsedUrl.query && !!parsedUrl.query.error;
    })

    .handleAuthCallbackError( function (req, res) {
        var parsedUrl = url.parse(req.url, true),
            errorDesc = parsedUrl.query.error + "; " + parsedUrl.query.error_description;
        if (res.render) {
            res.render(__dirname + '/../views/auth-fail.jade', {
                errorDescription: errorDesc
            });
        } else {
            // TODO Replace this with a nice fallback
            throw new Error("You must configure handleAuthCallbackError if you are not using express");
        }
    })

    .fetchOAuthUser( function (accessToken) {console.log('renren token: ', accessToken);
        var p = this.Promise();
        this.oauth.get(this.apiHost() + '/v2/user/get', accessToken, function (err, data) {
            if (err) {
                console.log('Ren ren error: ', err);
                return p.fail(err);
            }
            var oauthUser = JSON.parse(data);
            p.fulfill(oauthUser);
        });
        return p;
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
