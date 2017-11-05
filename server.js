var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var bcrypt = require('bcryptjs');


app.use(express.static('public'));
app.use(bodyParser.json());

var db = null;

MongoClient.connect("mongodb://localhost:27017/mittens",function(err, dbConn){
    if(!err)
        {
            console.log('we are connected');
            db = dbConn;
        }
});

app.get('/meows',function(req,res,next){

    db.collection('meows',function(err,meowsCollection){
        meowsCollection.find().toArray(function(err, meows){
            return res.json(meows);
        });
    })
    

});


app.post('/meows',function(req,res,next){
    
    db.collection('meows',function(err,meowsCollection){
    var newMeow =  {
                      text : req.body.newMeow
                   };
            meowsCollection.insert(newMeow,{w:1},function(err){
            return res.send();
        });
    })

});



app.put('/meows/remove',function(req,res,next){
    
    db.collection('meows',function(err,meowsCollection){

          var meowId  = req.body.meow._id;
       meowsCollection.remove({_id : ObjectId(meowId)},{w:1},function(err,result){
            return res.send();
        });
        
    })

});



app.post('/users',function(req,res,next){
    
    db.collection('users',function(err,usersCollection){
        
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.user.password, salt, function(err, hash) {
                var newUser =  {
                      username : req.body.user.username,
                      password : hash
                   };
                
                       usersCollection.insert(newUser,{w:1},function(err){
                        return res.send();
        });    
                
    });
});
    })

});


app.post('/users/signin',function(req,res,next){
    
});




app.listen('3000', function(){
   console.log('Hurray!! Node is here'); 
});