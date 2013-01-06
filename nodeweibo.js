var weibo = require('weibo');

// change appkey to yours

var appkey = '889186919';
var secret = 'f2cdd5163ad90065331458c8c44a060a';
var oauth_callback_url = 'http://weibo.com/zhouzhuoqian';
weibo.init('weibo', appkey, secret, oauth_callback_url);
var userId = "15880525883",
passwd = "wb*33043565";

var user = { 
    blogtype: 'weibo'  ,  
    username : userId , 
    passwd : passwd
};

var cursor = {count: 20};
weibo.public_timeline(user, cursor, function (err, statuses) {
  if (err) {
    console.error(err);
  } else {
    console.log(statuses);
  }
});