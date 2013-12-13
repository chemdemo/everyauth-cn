var oauthModule = require('./oauth2');
var url = require('url');
var qs = require('querystring');
var request = require('request');

var qq = module.exports =
oauthModule.submodule('qq')
    .configurable({
        scope: '请求用户授权时向用户显示的可进行授权的列表，get_user_info,list_album,upload_pic,do_like'
    })

    .oauthHost('https://graph.qq.com')
    .apiHost('https://graph.qq.com')

    .authPath('/oauth2.0/authorize')
    .authQueryParam('response_type', 'code')

    .accessTokenPath('/oauth2.0/token')
    .accessTokenParam('grant_type', 'authorization_code')

    .entryPath('/auth/qq')
    .callbackPath('/auth/qq/callback')

    .customHeaders({'User-Agent': 'everyauth-qq'})
    .customHeaders({'Content-Type': 'text/plain; charset=utf-8'})

    .authQueryParam('scope', function () {
        return this._scope && this.scope();
    })

    .authCallbackDidErr( function (req) {
        var parsedUrl = url.parse(req.url, true);
        return parsedUrl.query && !!parsedUrl.query.error;
    })

    .fetchOAuthUser( function (accessToken) {
        var p = this.Promise();
        var self = this;
        var callback = function(res) {return res;};
        var getInfo = function(obj) {
            var url = self.apiHost() + '/user/get_user_info?';
            var params = {
                access_token: accessToken,
                oauth_consumer_key: self._appId,
                openid: obj.openid
            };

            url += qs.stringify(params);
            request.get(url, function(err, res, body) {
                if (err) {
                    err.extra = {res: res, data: body};
                    return p.fail(err);
                }

                if (parseInt(res.statusCode/100, 10) !== 2) {
                    return p.fail({extra: {data: body, res: res}});
                }

                body = JSON.parse(body);
                body.openid = obj.openid;
                return p.fulfill(body);
            });
        };

        // get openid
        request.get(this.oauthHost() + '/oauth2.0/me?access_token=' + accessToken, function(err, res, body) {
            if(err) return p.fail(err);
            // qq返回的是jsonp, why??
            getInfo(eval(body));
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
            var qqResponse = err.extra.res;
            var serverResponse = seqValues.res;

            serverResponse.writeHead(qqResponse.statusCode, qqResponse.headers);
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
