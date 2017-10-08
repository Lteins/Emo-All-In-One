var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonfile = require('jsonfile')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/post',function (req, res) {
    console.log("Received");
    console.log(req.body);

    var file = '../data/data1.json';
    var obj = req.body;
    jsonfile.writeFile(file, obj, function (err) {
    console.error(err)
    });
    var feedBack = {'status': 'success'};
    console.log(JSON.stringify(feedBack));
    res.end(JSON.stringify(feedBack));
});

var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port

  console.log("Start http://%s:%s", host, port)
});