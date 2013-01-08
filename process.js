var multiparter = require("multiparter");
var https = require('https');
var weiboUser = require('./weiboUser');
var utils = require('./utils');
var commentModel = require('./commentModel');
require(__dirname+'/'+'userSchema');
require(__dirname+'/'+'GuimiSchema');
require(__dirname+'/'+'CommentSchema');

var mongoose = require('mongoose');
var dblocation =  'mongodb://localhost/peepweibo';
var targetUID = 1804832854;
// var targetUID = 1769461117;
// var targetUID = 1304252912; // vivi cola
// var targetUID = 1304253723 // xiaotianxin
// var access_token='2.00fEivnB87waEE37a37fc7ea0JsOjD' ; 
var access_token = '2.00fEivnB0VIwKyd80a7ee6cb0Vk1av';
var weiboUsers = [];
var targetUser;
mongoose.connect(dblocation);
UserSchema = mongoose.model('UserSchema');
GuimiSchema = mongoose.model('GuimiSchema');
CommentSchema = mongoose.model('CommentSchema');

function getWeiboMethod(requrl , callback){
  var https = require('https');
  var options =  {
      host: 'api.weibo.com',
      path: requrl + '&access_token=' + access_token ,
      method: "GET"
  };
  // console.log(options);
  var requestWeibo = new multiparter.request(https,options);
  requestWeibo.send(callback);
}

function getUserTimelineById(uid, count, callback){
	
  count = (count < 10 ? 10 : count);
  var reqUrl = '/statuses/user_timeline.json?uid=' + uid + '&count=' + count;
  getWeiboMethod( reqUrl, function(error, response) {
      if (error) {
        console.log('requestWeibo', error);
        return;
      }
      response.setEncoding('utf8');
      var chunkData = '';
      response.on('data', function (chunk) {
          chunkData+=chunk;
      });
      response.on('end', function () {
        console.log('end');
        var data = JSON.parse(chunkData);
        callback(data);
      });
  });
}

getUserTimelineById(targetUID , 10, function(data_1){
	console.log(data_1.statuses[0].id);
});








