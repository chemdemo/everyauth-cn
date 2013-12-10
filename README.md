# everyauth-cn [中文版](https://github.com/chemdemo/everyauth-cn/blob/master/README_zh.md)

An `express` or `connect` middleware which allows users to login via most of Chinese SNS sites with the same authorization work flow as [everyauth](https://github.com/bnoguchi/everyauth).

## Why everyauth-cn ?

The `everyauth` open source project is so excellent, it enables users to login via many of sites such as google, facebook and youtobe. It makes works so easy for developers because everyauth works as a middleware for expressjs(or connect) module, one can just use `app.use(everyauth.middleware())` to enables anyone to login his web sites and get user infomation from session, for more details please goto [everyauth](https://github.com/bnoguchi/everyauth).

This project aims connecting users to most of Chinese SNS sites. It reuse most of everyauth's core authorization code, thanks for everyauth open source project and GitHub!

## Features list:

- So far, everyauth-cn enables you to login via: QQ, Tencent weibo, sina weibo, baidu, douban, renren, it is server-side mode and uses oauth2 authorization work flow.

- It dose also supports password to login.

## usage：

1. Register your account and app on the authorization sites, such as [qq connect](http://connect.qq.com) if you want to login via QQ, get your own appid and appSecret.

2. Make some configuration as the example app [does](https://github.com/chemdemo/everyauth-cn/blob/master/example/auth-settings.js).

3. Just copy any modules(such as google, facebook, twitter, github, etc) from [everyauth](https://github.com/bnoguchi/everyauth/tree/master/lib/modules) as you need.

## example:

Click to see the [example app](http://oauth.dmfeel.com).

## License

MIT [http://rem.mit-license.org](http://rem.mit-license.org)
