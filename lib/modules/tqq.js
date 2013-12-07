var oauthModule = require('./oauth2');
var url = require('url');
var qs = require('querystring');
var request = require('request');

var tqq = module.exports =
oauthModule.submodule('tqq')
    .configurable({
        // scope: '请求用户授权时向用户显示的可进行授权的列表，get_user_info,list_album,upload_pic,do_like'
    })

    .oauthHost('https://open.t.qq.com')
    .apiHost('https://open.t.qq.com')

    .authPath('/cgi-bin/oauth2/authorize')
    .authQueryParam('response_type', 'code')

    .accessTokenPath('/cgi-bin/oauth2/access_token')
    .accessTokenParam('grant_type', 'authorization_code')

    .entryPath('/auth/tqq')
    .callbackPath('/auth/tqq/callback')

    .customHeaders({'User-Agent': 'everyauth-tqq'})
    .customHeaders({'Content-Type': 'text/plain; charset=utf-8'})

    .authQueryParam('scope', function () {
        return this._scope && this.scope();
    })

    .authCallbackDidErr( function (req) {
        var parsedUrl = url.parse(req.url, true);
        return parsedUrl.query && !!parsedUrl.query.error;
    })

    .handleAuthCallbackError( function (req, res) {
        var parsedUrl = url.parse(req.url, true);
        var errorDesc = parsedUrl.query.error + "; " + parsedUrl.query.error_description;

        if (res.render) {
            res.render(__dirname + '/../views/auth-fail.jade', {errorDescription: errorDesc});
        } else {
            // TODO Replace this with a nice fallback
            throw new Error("You must configure handleAuthCallbackError if you are not using express");
        }
    })

    .fetchOAuthUser( function (accessToken) {
        // see http://wiki.open.t.qq.com/index.php/OAuth2.0%E9%89%B4%E6%9D%83#.E8.AF.B7.E6.B1.82.E5.8F.82.E6.95.B0.EF.BC.88.E5.85.AC.E5.85.B1.E9.83.A8.E5.88.86.EF.BC.89
        var p = this.Promise();
        this.oauth.get(this.apiHost() + '/api/user/info', accessToken, function (err, data) {
            if (err) return p.fail(err);
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
        var tqqResponse = err.extra.res;
        var serverResponse = seqValues.res;

        serverResponse.writeHead(tqqResponse.statusCode, tqqResponse.headers);
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
