var express = require('express');
var app = express();

app.use(express.static(__dirname+"/public"))

var mongojs = require('mongojs');
var db = mongojs('userslist', ['userslist']);

app.get('/userslist', function (req, res) {
  console.log('I received a GET request');

  db.userslist.find(function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});





app.listen(3000);
console.log("Server running on port 3000");
