var express = require('express')
// Start the app by listening on <port>
var app = express();
var compute = require('./compute');

app.get('/:id', function(req, res){



})//根据ID获取单条微博信息
app.param('id', function(req, res, next, id){

	console.log(id)
	return;
   compute.computeData(id, function(err, data){
		if (err) {
			response.end(err);
			return;
		}
		response.writeHead(200, {"Content-type" : "text/json"});
		response.write(JSON.stringify(data));
		response.end();
	});
})

var port = process.env.PORT || 3000
app.listen(port)
console.log('Express app started on port '+port)