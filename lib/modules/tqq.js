var oauthModule = require('./oauth2');
var url = require('url');
var qs = require('querystring');
var request = require('request');

var tqq = module.exports =
oauthModule.submodule('tqq')
    .configurable({
        scope: '请求权限范围（默认“all”）'
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

    // rewrite getCode method
    .getCode(function(req, res, next) {
        var parsedUrl = url.parse(req.url, true);
        if (this._authCallbackDidErr(req)) {
            return this.breakTo('authCallbackErrorSteps', req, res, next);
        }
        if (!parsedUrl.query || !parsedUrl.query.code) {
            console.error("Missing code in querystring. The url looks like " + req.url);
        }
        // 腾讯微博在获取用户info的时候需要openid和clientip参数
        tqq.openid = parsedUrl.query.openid;
        tqq.clientip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        return parsedUrl.query && parsedUrl.query.code;
    })

    .authCallbackDidErr( function (req) {
        var parsedUrl = url.parse(req.url, true);
        return parsedUrl.query && !!parsedUrl.query.error;
    })

    .fetchOAuthUser( function (accessToken) {
        // see http://wiki.open.t.qq.com/index.php/OAuth2.0%E9%89%B4%E6%9D%83#.E8.AF.B7.E6.B1.82.E5.8F.82.E6.95.B0.EF.BC.88.E5.85.AC.E5.85.B1.E9.83.A8.E5.88.86.EF.BC.89
        var p = this.Promise();
        var url = this.apiHost() + '/api/user/info';
        var params = {
            access_token: accessToken,
            oauth_consumer_key: this._appId,
            openid: tqq.openid,
            clientip: tqq.clientip,
            oauth_version: '2.a',
            scope: this._scope && this.scope() || 'all'
        };

        request.get(url + '?' + qs.stringify(params), function(err, res, body) {
            delete tqq.openid;
            delete tqq.clientip;

            if (err) {
                err.extra = {res: res, data: body};
                return p.fail(err);
            }

            if (parseInt(res.statusCode/100, 10) !== 2) {
                return p.fail({extra: {data: body, res: res}});
            }

            return p.fulfill(JSON.parse(body));
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
