var http = require('http');
var multiparter = require("multiparter");
var querystring = require('querystring'),
crypto = require('crypto'),
https = require('https'),
URL = require('url'),
path = require('path'),
fs = require('fs');

var commentSchema = require('./commentSchema');
var targetUID = 1804832854;
// var targetUID = 1769461117;
// var targetUID = 1304252912; // vivi cola
// var targetUID = 1304253723 // xiaotianxin
// var access_token='2.00fEivnB87waEE37a37fc7ea0JsOjD' ; 
var access_token = '2.00fEivnB0VIwKyd80a7ee6cb0Vk1av';
var weiboUsers = [];
var targetScreenName;


function BubbleSort(array) {
  length = array.length;
  for(i=0; i<=length-2; i++) {
    for(j=length-1; j>=1; j--) {
      //对两个元素进行交换
      if(array[j].count > array[j-1].count) {
        temp = array[j];
        array[j] = array[j-1];
        array[j-1] = temp;
      }
    }
  }
}

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

function getWeiboByScreenName(screen_name, callback){
  var requrl = '/statuses/user_timeline.json?screen_name=' + screen_name + '&count=10';
  getWeiboMethod( requrl, function(error, response) {
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
        // console.log('BODY: ' + chunk);
        var data = JSON.parse(chunkData);
        var statuses = data.statuses;
        for(var i  = 0 ; i < statuses.length ;  i++){
          console.log(statuses[i].text);
        }
      });
  });
}

function friends_ids(uid){
  var requrl = '/friendships/friends/ids.json?uid=' + uid ;
  getWeiboMethod( requrl, function(error, response) {
      if (error) {
        console.log('requestWeibo', error);
        return;
      }
        // console.log('STATUS: ' + response.statusCode);
        // console.log('HEADERS: ' + JSON.stringify(response.headers));
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
          console.log('BODY: ' + chunk);
          var data = JSON.parse(chunk);
          // console.log(data.total_number);
          var uidsLength = data.total_number;
          var mutualFriends = [];
          for(var i = 0 ; i < uidsLength ;i++){
            var friendId = data.ids[i];
            checkIsFriend(friendId, uid, function (isFriend){
              console.log(isFriend);
              mutualFriends.push(friendId);
            });
          }
      });
  });
}

function checkIsFriend(uid, target, callback){
  var requrl = '/friendships/friends/ids.json?uid=' + uid ;
  getWeiboMethod( requrl, function(error, response) {
      if (error) {
        console.log('requestWeibo', error);
        return;
      }
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
          var data = JSON.parse(chunk);
          var uidsLength = data.ids.length;
          for(var i = 0 ;  i < uidsLength ;i++){
            // console.log(target + ', ' + data.ids[i]);
            if (target == data.ids[i]) {
              callback(true);
              return;
            };
          }
          callback(false);
      });
  });
}
function printTheirConversation(theriConver){


}

function searchTheirConversation(data, guimiUID, callback){
  console.log('---------------------searchTheirConversation ' + guimiUID);
  var theriConver = [];

  var comments = data.comments;
  for(var i = 0; i < comments.length; i++){
    // console.log(comments[i].user.screen_name + "    "+  comments[i].text   + '----'+  targetScreenName);
    // console.log(targetScreenName);
    if(comments[i].text.search(targetScreenName) != -1){
      // 闺蜜回复的
      console.log(comments[i].user.screen_name + comments[i].text);
    }

    if(targetScreenName == comments[i].user.screen_name) {
      console.log(comments[i].user.screen_name + comments[i].text);
    }
  }

}

function getTheirConversation(guimiUID, callback){
  console.log('getTheirConversation');
  var requrl = '/statuses/user_timeline/ids.json?uid=' + guimiUID + '&count=10';
  getWeiboMethod( requrl, function(error, response) {
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
        // console.log('BODY: ' + chunk);
        var data = JSON.parse(chunkData);
        var statuses = data.statuses;
        for(var i  = 0 ; i < statuses.length ;  i++){
          getComments_show(statuses[i], null, null, searchTheirConversation, guimiUID);
        }
      });
  });
}

