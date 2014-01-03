## 关于everyauth-cn
[![Build Status](https://api.travis-ci.org/chemdemo/everyauth-cn.png)](http://travis-ci.org/chemdemo/everyauth-cn)
[![NPM version](https://badge.fury.io/js/everyauth-cn.png)](http://badge.fury.io/js/everyauth-cn)

在一些项目中需要用到社交账号连接的需求，github上找到了everyauth，everyauth已经做得很完善，只是没中国的SNS网站（废话……），本打算fork everyauth给它添加授权模块，在调试的时候发现国内的网站oauth流程很多地方很不规范，得改动everyauth授权核心代码，而后又担心会影响到everyauth已有模块的功能，所以有了everyauth-cn，授权模块复用everyauth，在此基础上做了修改和bug fix。

everyauth-cn作为express或者connect模块的中间件，统一封装了国内主流社交网站基于oauth2授权协议的授权登陆（server-side模式），使用方式和其他中间件一样，比如express这样用：`app.use(everyauth.middleware())`（前提是要做一些配置啦，比如appid什么的），最终拿到的用户信息保存一份在session中，还可以根据需要做存储。

## 特性:

- 目前已经实现国内以下站点（基于oauth2）的授权登陆以及拉取基本用户信息：腾讯QQ，腾讯微博，新浪微博，豆瓣，百度，人人，淘宝，根据实际需求配置使用

- 同时支持拥有自家账号体系的网站的用户注册和登陆（这部分复用everyauth）

## 安装：

    $ npm install everyauth-cn

## 使用：

1. 在想要授权的社交网站注册自己的网站（应用），获取相应的appId和appSecret，这个必须的啦，最后会得到一份配置（参考示例：[example/conf.js](https://github.com/chemdemo/everyauth-cn/blob/master/example/conf.js)），这里要提醒下，QQ互联、百度、新浪微博在注册app的时候需要验证网站，/pub/目录下有个bd_xxx.txt和/views/home.jade里面meta标签就是用来验证的

2. 参考[example/auth-settings.js](https://github.com/chemdemo/everyauth-cn/blob/master/example/auth-settings.js)配置各SNS站点的信息，这里以qq为例说明：

  `myHostname`：填项目主页地址

  `appId`：everyauth内部统一定义的变量，各个网站的名称可能不同，如新浪微博的叫`appKey`

  `appSecret`：同上

  `findOrCreateUser`：授权成功后，在后台数据库保存或更新用户信息，示例中只是简单地保存在内存里

  `redirectPath`：授权成功后重定向地址，默认都是跳回`myHostname`指定的地址

3. 自家账号登陆：只支持邮箱、手机号、用户名三种登陆方式（loginWith配置，值是email, phone, login中一种，其中邮箱和手机号有格式校验，login没有）

## 示例：

这里有个简单例子（获取到的用户信息存储在内存）：[example app](http://oauth.dmfeel.com)

## License

MIT [http://rem.mit-license.org](http://rem.mit-license.org)
