var everyauth = require('everyauth');
var conf = require('./conf');

everyauth.debug = true;
everyauth.everymodule.userPkey('uid');

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

var usersByVimeoId = {};
var usersByJustintvId = {};
var usersBy37signalsId = {};
var usersByTumblrName = {};
var usersByDropboxId = {};
var usersByFbId = {};
var usersByTwitId = {};
var usersByGhId = {};
var usersByInstagramId = {};
var usersByFoursquareId = {};
var usersByGowallaId = {};
var usersByLinkedinId = {};
var usersByGoogleId = {};
var usersByAngelListId = {};
var usersByYahooId = {};
var usersByGoogleHybridId = {};
var usersByReadabilityId = {};
var usersByBoxId = {};
var usersByOpenId = {};
var usersByDwollaId = {};
var usersByVkId = {};
var usersBySkyrockId = {};
var usersByEvernoteId = {};
var usersByAzureAcs = {};
var usersByTripIt = {};
var usersBy500pxId = {};
var usersBySoundCloudId = {};
var usersByMailchimpId = {};
var usersMailruId = {};
var usersByMendeleyId = {};
var usersByShopifyId = {};
var usersByStripeId = {};
var usersBySalesforceId = {};
var usersByLogin = {
  'brian@example.com': addUser({ login: 'brian@example.com', password: 'password'})
};

everyauth.everymodule
  .findUserById( function (id, callback) {
    callback(null, usersById[id]);
  });

everyauth
  .facebook
    .appId(conf.fb.appId)
    .appSecret(conf.fb.appSecret)
    .findOrCreateUser( function (session, accessToken, accessTokenExtra, fbUserMetadata) {
      return usersByFbId[fbUserMetadata.id] ||
        (usersByFbId[fbUserMetadata.id] = addUser('facebook', fbUserMetadata));
    })
    .redirectPath('/');

everyauth
  .twitter
    .consumerKey(conf.twit.consumerKey)
    .consumerSecret(conf.twit.consumerSecret)
    .findOrCreateUser( function (sess, accessToken, accessSecret, twitUser) {
      return usersByTwitId[twitUser.id] || (usersByTwitId[twitUser.id] = addUser('twitter', twitUser));
    })
    .redirectPath('/');

everyauth
  .password
    .loginWith('email')
    .getLoginPath('/login')
    .postLoginPath('/login')
    .loginView('login.jade')
//    .loginLocals({
//      title: 'Login'
//    })
//    .loginLocals(function (req, res) {
//      return {
//        title: 'Login'
//      }
//    })
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
//    .registerLocals({
//      title: 'Register'
//    })
//    .registerLocals(function (req, res) {
//      return {
//        title: 'Sync Register'
//      }
//    })
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

everyauth.github
  .myHostname('http://dmfeel.com:3000')
  .appId(conf.github.appId)
  .appSecret(conf.github.appSecret)
  .findOrCreateUser( function (sess, accessToken, accessTokenExtra, ghUser) {
      return usersByGhId[ghUser.id] || (usersByGhId[ghUser.id] = addUser('github', ghUser));
  })
  .redirectPath('/');

everyauth.google
  .myHostname('http://dmfeel.com:3000')
  .appId(conf.google.clientId)
  .appSecret(conf.google.clientSecret)
  .scope('https://www.googleapis.com/auth/userinfo.profile https://www.google.com/m8/feeds/')
  .findOrCreateUser( function (sess, accessToken, extra, googleUser) {
    googleUser.refreshToken = extra.refresh_token;
    googleUser.expiresIn = extra.expires_in;
    return usersByGoogleId[googleUser.id] || (usersByGoogleId[googleUser.id] = addUser('google', googleUser));
  })
  .redirectPath('/');

everyauth
  .dropbox
    .consumerKey(conf.dropbox.consumerKey)
    .consumerSecret(conf.dropbox.consumerSecret)
    .findOrCreateUser( function (sess, accessToken, accessSecret, dropboxUserMetadata) {
      return usersByDropboxId[dropboxUserMetadata.uid] ||
        (usersByDropboxId[dropboxUserMetadata.uid] = addUser('dropbox', dropboxUserMetadata));
    })
    .redirectPath('/')

everyauth.evernote
  .oauthHost(conf.evernote.oauthHost)
  .consumerKey(conf.evernote.consumerKey)
  .consumerSecret(conf.evernote.consumerSecret)
  .findOrCreateUser( function (sess, accessToken, accessTokenExtra, enUserMetadata) {
    return usersByEvernoteId[enUserMetadata.userId] || (usersByEvernoteId[enUserMetadata.userId] = addUser('evernote', enUserMetadata));
  })
  .redirectPath('/');
