/*
* Developer: Maysam Mahmoud
*/
//restful api server which support GET ,PUT ,DELETE and POST.
var express = require('express');
var app = express();
app.use(express.static(__dirname+"/views"));

//extracts the entire body portion of an incoming request stream and exposes it on req.body
var bodyParser = require('body-parser');
app.use(bodyParser.json());

//database name 'userslist'
var mongojs = require('mongojs');
var db = mongojs('mongodb://maysam:maysam2016@ds151108.mlab.com:51108/userslist', []);
app.get('/userslist', function (req, res) {
  db.userslist.find(function (error, docs) {
    res.json(docs);
  });
});

app.post('/addUser', function (req, res) {
  db.userslist.insert(req.body, function(error, doc) {
    res.json(doc);
  });
});

app.delete('/deleteUser/:id',function(req,res){
	var id = req.params.id;
    db.userslist.remove({_id: mongojs.ObjectId(id)}, function (error, doc) {
    	res.json(doc);
    });
});

//get specified user info used in edit button
app.get('/userslist/:id', function (req, res) {
	var id = req.params.id;
	db.userslist.findOne({_id: mongojs.ObjectId(id)}, function (error, doc) {
	    res.json(doc);
	});
});

app.put('/editUser/:id', function (req, res) {
	var id = req.params.id;
  	db.userslist.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {name: req.body.name, email: req.body.email, phone: req.body.phone,url: req.body.url, fid: req.body.fid}},
    new: true}, function (error, doc) {
      res.json(doc);
    }
  );
});

//to open profile viewer page
app.get('/listUsers/:id', function (req, res) {
	var id = req.params.id;
    res.sendFile( __dirname + "/views/" + "Profile.html");
});

app.listen(3000);
console.log("Server running on port 3000");
