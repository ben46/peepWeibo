var multiparter = require("multiparter");
var https = require('https');
var utils = require('./utils');
require(__dirname+'/model/'+'userSchema');
require(__dirname+'/model/'+'GuimiSchema');
require(__dirname+'/model/'+'CommentSchema');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dblocation =  'mongodb://localhost/peepweibo_2';
// var targetUID = 1804832854;
// var targetUID = 1769461117;
var targetUID = 1304252912; // vivi cola
// var targetUID = 1304253723 // xiaotianxin
var access_token='2.00fEivnB87waEE37a37fc7ea0JsOjD' ; 
// var access_token = '2.00fEivnB0VIwKyd80a7ee6cb0Vk1av';
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

// 处理一条微博的所有评论数据
// 把这些数据全部放进博主的comments array
function pushDataIntoWeiboUsers(data, weiboContent, callback){
  var comments = data.comments;
  for(var i = 0; i < comments.length; i++){
    // var created_at = new Date(comments[i].created_at);
    var comment = new CommentSchema({
      targetUser : targetUser
      , user : comments[i].user
      , created_at : comments[i].created_at
      , weiboId : weiboContent.id
      , weiboText : weiboContent.text
      , id : comments[i].id
      , text: comments[i].text
      , weibo: weiboContent
    });
    var j;    
    for(j = 0; j < weiboUsers.length; j++){
      if(weiboUsers[j].user.screen_name == comments[i].user.screen_name 
        || (comments[i].user.id == targetUser.id && comments[i].text.search(weiboUsers[j].user.screen_name) != -1)){
        weiboUsers[j].count++;
        weiboUsers[j].comments.push(comment);
        break;
      }
    }
    if(j == weiboUsers.length && comments[i].user.id != targetUID){
      // 新出现的闺蜜
      // var wu = new weiboUser(comments[i].user, 1, [comment]);
      var wu = new GuimiSchema({
        targetUser : targetUser
        , user: comments[i].user
        , comments: [comment]
        , count : 1
      });
      weiboUsers.push(wu);
    }
  }
  callback();
}

// 根据评论的ID 获取所有评论内容
function getComments_show(weiboid, options, callback){
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
        callback(data, options);
      });
  });
}



function getUserTimelineById(uid, count, callback, options){
  count = (count < 1 ? 1 : count);
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
        // console.log(chunkData);
        var data = JSON.parse(chunkData);
        callback(data, options);
      });
  });
}

var saveSchema = new Schema({
    uid : Number
    , screen_name : String
    , array : []
});

mongoose.model('saveSchema', saveSchema);
save = mongoose.model('saveSchema');

 // var _schema = new save({
  //   uid : targetUID
  //   , screen_name : 'i am screen_name'
  //   , array : []
  // });
  // _schema.save();

  // save.findOne({uid : uid} , function(err, user){
  //   if (err) {
  //     var _schema = new save({
  //       uid : targetUID
  //       , screen_name : 'i am screen_name'
  //       , array : []
  //     });
  //     _schema.save();
  //   }
  //   if (user) {
  //     return callback(user);
  //   };
  // });


// weiboText -> statuses[i].id -> comments -> guimiCount -> guimiWeiboText -> comments

exports.computeData = function(uid, callback){
  targetUID = uid;
  save.findOne({uid : uid} , function(err, user){
    if (user) {
      console.log('user exists');
      callback(user);
    }else{
      buzhidaoqushenmemingzi(targetUID, function (userArray) {
        if (userArray.error) {
          return callback({error: 'invalid uesr'});
        };
          var _schema = new save({
             uid : targetUID
            , screen_name : targetUser.screen_name
            , array : userArray
          });
          _schema.save(function(){
            console.log('user schema saved');
            callback(_schema);
          });
      })
    }
  })
}




function buzhidaoqushenmemingzi (uid, callback) {

getUserTimelineById(targetUID, 30, function(data1){

  var statuses = data1.statuses;
  if (statuses.length == 0) {
    return callback({error: 'invalid uesr'});
  };

  targetUser = statuses[0].user;
  // console.log(targetUser);

  for(var i  = 0 ; i < statuses.length ;  i++){
    var calledCount = 0;
    getComments_show(statuses[i].id, i, function(data2, options){
        pushDataIntoWeiboUsers(data2, statuses[options], function(){
          calledCount++
          console.log(calledCount + ',    ' + options);
          if(calledCount == statuses.length){
            utils.BubbleSort(weiboUsers);

            // for(var j  = 0; j < weiboUsers.length && j < 10;  j++){
            //   console.log(weiboUsers[j].user.screen_name);
            //   console.log(weiboUsers[j].count);
            // }


            var calledCount2 = 0;
            for(var j  = 0; j < weiboUsers.length && j < 5 ;  j++){
      //         // according to these 10 weibo users uid
      //         // ->>>get their weibo 
              getUserTimelineById(weiboUsers[j].user.id, 15, function(data3, options_1){
                // console.log(data3.statuses[0]);
                // get comments
                for(var k  = 0; k < data3.statuses.length;  k++){
                  getComments_show(data3.statuses[k].id
                    , data3.statuses[k]
                    , function(data4, options_2){
                      for(var l  = 0; l < data4.comments.length;  l++){
                        if(data4.comments[l].user.id == targetUser.id 
                          || data4.comments[l].text.search(targetUser.screen_name) != -1){
                          // 是否是target回复的 
                          // 是否是回复target的
                          var comment = new CommentSchema({
                            targetUser : targetUser
                            , user : data4.comments[l].user
                            , created_at : data4.comments[l].created_at
                            , weiboId : options_2.id
                            , weiboText : options_2.text
                            , weibo: options_2
                            , id : data4.comments[l].id
                            , text: data4.comments[l].text
                          });
                          // console.log(weiboUsers[options_1].user.screen_name + comment.weiboText);
                          // console.log(comment.user.screen_name + comment.text);
                          // console.log(options_2.user.screen_name);
                          weiboUsers[options_1].comments.push(comment);
                          weiboUsers[options_1].count++;

                          // console.log('push');
                        }// if
                      }// for
                      calledCount2++;
                      console.log(j+'_'+k+'_'+calledCount2);

                      if(j*k == calledCount2){
                        // sendFinishSignal();
                        callback(weiboUsers);

                      }
                    }); // getcomments_show
                } // for
              }, j);
              // break;
            }
          } // if(calledCount == statuses.length - 1 && 0){
        }) // pushDataIntoWeiboUsers
      // } // if(i<statuses.length){
    });// getComments_show
    // break;
  }
});



}