function printActivePerson(){
  console.log('finish');
  BubbleSort(weiboUsers);

  // for(var j  = 0 ; j < weiboUsers.length ;  j++){
    // console.log(weiboUsers[j].count + ', ' + weiboUsers[j].screen_name);
  // }

  var owner = weiboUsers[0];
  targetScreenName = owner.screen_name;

  // console.log(mostActiveUser.uid + ','+ mostActiveUser.screen_name + ',' + mostActiveUser.count);

  for(var j  = 1 ; j < weiboUsers.length && j < 4 ;  j++){

    console.log(weiboUsers[j].screen_name + ", " + weiboUsers[j].count);
    for(var i  = 0 ; i < weiboUsers[j].commentsArray.length ;  i++){
      console.log('    ' + weiboUsers[j].commentsArray[i].commentText + '  ' + weiboUsers[j].commentsArray[i].created_at   );
    }
    for(var i  = 0 ; i < owner.commentsArray.length ;  i++){
      var searchIndex = owner.commentsArray[i].commentText.search(weiboUsers[j].screen_name);
      if(searchIndex != -1){
        console.log( owner.screen_name + owner.commentsArray[i].commentText + '  ' + owner.commentsArray[i].created_at   );

      }
    };
    // console.log(weiboUsers[j].uid);
    // getTheirConversation(weiboUsers[j].uid);

  }
}

function getAtPerson(uid, callback){
  var requrl = '/statuses/user_timeline/ids.json?uid=' + uid + '&count=20';
  getWeiboMethod( requrl, function(error, response) {
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
        // console.log('BODY: ' + chunk);
        var data = JSON.parse(chunkData);
        var statuses = data.statuses;
        for(var i  = 0 ; i < statuses.length ;  i++){
          getComments_show(statuses[i], i, statuses.length, pushWeiboUsers, printActivePerson);
        }
      });
  });
}
// 处理一条微博的所有评论数据
// 把这些数据全部放进博主的comments array
var pushWeiboUsersCalledCount = 0;
function pushWeiboUsers(data, index, totalStatusNumber, callback){
  pushWeiboUsersCalledCount++
  console.log('pushWeiboUsers, ' + pushWeiboUsersCalledCount + '/' + totalStatusNumber);
  var comments = data.comments;
  for(var i = 0; i < comments.length; i++){
    var j ;
    var userScreennamesLength = weiboUsers.length;
    for(j = 0; j < userScreennamesLength; j++){
      if(weiboUsers[j].screen_name == comments[i].user.screen_name){
        weiboUsers[j].count++;
        var created_at = new Date(comments[i].created_at);
        var comment = new commentSchema(null, null, comments[i].text, created_at);
        weiboUsers[j].commentsArray.push(comment);
        break;
      }
    }
    if(j == userScreennamesLength){
      // 新出现的闺蜜
      var weiboUser = require('./weiboUser');
      var created_at = new Date(comments[i].created_at);
      var comment = new commentSchema(null, null, comments[i].text, created_at);
      var commentsArr = [comment];
      var wu = new weiboUser(comments[i].user.screen_name, comments[i].user.id, 1, commentsArr);
      weiboUsers.push(wu);
    }
  }

  if (pushWeiboUsersCalledCount == totalStatusNumber - 1) {
    console.log('callback');
    callback();
  };

}
// 根据评论的ID 获取所有评论内容
function getComments_show(weiboid, index, totalStatusNumber, callback, callback2){
  var requrl = '/comments/show.json?id=' + weiboid;
  getWeiboMethod( requrl, function(error, response) {
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
        var data = JSON.parse(chunkData);
        if (index) {
          callback(data, index, totalStatusNumber, callback2);
        }
        if(index==null){
          // console.log(chunkData);
          callback(data, callback2);
        }
      });
  });
}

getAtPerson(targetUID);







