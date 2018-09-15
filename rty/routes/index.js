var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();
var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});
AWS.config.accessKeyId="AKIAIIVIX2PARDW5YT2A";
AWS.config.secretAccessKey="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";
var docClient = new AWS.DynamoDB.DocumentClient();

var params = {
    TableName: "Musics"
};
var params1 = {
    TableName: "Musics",
    KeyConditionExpression:"#yr=:yyyy",
    ExpressionAttributeNames:{
        "#yr":"musicId"
    },
    ExpressionAttributeValues:{
        ":yyyy":"M0001"
    }
};

/* GET home page. */
router.get('/', function(req, res, next) {
 // res.render('index', { title: 'Express' });
    var a=[];
    docClient.scan(params, function (err,data) {
        if(err){
            console.log("error");
        }
        else {
            data.Items.forEach(function (item) {
                a.push(item);
                console.log(a);
                res.render("home",{ID:a,name:""});
            })
        }
    });


})
router.post('/login',urlencodedParser,function (req,res,next) {
    var rt="";
    var a=[];
  var uname=req.body.uname;
    var tendn1=uname.toLowerCase();
  var psw=req.body.psw;
    var params2={
        TableName:"User",
        KeyConditionExpression:"#name=:ten",
        ExpressionAttributeNames:{
            "#name":"userName"
        },
        ExpressionAttributeValues:{
            ":ten":tendn1
        }
    };
 docClient.query(params2,function (err,data) {
     if (err) {
         console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
     } else{
         data.Items.forEach(function (item) {

             if(item.info.password==psw){

                  docClient.scan(params, function (err,data) {
                      if(err){
                          console.log("error");
                      }
                      else {
                          data.Items.forEach(function (item) {
                              a.push(item);
                              res.render("home",{ID:a,name:""+tendn1});
                          })
                      }
                  });
              }


         })
     }
 })

});
router.get('/upload',function (req,res,next) {
   res.render("upload");
});
router.post('/newuser',urlencodedParser,function (req,res,next) {
    var dem=0;
    var tendn=req.body.tendn;
    var tendn1=tendn.toLowerCase();

    var tenname=req.body.tenname;
    var  psw=req.body.psw;
    var d=new Date();
    var d1=d.getDay()+"-"+d.getMonth()+"-"+d.getFullYear();

    var params2={
        TableName:"User",
        KeyConditionExpression:"#name=:ten",
        ExpressionAttributeNames:{
            "#name":"userName"
        },
        ExpressionAttributeValues:{
            ":ten":tendn1
        }
    };
    var params3 = {
        TableName:"User",
        Item:{
            "userName":tendn1,
            "info":{
                "password": psw,
                "nickname": tenname,
                "joinDate": d1
            }
        }
    };

    docClient.put(params3,function (err,data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });

 res.redirect("/");



});
router.get('/chitiet',urlencodedParser,function (req,res,next) {

    var b=[];
    var params1 = {
        TableName: "Musics",
        KeyConditionExpression:"#yr=:yyyy",
        ExpressionAttributeNames:{
            "#yr":"musicId"
        },
        ExpressionAttributeValues:{
            ":yyyy":req.query.id
        }
    };
  console.log(req.query.id);
    docClient.query(params1,function (err,data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                b.push(item);
               res.render("videos",{video:b})
            });
        }
    });
});

router.post('/insert',function (req,res) {
    
})
module.exports = router;
