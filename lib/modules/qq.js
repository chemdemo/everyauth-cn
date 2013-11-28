var oauthModule = require('./node_modules/everyauth/lib/modules/oauth2');
var url = require('url');

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

  .fetchOAuthUser( function (accessToken) {
    var p = this.Promise();
    this.oauth.get(this.apiHost() + '/user/get_user_info', accessToken, function (err, data) {
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
      var qqResponse = err.extra.res
        , serverResponse = seqValues.res;
      serverResponse.writeHead(
          qqResponse.statusCode
        , qqResponse.headers);
      serverResponse.end(err.extra.data);
    } else if (err.statusCode) {
      var serverResponse = seqValues.res;
      serverResponse.writeHead(err.statusCode);
      serverResponse.end(err.data);
    } else {
      console.error(err);
      throw new Error('Unsupported error type');
    }
  });
