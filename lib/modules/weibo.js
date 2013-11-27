var oauthModule = require('./oauth2'),
    url = require('url');

var weibo = module.exports =
oauthModule.submodule('weibo')
  .configurable({
      scope: 'specify types of access: (no scope), user, public_repo, repo, gist'
  })

  .oauthHost('https://api.weibo.com')
  .apiHost('https://api.weibo.com')

  .customHeaders({'User-Agent': 'everyauth-weibo'})
  .customHeaders({'Content-Type': 'application/json; charset=utf-8'})

  .authPath('/oauth2/authorize')
  .accessTokenPath('/oauth2/access_token')

  .entryPath('/auth/weibo')
  .callbackPath('/auth/weibo/callback')

  // .customHeaders({'User-Agent': 'everyauth-weibo'})

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
    this.oauth.post(this.apiHost() + '/oauth2/get_token_info', accessToken, function (err, data) {
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
      var ghResponse = err.extra.res
        , serverResponse = seqValues.res;
      serverResponse.writeHead(
          ghResponse.statusCode
        , ghResponse.headers);
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
