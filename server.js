var http = require('http');
var express = require('express')
var app = express()

app.get('/', function(req , res){
    res.end('/root');
});

app.get('/articles/:id', function(req, res){
    console.log('call back');
})

app.param('id', function(req, res, next, id){
    console.log(id);
});

app.post('/users', function(req, res){
    console.log('jfdkj');
    res.end();
});

var port = process.env.PORT || 3000
app.listen(port)
console.log('Express app started on port '+port)


