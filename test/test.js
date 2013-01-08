/* Main application entry file. Please note, the order of loading is important.
 * Configuration loading and booting of controllers and custom error handlers */

var http = require('http-get')  ; 
var options = {url : 'http://localhost/foo.pdf' };
http.get( options  ,  '/Users/macbookair/node_js/blog/foo.pdf' , function(err , result){
	if (err) {
		console.error(err);
	}else{
		console.log('File downloaded at ' + result.file);
	}
}) ; 
http.listen(8080);
console.log('server started ' );
