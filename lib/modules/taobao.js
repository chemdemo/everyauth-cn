var oauthModule = require('./oauth2');
var url = require('url');
var qs = require('querystring');
var request = require('request');

var taobao = module.exports =
oauthModule.submodule('taobao')
    .configurable({
        state: '可选参数，维持应用的状态，传入值与返回值保持一致。',
        view: '可选参数，可选值有：web、tmall、wap，默认是web',
        role: '要授权的账号角色，用于定义要查询的是买家还是卖家。可选值是seller和buyer，默认是buyer',
        fields: '需要返回的字段，默认是user_id,uid,nick,sex，详细请查看淘宝开放平台说明'
    })

    .oauthHost('https://oauth.taobao.com')
    .apiHost('https://eco.taobao.com/')

    .customHeaders({'User-Agent': 'everyauth-taobao'})
    .customHeaders({'Content-Type': 'application/json; charset=utf-8'})

    .authPath('/authorize')
    .authQueryParam('response_type', 'code')

    .accessTokenPath('/token')
    .accessTokenParam('grant_type', 'authorization_code')

    .entryPath('/auth/taobao')
    .callbackPath('/auth/taobao/callback')

    .authCallbackDidErr( function (req) {
        var parsedUrl = url.parse(req.url, true);
        return parsedUrl.query && !!parsedUrl.query.error;
    })

    .fetchOAuthUser( function (accessToken) {
        var p = this.Promise();
        var url = this.apiHost() + '/router/rest';
        var root = this;

        this._role = this._role || 'buyer';

        url += '?access_token=' + accessToken;
        url += '&method=taobao.user.' + this._role + '.get';
        // 格式统一成json
        url += '&format=json';
        url += '&v=2.0';
        url += '&fields=' + (this._fields ? this._fields.split('\W+').join(',') : 'user_id,uid,nick,sex');
        request.get(url, function(err, res, body) {
            if (err) {
                err.extra = {res: res, data: body};
                return p.fail(err);
            }

            if (parseInt(res.statusCode/100, 10) !== 2) {
                return p.fail({extra: {data: body, res: res}});
            }

            p.fulfill(JSON.parse(body));
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
            var tbResponse = err.extra.res;
            var serverResponse = seqValues.res;

            serverResponse.writeHead(tbResponse.statusCode, tbResponse.headers);
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
