var http = require('http');
var multiparter = require("multiparter");
var querystring = require('querystring'),
crypto = require('crypto'),
https = require('https'),
URL = require('url'),
path = require('path'),
fs = require('fs');

var baseurl = "https://api.weibo.com/2/";
var _accesstoken = "2.00fEivnB0VIwKyd80a7ee6cb0Vk1av";

function getUserLine(uid){

  var weibo = require('./weibo');
  var apiName = 'friendships/friends/ids';

  var reqUrl = baseurl + apiName + '.json?access_token=' + _accesstoken + '&uid=' + uid  ; 
  // console.log(reqUrl);

  var req2 = 'https://api.weibo.com/2/friendships/friends/ids.json?uid=1737893763&access_token=2.00fEivnB87waEE37a37fc7ea0JsOjD' ; 

  var url = baseurl + 'friendships/friends/ids.json';

  weibo._request(  'GET'   ,  req2 , null , null , null , function(error, body, response) {  
     if (error) {  
         console.log("error:");  
         console.log(error);  
     }  
     else {  
         console.log("body:" + body);  
     }  
  }  );


return ;



var options = {
  hostname: req2,
  port: 80,
  // path: '/',
  method: 'GET',
  agent: false
};


https.request(options, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);

    res.on('data', function(d) {
      process.stdout.write(d);
    });
  }).on('error', function(e) {
    console.error('error!!');
    console.error(e);
  });

https.get(req2, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);

    res.on('data', function(d) {
      process.stdout.write(d);
    });
  }).on('error', function(e) {
    console.error('error!!');
    console.error(e);
  });



}

getUserLine(3530797791034382);