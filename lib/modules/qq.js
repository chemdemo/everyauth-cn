var oauth2 = require('../oauth2');

var qq = module.exports =
oauth2.register('qq')
    .configure({})

    .oauthHost()
    .apiHost('https://api.weibo.com')

    .customHeaders({'Content-Type': 'application/json; charset=utf-8'})
    .authPath('/oauth2/authorize')
    .accessTokenPath('/oauth2/access_token')

    .fetchUser()

    .AuthErr(fn)
    .moduleErr(fn);
