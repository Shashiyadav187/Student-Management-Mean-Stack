var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs("studentlistCopy", ["studentlist"]);
var db_reg = mongojs("studentlistCopy", ["register"]);
var db_class = mongojs("studentlistCopy", ["class_list"]);
var bodyparser = require('body-parser');
var session = require('express-session'),
    MongoDBStore = require('connect-mongodb-session')(session)

var store = new MongoDBStore({
    uri: "mongodb://localhost:27017/studentlistCopy",
    collection: 'login_session'
});

app.use(express.static(__dirname + "/public"));
app.use(bodyparser.json());
app.use(
    session({
        secret: 'test_sess_secret_key',
        resave: true,
        saveUninitialized: true,
        store: store
    })
);

store.on('error', function(req, res) {
    console.log("error");
});

/*app.get("/studentlist", function(req,res) {
	console.log("request recieved");

	db.studentlist.find(function(err,docs) {
		console.log(docs);
		res.json(docs);
	})
})*/

app.post("/studentlist", function(req, res) {
    console.log("Data inserted");

    console.log(req.body);

    db.studentlist.insert(req.body, function(err, docs) {
        res.json(docs);
    })

})


app.post("/register", function(req, res) {
    console.log("Register data");

    console.log(req.body);

    db_reg.register.insert(req.body, function(err, docs) {
        res.json(docs);
    })
})

/*app.get("/register", function(req,res) {
	
	console.log("login data request");

	db_reg.register.find(function(err,docs) {
		res.json(docs);
	})

	
})*/

app.post("/login", function(req, res) {
    console.log("login data request");

    db_reg.register.findOne({
        "username": req.body.username,
        "password": req.body.password
    }, function(err, docs) {
        if (docs) {
            console.log(docs);
            req.session.loguser = docs;
            res.send("successful");
        } else {
            res.send(err);
        }
    })
})

app.get('/logout', function(req, res) {
    req.session.loguser = null;
    res.send("successful");
});

app.get('/isloggedin', function(req, res) {
    res.send(req.session.loguser ? req.session.loguser : false);
});

app.get("/studentlist/:selectedclass", function(req, res) {
    console.log("Does it come here");
    var sel_class = req.params.selectedclass;

    console.log(sel_class);
    console.log("login data request");

    db.studentlist.find({selectedClass: sel_class}, function(err, docs) {
        console.log(docs);
        res.json(docs);
    })
})

app.get("/getstudent/:selstu", function(req, res) {
    console.log("Does it come here again");
    var sel_stu = req.params.selstu;

    console.log(sel_stu);
    console.log("student data request");

    db.studentlist.find({name: sel_stu}, function(err, docs) {
        console.log(docs);
        res.json(docs);
    })
})

app.get("/edit/:id", function(req,res) {
	var id = req.params.id;
	console.log(id);

	db.studentlist.findOne({"_id":mongojs.ObjectId(id)}, function(err,docs) {
		res.json(docs);
	})
})

/*app.post("/studentlist", function(req,res) {
	console.log("Does it come here again");
	

	console.log(sel_stu);
	console.log("student data request");

	db.studentlist.find({"name":req.body.name}, function(err,docs) {
		console.log(docs);
		res.json(docs);
	})
})*/

app.get("/class", function(req, res) {

    db_class.class_list.find(function(err, docs) {
        res.json(docs);
    })
})

app.get("/subjectlist/:selectedclass", function(req, res) {

    var selclass = req.params.selectedclass;
    console.log(selclass);
    db_class.class_list.find({
        "class": selclass
    }, function(err, docs) {
        console.log(docs);
        res.json(docs);
    })
})

app.put('/update/:id', function(req,res) {

    console.log(req.body.name);
    var id = req.params.id;

    db.studentlist.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {name: req.body.name, contact: req.body.contact, selectedClass:req.body.selectedClass,
        subject1:req.body.subject1, subject2: req.body.subject2, subject3: req.body.subject3, mark1:req.body.mark1,
        mark2:req.body.mark2, mark3:req.body.mark3}},
    new: true}, function (err, docs) {
      res.json(docs);
    }
  );
})

app.delete("/delete/:id", function(req,res) {
    console.log(req.params.id);

    var id = req.params.id;
    db.studentlist.remove({_id: mongojs.ObjectId(id)} ,function(err,docs) {
        res.json(docs);
    });
})

app.listen(3000);
console.log("Server running on port 3000");