var createError = require('http-errors');
var express = require('express');
var musicDAO = require("./dao/MusicDAO");
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var formidable = require('formidable');
var path = require("path");
var fs = require("fs");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//code controler

app.get('/',function (req,res) {
    res.render('index',{title: "Index"});
})
app.get('/upload',function (req,res) {
    res.render('upload',{title: "Upload Music"});
})
app.get('/id/12345',function (req,res) {
    var ms = musicDAO.getMusicById('M847666',function (err,data) {
        if(err)
            res.send("Lỗi");
        else{
            console.log(data);
            res.send("Data: "+JSON.stringify(data));
        }
    });
});
app.post('/insert',function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req,function (err, fields, files) {
        var tenBh = fields.tenBh;
        var oldpath = files.file.path;
        rand = Math.floor(Math.random()*Math.floor(1000000));

        var newpath = __dirname+"/public/musics/"+rand;
        var urlMp3 = path.resolve(newpath).replace(/\\/g,'/');
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


        console.log(newpath);

    })
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
