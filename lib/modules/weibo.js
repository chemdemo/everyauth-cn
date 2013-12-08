var oauthModule = require('./oauth2');
var url = require('url');
var qs = require('querystring');
var request = require('request');

var weibo = module.exports =
oauthModule.submodule('weibo')
    .configurable({
        scope: '请求用户授权时向用户显示的可进行授权的列表，比如：email，direct_messages_write等，\
        开发者需要先在应用控制台的接口管理中申请到相关的接口，才能使用scope功能'
    })

    .oauthHost('https://api.weibo.com')
    .apiHost('https://api.weibo.com')

    .customHeaders({'User-Agent': 'everyauth-weibo'})
    .customHeaders({'Content-Type': 'application/json; charset=utf-8'})

    .authPath('/oauth2/authorize')
    .authQueryParam('response_type', 'code')

    .accessTokenPath('/oauth2/access_token')
    .accessTokenParam('grant_type', 'authorization_code')

    .entryPath('/auth/weibo')
    .callbackPath('/auth/weibo/callback')

    .authQueryParam('scope', function () {
        return this._scope && this.scope();
    })

    .authCallbackDidErr( function (req) {
        var parsedUrl = url.parse(req.url, true);
        return parsedUrl.query && !!parsedUrl.query.error;
    })

    .fetchOAuthUser( function (accessToken) {
        var p = this.Promise();
        // 给node-oauth包提交了post方法，就看作者买不买单咯
        // this.oauth.post(this.apiHost() + '/oauth2/get_token_info', accessToken, function (err, data) {
        //     if (err) return p.fail(err);
        //     var oauthUser = JSON.parse(data);
        //     p.fulfill(oauthUser);
        // });
        var url = this.apiHost() + '/oauth2/get_token_info';
        url += '?access_token=' + accessToken;
        request.post(url, function(err, res, body) {
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
            var wbResponse = err.extra.res;
            var serverResponse = seqValues.res;

            serverResponse.writeHead(wbResponse.statusCode, wbResponse.headers);
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
