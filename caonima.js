var multiparter = require("multiparter");
var https = require('https');
var weiboUser = require('./weiboUser');
var utils = require('./utils');
var commentModel = require('./commentModel');
require(__dirname+'/'+'userSchema');
require(__dirname+'/'+'GuimiSchema');

var mongoose = require('mongoose');
var dblocation =  'mongodb://localhost/peepweibo';
var targetUID = 1804832854;
// var targetUID = 1769461117;
// var targetUID = 1304252912; // vivi cola
// var targetUID = 1304253723 // xiaotianxin
// var access_token='2.00fEivnB87waEE37a37fc7ea0JsOjD' ; 
var access_token = '2.00fEivnB0VIwKyd80a7ee6cb0Vk1av';
var weiboUsers = [];
var targetScreenName;
mongoose.connect(dblocation);
UserSchema = mongoose.model('UserSchema');
GuimiSchema = mongoose.model('GuimiSchema');

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
  utils.BubbleSort(weiboUsers);

  user = new UserSchema({
    screen_name: targetScreenName
    , uid: targetUID
    , guimiUids : weiboUsers
  })
  user.save();

  // UserSchema.findOneAndUpdate(
  //   {uid:targetUID}
  //   ,{ 
  //     screen_name: targetScreenName
  //     , guimiUids : weiboUsers 
  //   }
  //   , null
  //   , function(err , user){
  //     console.log(user.uid);
  //     console.log(user.screen_name);
  //     console.log(user.guimiUids[0].screen_name);
  //     console.log(user.guimiUids[0].count);
  // })

  return;


  for(var j  = 1 ; j < weiboUsers.length && j < 4 ;  j++){
    console.log(weiboUsers[j].screen_name + ", " + weiboUsers[j].count);
    for(var i  = 0 ; i < weiboUsers[j].commentsArray.length ;  i++){
      console.log('    ' + weiboUsers[j].commentsArray[i].screen_name + ':' + weiboUsers[j].commentsArray[i].commentText + '  ' + utils.formateDate(weiboUsers[j].commentsArray[i].created_at  ) );
    }
    // getTheirConversation(weiboUsers[j].uid);
  }
}


// 处理一条微博的所有评论数据
// 把这些数据全部放进博主的comments array
var pWUCalledCount = 0;
function pushWeiboUsers(data, index, totalStatusNumber, callback){
  pWUCalledCount++
  console.log('pushWeiboUsers, ' + pWUCalledCount + '/' + totalStatusNumber);
  var comments = data.comments;
  for(var i = 0; i < comments.length; i++){
    var j ;
    var userScreennamesLength = weiboUsers.length;
    
    for(j = 0; j < userScreennamesLength; j++){
      if(weiboUsers[j].screen_name == comments[i].user.screen_name || (comments[i].user.id == targetUID 
        && comments[i].text.search(weiboUsers[j].screen_name) != -1)){
        weiboUsers[j].count++;
        var created_at = new Date(comments[i].created_at);
        var comment = new commentModel(comments[i].user.screen_name, comments[i].user.id, comments[i].text, created_at);
        weiboUsers[j].commentsArray.push(comment);
        break;
      }
    }

    if(j == userScreennamesLength && comments[i].user.id == targetUID){
      targetScreenName = comments[i].user.screen_name;
    }

    if(j == userScreennamesLength && comments[i].user.id != targetUID){
      // 新出现的闺蜜
      var created_at = new Date(comments[i].created_at);
      var comment = new commentModel(comments[i].user.screen_name, comments[i].user.id, comments[i].text, created_at);
      var commentsArr = [comment];
      var wu = new weiboUser(comments[i].user.screen_name, comments[i].user.id, 1, commentsArr);
      weiboUsers.push(wu);
    }
  }

  if (pWUCalledCount == totalStatusNumber - 1) {
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
          callback(data, callback2);
        }
      });
  });
}

function getAtPerson(uid, callback){
  var requrl = '/statuses/user_timeline/ids.json?uid=' + uid + '&count=100';
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

// getAtPerson(targetUID);
getGuimiByTargetUid(targetUID);
function getGuimiByTargetUid(uid){
  UserSchema.findOne({uid:uid}, function (err, user) {
      console.log(user.uid);
      console.log(user.screen_name);
      var guimiUids = user.guimiUids;

      // guimiUser = new GuimiSchema({
      //   screen_name: guimiUids[1].screen_name
      //   , uid: guimiUids[1].uid
      //   , comments : null
      // })
      // guimiUser.save(function(err, ll){
      //   console.log(ll.screen_name)
      // });

      // getTheirConversation(guimiUids[0].uid);
      // GuimiSchema.findOne({uid : guimiUids[0]},function(err , lol){
      //   console.log(lol.targetUid);
      //   console.log('ff')
      // })
      // return


      GuimiSchema.findOneAndUpdate(
        {uid:guimiUids[0].uid}
        ,
        {$set:
          {targetUid : user.uid
          ,targetScreenName:user.screen_name}
        },
      function(err , lol){
        console.log(JSON.stringify(lol));
      })


  })
}


