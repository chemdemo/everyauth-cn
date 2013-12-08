var oauthModule = require('./oauth2');
var url = require('url');
var request = require('request');

var douban = module.exports =
oauthModule.submodule('douban')
    .configurable({
        scope: '申请权限的范围，比如：shuo_basic_r,shuo_basic_w,douban_basic_common等'
    })

    .oauthHost('https://www.douban.com')
    .apiHost('https://api.douban.com')

    .customHeaders({'User-Agent': 'everyauth-douban'})
    .customHeaders({'Content-Type': 'application/json; charset=utf-8'})

    .authPath('/service/auth2/auth')
    .authQueryParam('response_type', 'code')

    .postAccessTokenParamsVia('data')
    .accessTokenParam('grant_type', 'authorization_code')
    .accessTokenPath('/service/auth2/token')

    .entryPath('/auth/douban')
    .callbackPath('/auth/douban/callback')

    .authQueryParam('scope', function () {
        return this._scope && this.scope();
    })

    .authCallbackDidErr( function (req) {
        var parsedUrl = url.parse(req.url, true);
        return parsedUrl.query && !!parsedUrl.query.error;
    })

    .fetchOAuthUser( function (accessToken) {
        var promise = this.Promise();

        request.get({
            url: this.apiHost() + '/v2/user/~me'
            , headers: { Authorization: 'Bearer ' + accessToken }
        }, function (err, res, body) {
            if (err) {
                err.extra = {res: res, data: body};
                return promise.fail(err);
            }
            if (parseInt(res.statusCode/100, 10) !== 2) {
                return promise.fail({extra: {data: body, res: res}});
            }
            var oauthUser = JSON.parse(body);
            return promise.fulfill(oauthUser);
        });
        return promise;
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
            var dbResponse = err.extra.res
                , serverResponse = seqValues.res;

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
