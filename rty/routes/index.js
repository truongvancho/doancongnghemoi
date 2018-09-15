var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var musicDAO = require("../dao/MusicDAO");
var formidable = require('formidable');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();
var session=require('express-session');
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
<<<<<<< HEAD
router.get('/upload',function (req,res) {
   res.render("upload",{title: "Upload Nhạc"});
=======
router.get('/upload',function (req,res,next) {
    res.render("upload");
<<<<<<< HEAD
>>>>>>> 432356a8c72c19e9108ba81b218fdf654eeff15d
});
router.get("/qwe",urlencodedParser,function (req,res) {

    var tendn=req.query.tendn;
    var tendn1=tendn.toLowerCase();
    var tenname=req.query.tenname;
    var psw=req.query.psw;
    var s=req.query.s;
    var mess="";
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
                "joinDate": s
            }
        }
    };
    docClient.put(params3, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            res.render("qwe",{d:"khong thanh cong"+tendn1});

        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            mess+="thanh cong";
            res.render("qwe",{d:"thay cong"+tendn1});
        }
    });



});
=======
});
router.get("/qwe",urlencodedParser,function (req,res) {

    var tendn=req.query.tendn;
    var tendn1=tendn.toLowerCase();
    var tenname=req.query.tenname;
    var psw=req.query.psw;
    var d=new Date();

    var mess=d.getDay()+"-"+d.getMonth()+"-"+d.getFullYear();
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
    docClient.query(params2,function (err,data) {
        if(err){
            console.log(err);
        }
        else{
            data.Items.forEach(function (item) {
                if(item.userName==tendn1){
                    return  res.render("qwe",{d:"khong thanh cong"+tendn1});
                }

                docClient.put(params3, function(err, data) {

                    console.log("Added item:", JSON.stringify(data, null, 2));
                    mess+="thanh cong";
                    res.render("qwe",{d:"thanh cong"+tendn1});

                });

            })
        }

    })




});
>>>>>>> d5d2149ad12dde55d2ea888947ec1047ba964330

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

<<<<<<< HEAD
<<<<<<< HEAD
router.post('/insert',function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req,function (err, fields, files) {
        var tenBh = fields.tenBh;
        var oldpath = files.file.path;
        rand = Math.floor(Math.random()*Math.floor(1000000));
        console.log(fields.quocGia);
        console.log(fields)
        var newpath = __dirname+"/public/musics/"+rand;
        var urlMp3 = path.resolve(newpath).replace(/\\/g,'/');
        /*
        var data = {
            idM: "M"+rand,
            tenBh :fields.tenBh,
            tacGia: fields.tacGia,
            caSy: fields.caSy,
            urlMp3: urlMp3
        }
        musicDAO.insertMusic(data,function (kq) {
            if(kq==false){
                res.send("Lỗi upload!");
            }
            else{
                fs.rename(oldpath,newpath,function (err) {
                    if(err)
                        res.send("Lỗi upload!");
                    else{
                        res.send("Uploaded bài hát:"+tenBh+", tác giả: "+fields.tacGia+", ca sỹ : "+fields.caSy);
                    }
                })
            }
        });

*/
        console.log(newpath);
        var a = "success";
        res.render('upload',{data: a});
    })
})
=======
>>>>>>> 432356a8c72c19e9108ba81b218fdf654eeff15d
=======
>>>>>>> d5d2149ad12dde55d2ea888947ec1047ba964330
module.exports = router;
