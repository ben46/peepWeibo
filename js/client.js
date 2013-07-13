
var targetUID = 1304252912; // vivi cola
var access_token='2.00fEivnB87waEE37a37fc7ea0JsOjD' ; 


function getWeiboMethod(requrl, callback) {
    var https = require('https');
    var options = {
        host: 'api.weibo.com',
        path: requrl + '&access_token=' + access_token,
        method: "GET"
    };
    // console.log(options);
    var requestWeibo = new multiparter.request(https, options);
    requestWeibo.send(callback);
}

function getUserTimelineById(uid, count, callback, options) {
    count = (count < 1 ? 1 : count);
    var reqUrl = '/statuses/user_timeline.json?uid=' + uid + '&count=' + count;
}

function sendMsg() {
    var myForm = document.createElement("form");
    myForm.method = "get";
    myForm.action = "line_ticket.aspx";
    var myInput = document.createElement("input");
    myInput.setAttribute("name", "id");
    myInput.setAttribute("value", idStr);
    myForm.appendChild(myInput);

    var myInput2 = document.createElement("input");
    myInput2.setAttribute("name", "fid");
    myInput2.setAttribute("value", fid);
    myForm.appendChild(myInput2);

    var myInput3 = document.createElement("input");
    myInput3.setAttribute("name", "unlock");
    myInput3.setAttribute("value", unlock);
    myForm.appendChild(myInput3);

    var myInput4 = document.createElement("input");
    myInput4.setAttribute("name", "Option");
    myInput4.setAttribute("value", "del");
    myForm.appendChild(myInput4);
    document.body.appendChild(myForm);
    myForm.submit();
    document.body.removeChild(myForm);
}




