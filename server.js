var http = require('http');
var express = require('express');
var compute = require('./compute');
var app = express()

app.get('/', function(req , res){
    res.end('/root');
});

app.get('/uid/:id', function(req, res){
    console.log('call back');
    // res.end();
})

app.param('id', function(req, res, next, id){
    console.log(id);

    // var user = {uid : 123, screen_name: 'hello i am 123'};
    // var data = [user];
    // var resData = JSON.stringify({array: data});
    // res.end(resData);


    // if(0)
    compute.computeData(id, function(data){
        // var resData = JSON.stringify({array: data});
        if (data.error) {
            console.log(data.error);
            res.end(data.error);
            return;
        }

        res.end(JSON.stringify(data));
        // res.end(data.array);

    });

});

app.post('/test', function(req, res){
    console.log('jfdkj');
    res.end('test');
});

var port = process.env.PORT || 3000
app.listen(port)
console.log('Express app started on port '+port)


