var http = require("http");
var url = require("url");

http.createServer(function(request , response){
	var pathname = url.parse(request.url).pathname;
	console.log("pathname = " + pathname);

	var postdata = '';
	request.setEncoding("utf8");
	request.addListener('data' , function (chunk){
		console.log("chunk = " + chunk);

		console.log(JSON.parse(chunk).targetUID);
		postdata += chunk;
	});

	request.addListener('end' , function (){
	});

	response.writeHead(200, {"Content-type" : "text/json"});
	response.write(JSON.stringify({isAlive : true}));
	// response.end();
	
}).listen(8888);

console.log("server started");