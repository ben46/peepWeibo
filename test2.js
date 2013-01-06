var http = require('http');
var multiparter = require("multiparter");
var querystring = require('querystring'),
crypto = require('crypto'),
https = require('https'),
URL = require('url'),
path = require('path'),
fs = require('fs');



function getMicroWeiboMethod(){
  var options = {
  hostname: '184.154.128.246/',
  method: 'GET' , 
  path : '/' , 
  header: ''
  };

  var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  // write data to request body
  req.write('data\n');
  req.write('data\n');
  req.end();
}




function getWeiboMethod(){

  var https = require('https');


  var access_token='2.00fEivnB87waEE37a37fc7ea0JsOjD' ; 
  var requestWeibo = new multiparter.request(https, {
      host: 'api.weibo.com',
      path: '/statuses/public_timeline.json?source=1306060637&count=2' ,
      method: "GET"
  });
  // requestWeibo.setParam("access_token", access_token );

  requestWeibo.send(function(error, response) {
    if (error) {
      console.log('requestWeibo', error);
      return;
    }
    // console.log('STATUS: ' + response.statusCode);
    // console.log('HEADERS: ' + JSON.stringify(response.headers));
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      // console.log('BODY: ' + chunk);

      var data = JSON.parse(chunk);
       console.log (  data.statuses[0].user.id ) ;  
       // var msg = JSON.parse(data.statuses[0] );
        console.log (   data.statuses[0].text  ) ;  

    });


  });

}

// postMethod();

function postMethod(){
  var options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/',
  method: 'POST'
  };

  var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.write('data\n');
  req.write('data\n');
  req.end();
}
// ----------
// hah 
function postMethod2(method, url, headers, post_body) {
        var creds = crypto.createCredentials({});
        var parsedUrl = URL.parse(url, true);
        if (parsedUrl.protocol == "http:" && !parsedUrl.port) {
          parsedUrl.port = 3000;
        }

        var realHeaders = {};
        if (headers) {
            for (var key in headers) {
                realHeaders[key] = headers[key];
            }
        }
        realHeaders['Host'] = parsedUrl.host;

        if (Buffer.isBuffer(post_body)) {
            realHeaders['Content-Length'] = post_body ? post_body.length: 0;
        }
        else {
            realHeaders['Content-Length'] = post_body ? Buffer.byteLength(post_body) : 0;
        }
      

        var result = "";
        var queryStr = querystring.stringify(parsedUrl.query);
        if (queryStr) queryStr = "?" + queryStr;
        var options = {
            host: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + queryStr,
            method: method,
            headers: realHeaders
        };
        // Some hosts *cough* google appear to close the connection early / send no content-length header
        // allow this behaviour.
        var allowEarlyClose = false;
        var callbackCalled = false;
        function passBackControl(response, result) {
            if (!callbackCalled) {
                callbackCalled = true;
                if (response.statusCode != 200 && (response.statusCode != 301) && (response.statusCode != 302)) {
                    callback({
                        statusCode: response.statusCode,
                        data: result
                    });
                } else {
                    callback(null, result, response);
                }
            }
        }
        console.log("options:");
        console.log(options);
        var request = http.request(options,
            function(response) {
                response.on("data",
                function(chunk) {
                    result += chunk ; 
                    console.log();
                    console.log('-----------result : \n' + result);

                });
                response.on("close",
                function(err) {
                    if (allowEarlyClose) {
                        // passBackControl(response, result);
                    }
                });
                response.addListener("end",
                function() {
                    // passBackControl(response, result);
                });
        });
        request.on('error',
        function(e) {
            callbackCalled = true;
            callback(e);
        });
        if (method == 'POST' && post_body) {
            request.write(post_body);
            console.log("post_body:");
            console.log(post_body);
        }
        request.end();
}

function helloPostMethod(){
    var params = { "status":  'weiboText' };
    var post_data = querystring.stringify(params);
    var post_headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    if (params.ContentType) {
        post_headers['Content-Type'] = params.ContentType;
    }

    postMethod2('POST'   ,   'http://localhost:3000' ,  post_headers , post_data );
    // function postMethod2(method, url, headers, post_body) {
}
// helloPostMethod();








/*
 *  发微博
*/
function updateWeibo(weiboText){
  var weibo = require('./weibo');
  var wb = new weibo();
  if (weiboText === null) {
      weiboText = "中文不行?" ;
  }
  wb.update({  
       "status":  weiboText
    },  
    function(error, body, response) {  
     if (error) {  
         console.log("error:");  
         console.log(error);  
     }  
     else {  
         console.log("body:" + body);  
     }  
  });  
}

updateWeibo('current time 554');









