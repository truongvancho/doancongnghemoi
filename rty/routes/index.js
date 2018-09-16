var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var musicDAO = require("../dao/MusicDAO");
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();
var session = require('express-session');
var AWS = require("aws-sdk");

router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge:60*1000*20*24 }
}))

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});
AWS.config.accessKeyId="AKIAIIVIX2PARDW5YT2A";
AWS.config.secretAccessKey="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";
var docClient = new AWS.DynamoDB.DocumentClient();


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
    var params = {
        TableName: "Musics"
    };
    var b=[];
    docClient.scan(params, function (err,data) {
        if(err){
            console.log("error");
        }
        else {
            data.Items.forEach(function (item) {

           b.push(item);


               /// res.render("home",{ID:a,name:req.session.username});
            })
            console.log(b.length);
            res.render("home",{ID:b,name:req.session.username});
        }
    });






})

router.post('/login',urlencodedParser,function (req,res,next) {

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
    var params = {
        TableName: "Musics"
    };
    docClient.query(params2,function (err,data) {

        data.Items.forEach(function (item) {

            if(item.info.password==psw){

                docClient.scan(params, function (err,data) {
                    if(err){
                        console.log("error");
                    }
                    else {
                        data.Items.forEach(function (item) {
                            a.push(item);
                            req.session.username=tendn1;
                            if(req.session.out){
                                req.session.username="";
                            }

                        })
                        return  res.render("home",{ID:a,name:""+req.session.username});
                    }
                });
            }
            else {
                res.redirect("/");
            }


        })

    })

});
router.get('/upload',function (req,res) {
    if(req.session.out){
        req.session.username="";
    }
    res.render("upload", {title: "Upload Nhạc",name: req.session.username,xincho1lan:""});
});

router.get('/dangxuat',function (req,res) {


    req.session.username="";
    req.session.out="";
    req.session.destroy((error)=>{
        if(error){
            console.log(error);
        }
        else{


            console.log("thanh cong");
        }
    });
   res.redirect("/");

});
router.get("/playlist",function (req,res) {
    res.render("playlist");
})
router.get("/qwe",urlencodedParser,function (req,res) {

    var tendn=req.query.tendn;
    var tendn1=tendn.toLowerCase();
    var tenname=req.query.tenname;
    var psw=req.query.psw;
    var d=new Date();

   var mess=""+d.getDay()+"-"+d.getMonth()+"-"+d.getFullYear();
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
                "joinDate": mess
            }
        }
    };
    docClient.query(params2, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                if(item.userName==tendn1){
                   /// return res.render("qwe",{d:" khong thanh cong"+tendn1});
                    return res.send("khong thanh cong");
                }
                else{
                    docClient.put(params3, function(err, data) {

                            console.log("Added item:", JSON.stringify(data, null, 2));
                            res.send("thanh cong");

                          //  res.render("qwe",{d:"thanh cong"+tendn1});

                    });
                }
            });
        }
    });












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
    var form = new formidable.IncomingForm();
    form.parse(req,function (err, fields, files) {
        var tenBh = fields.tenBh;
        var oldpath = files.file.path;
        do{

            var kq= true;
            rand = Math.floor(Math.random()*Math.floor(1000000));
            var newpath = __dirname+"/../public/musics/"+rand+".mp3";
            var urlMp3 = "musics/"+rand+".mp3";

            var data = {
                idM: "M"+rand,
                tenBh :fields.tenBh,
                tacGia: fields.tacGia,
                caSy: fields.caSy,
                quocGia: fields.quocGia,
                urlMp3: urlMp3
            }
            musicDAO.insertMusic(data,function (rs) {
                if(rs==false){
                    kq=false;
                    res.render('upload',{xincho1lan:"fail",name: req.session.username});
                }
                else{
                    fs.rename(oldpath,newpath,function (err) {
                        if(err){
                            console.log(err);
                            res.render('upload',{xincho1lan:"fail",name: req.session.username});
                        }
                        else{
                            res.render('upload',{xincho1lan:"success",name: req.session.username});
                        }
                    })
                }
            });
        }while(kq==false)
    })
})

module.exports = router;
