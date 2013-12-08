var everyauth = require('../index');
var conf = require('./conf');
var util = require('util');

// 开启debug
everyauth.debug = true;

var usersById = {};
var nextUserId = 0;

function addUser (source, sourceUser) {
  var user;
  if (arguments.length === 1) { // password-based
    user = sourceUser = source;
    user.id = ++nextUserId;
    return usersById[nextUserId] = user;
  } else { // non-password-based
    user = usersById[++nextUserId] = {id: nextUserId};
    user[source] = sourceUser;
  }
  return user;
}

var usersByQQId = {};
var usersByWeiboId = {};
var usersByWeiboId = {};
var usersByBaiduId = {};
var usersByDoubanId = {};
var usersByRenrenId = {};
var usersByTqqId = {};
// var usersByGhId = {};
var usersByLogin = {
  'demo@example.com': addUser({ login: 'demo@example.com', password: 'pass'})
};

everyauth.everymodule
  //使用uid代替id作为获取到的userid
  .userPkey('uid')
  // 根据id查找用户，这里只做演示简单地保存在局部变量里，实际项目里应该去查询db
  .findUserById( function (id, callback) {
    callback(null, usersById[id]);
  });

everyauth
  .qq
    .myHostname('http://oauth.dmfeel.com')
    .appId(conf.qq.appId)
    .appSecret(conf.qq.appKey)
    .findOrCreateUser( function (session, accessToken, accessTokenExtra, qqUserMetadata) {
      return usersByQQId[qqUserMetadata.id] ||
        (usersByQQId[qqUserMetadata.id] = addUser('qq', qqUserMetadata));
    })
    .redirectPath('/');

everyauth
  .weibo
    .myHostname('http://oauth.dmfeel.com')
    .appId(conf.weibo.appKey)
    .appSecret(conf.weibo.appSecret)
    .findOrCreateUser( function (session, accessToken, accessTokenExtra, weiboUserMetadata) {
      return usersByWeiboId[weiboUserMetadata.id] ||
        (usersByWeiboId[weiboUserMetadata.id] = addUser('weibo', weiboUserMetadata));
    })
    .redirectPath('/');

everyauth
  .baidu
    .myHostname('http://oauth.dmfeel.com')
    .appId(conf.baidu.apiKey)
    .appSecret(conf.baidu.appSecret)
    .findOrCreateUser( function (session, accessToken, accessTokenExtra, baiduUserMetadata) {
      return usersByBaiduId[baiduUserMetadata.id] ||
        (usersByBaiduId[baiduUserMetadata.id] = addUser('baidu', baiduUserMetadata));
    })
    .redirectPath('/');

everyauth
  .douban
    .myHostname('http://oauth.dmfeel.com')
    .appId(conf.douban.apiKey)
    .appSecret(conf.douban.Secret)
    .findOrCreateUser( function (session, accessToken, accessTokenExtra, doubanUserMetadata) {
      return usersByDoubanId[doubanUserMetadata.id] ||
        (usersByDoubanId[doubanUserMetadata.id] = addUser('douban', doubanUserMetadata));
    })
    .redirectPath('/');

everyauth
  .renren
    .myHostname('http://oauth.dmfeel.com')
    .appId(conf.renren.appKey)
    .appSecret(conf.renren.appSecret)
    .findOrCreateUser( function (session, accessToken, accessTokenExtra, renrenUserMetadata) {
      return usersByRenrenId[renrenUserMetadata.id] ||
        (usersByRenrenId[renrenUserMetadata.id] = addUser('renren', renrenUserMetadata));
    })
    .redirectPath('/');

everyauth
  .tqq
    .myHostname('http://oauth.dmfeel.com')
    .appId(conf.tqq.appKey)
    .appSecret(conf.tqq.appSecret)
    .findOrCreateUser( function (session, accessToken, accessTokenExtra, tqqUserMetadata) {
      return usersByTqqId[tqqUserMetadata.id] ||
        (usersByTqqId[tqqUserMetadata.id] = addUser('tqq', tqqUserMetadata));
    })
    .redirectPath('/');

// everyauth.github
//   .myHostname('http://oauth.dmfeel.com')
//   .appId(conf.github.appId)
//   .appSecret(conf.github.appSecret)
//   .findOrCreateUser( function (sess, accessToken, accessTokenExtra, ghUser) {
//       return usersByGhId[ghUser.id] || (usersByGhId[ghUser.id] = addUser('github', ghUser));
//   })
//   .redirectPath('/');

everyauth
  .password
    .loginWith('email')
    .getLoginPath('/login')
    .postLoginPath('/login')
    .loginView('login.jade')
    .loginLocals( function (req, res, done) {
      setTimeout( function () {
        done(null, {
          title: 'Async login'
        });
      }, 200);
    })
    .authenticate( function (login, password) {
      var errors = [];
      if (!login) errors.push('Missing login');
      if (!password) errors.push('Missing password');
      if (errors.length) return errors;
      var user = usersByLogin[login];
      if (!user) return ['Login failed'];
      if (user.password !== password) return ['Login failed'];
      return user;
    })
    .getRegisterPath('/register')
    .postRegisterPath('/register')
    .registerView('register.jade')
    .registerLocals( function (req, res, done) {
      setTimeout( function () {
        done(null, {
          title: 'Async Register'
        });
      }, 200);
    })
    .validateRegistration( function (newUserAttrs, errors) {
      var login = newUserAttrs.login;
      if (usersByLogin[login]) errors.push('Login already taken');
      return errors;
    })
    .registerUser( function (newUserAttrs) {
      var login = newUserAttrs[this.loginKey()];
      return usersByLogin[login] = addUser(newUserAttrs);
    })
    .loginSuccessRedirect('/')
    .registerSuccessRedirect('/');
