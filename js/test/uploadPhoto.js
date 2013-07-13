function uploadPhoto(){
  var multiparter = require("multiparter");
  var https = require('https');
  var dataStream = require('dataStream');
  var uploadToWeibo = function(obj , fn){
    var weiboUploadApiPath = '/2/statuses/upload.json';
    var tokenObj = null;
    var sina_a = new asyncmgr.AsyncAction();
    sina_a.register('get stream length');
    sina_a.register('get token');
    var stream = request.get(obj.img_url_to_post);
                                                                                                                                                     
    sina_a.onAllDone = function(){
    console.log('======================== all done start');
    var requestWeibo = new multiparter.request(https, {
        host: "upload.api.weibo.com",
        port: 443,
        path: weiboUploadApiPath,
        method: "POST"
    });

    // add some plain params here
    requestWeibo.setParam("source", weibo_appKey);
    requestWeibo.setParam("access_token", tokenObj.access_token);
    requestWeibo.setParam("status", obj.status );
    console.log('stream 的长度是', uploadStream.body().length);
    requestWeibo.addStream(
      "pic",//服务器接收时的变量名
      "test.jpg",//文件名
      "image/jpeg",// mime type TODO: 别的类型呢？
      uploadStream.body().length,// stream 的 size
      uploadStream
    );
                                                                                                                                                     
    // send request and receive response
    requestWeibo.send(function(error, response) {
      if (error) {
        console.log('requestWeibo', error);
        return;
      }
      var data = "";                                                                                                                                      
      response.setEncoding("utf8");                                                                                                                                    
      response.on("data", function(chunk) {
          data += chunk;
      });                                                                                                                                 
      response.on("end", function() {
          if(fn){
              fn.call(this, null, data);   
          }
      });                                                                                                                                  
      response.on("error", function(error) {
          console.log(error);
          if(fn){
              fn.call({ code : 2, error : error });
          }
      });
      });
                                                                                                                                                     
    };//end onAllDone
                                                                        
    var uploadStream = new dataStream();
    uploadStream.on('end', function() {
        sina_a.thisDone('get stream length');
    });//end event 'complete'
    stream.pipe(uploadStream);     
           
    //获取token, 待会用来发状态
    getToken(obj.req, obj.userId, 2, function(to){
        tokenObj = to;  
        sina_a.thisDone('get token');
    });
  };
}