var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(express.static(__dirname+"/views"));
app.use(bodyParser.json());

var mongojs = require('mongojs');
var db = mongojs('userslist', ['userslist']);

app.get('/userslist', function (req, res) {
  
  db.userslist.find(function (err, docs) {
    res.json(docs);
  });
});

app.post('/addUser', function (req, res) {
  db.userslist.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/deleteUser/:id',function(req,res){
	var id = req.params.id;
    db.userslist.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    	res.json(doc);
    });
});
//get specified user info used in edit button
app.get('/userslist/:id', function (req, res) {
	var id = req.params.id;
	db.userslist.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
	    res.json(doc);
	});
});

app.put('/editUser/:id', function (req, res) {
	var id = req.params.id;
  	db.userslist.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {name: req.body.name, email: req.body.email, phone: req.body.phone,url: req.body.url, fid: req.body.fid}},
    new: true}, function (err, doc) {
      res.json(doc);
    }
  );
});

app.get('/listUsers/:id', function (req, res) {
	var id = req.params.id;
    res.sendFile( __dirname + "/views/" + "Profile.html");
});

app.listen(3000);
console.log("Server running on port 3000");
