# everyauth-cn



## Why everyauth-cn ?


自己在一些项目中需要用到社交账号连接的需求，github上找到了everyauth，everyauth已经做得很完善，只是没中国的SNS网站（废话……），本打算fork everyauth给它添加授权模块，在调试的时候发现国内的网站oauth流程很多地方很不规范，得改动everyauth授权核心代码，而后又担心会影响到everyauth已有模块的功能，所以有了everyauth-cn，授权模块复用everyauth，在此基础上做了修改和bug fix。

## Feature list:

- 目前已经实现国内以下站点（基于oauth2）的授权登陆以及拉取基本用户信息：**QQ（qq）**, **腾讯微博（tqq）**，**新浪微博（weibo）**，**豆瓣（douban）**，**百度（baidu）**，**人人（renren）**，根据实际需求配置使用

- 同时支持拥有自家账号体系的网站的用户注册和登陆（这部分复用everyauth）

## example:

[oauth.dmfeel.com](http://oauth.dmfeel.com)

## usage：

1. 在想要授权的社交网站注册自己的网站（应用），获取相应的appId和appSecret，这个必须的啦，最后会得到一份配置（如：example/conf.js）

2. 参考`example/auth-settings.js`配置各SNS站点的信息，这里以qq为例说明：

  `myHostname`：填项目主页地址

  `appId`：everyauth内部统一定义的变量，各个网站的名称可能不同，如新浪微博的叫`appKey`

  `appSecret`：同上

  `findOrCreateUser`：授权成功后，在后台数据库保存或更新用户信息，示例中只是简单地保存在内存里

  `redirectPath`：授权成功后重定向地址，默认都是跳回`myHostname`指定的地址

3. 自家账号登陆：

## License

MIT [http://rem.mit-license.org](http://rem.mit-license.org)
