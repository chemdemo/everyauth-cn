# everyauth-cn

An `express` and `connect` middleware allows users to login via most of Chinese SNS sites with the same authorization work flow as [everyauth](https://github.com/bnoguchi/everyauth).

## Why everyauth-cn ?

The `everyauth` open source project is strong, it enables you to login via many of sites such google, facebook and youtobe. This proj is for Chinese users, it allows Chinese users to login via most of Chinese SNS sites. 

## Features list:

- So far, everyauth-cn enables you to login via: QQ, Tencent weibo, sina weibo, baidu, douban, renren.

- It dose also supports password to login.

## usage：

1. Register your account and app on the authorization sites, such as [qq connect](http://connect.qq.com) if you want to login via QQ, get your own appid and appSecret.

2. Make some configuration as the example app [does](https://github.com/chemdemo/everyauth-cn/blob/master/example/auth-settings.js).

3. Just copy any modules(such as google, facebook, twitter, github, etc) from [everyauth](https://github.com/bnoguchi/everyauth/tree/master/lib/modules) on demand because everyauth-cn uses and modifies everyauth's core authorization code.

## example:

[Click](http://oauth.dmfeel.com) to see the example app.

## Thanks

This project birth inseparable everyauth open source project and GitHub.

## License

MIT [http://rem.mit-license.org](http://rem.mit-license.org)
