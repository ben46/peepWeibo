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

function getUserTimeline_IdsById(uid, count, callback){
  count = (count < 10 ? 10 : count);
  var reqUrl = '/statuses/user_timeline/ids.json?uid=' + uid + '&count=' + count;
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