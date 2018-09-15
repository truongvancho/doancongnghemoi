var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});
AWS.config.accessKeyId="AKIAIIVIX2PARDW5YT2A";
AWS.config.secretAccessKey="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";
var docClient = new AWS.DynamoDB.DocumentClient();
exports.getAllMusic = function(){
    var params = {
        TableName: "Musics"
    }
    docClient.scan(params,function (err,data) {
        if(err){
            console.log("Err"+err);
        }
        else{
            return data;
        }
    })
    return count;
}
exports.getMusicById = function(id,callback){
    var params = {
        TableName:"Musics",
        Key:{
            musicId: id
        }
    }
    docClient.get(params,function (err,data) {
        if(err)
            console.log("Err: "+err);
        else{
            callback(err,data);
        }
    })
}
exports.insertMusic = function (data,callback) {
    var kq = false;
    var music = {
        TableName: "Musics",
        Item: {
            musicId: data.idM,
            info:{
                tenBh: data.tenBh,
                tacGia: data.tacGia,
                caSy: data.caSy,
                urlMp3: data.urlMp3
            }
        }
    }
    docClient.put(music,function (err) {
        if (err){
            console.log("err:"+ err);
        }
        else{
            kq = true;
            callback(kq);
        }
    })
}

