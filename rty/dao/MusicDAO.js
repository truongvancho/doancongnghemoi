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
    return "";
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
            console.log(data);
            callback(err,data);
        }
    })
}
var isTrung = function(id,callback){
    var trung = false;
    var params={
        TableName: "Musics",
        FilterExpression: "#id = :idM",
        ExpressionAttributeNames: {
            "#id": "musicId",
        },
        ExpressionAttributeValues: {
            ":idM": id
        }
    }
    docClient.scan(params,function(err,data){
        if(err){
            console.log(err);
            callback(err,trung);
        }

        else{
            var count=0;
            data.Items.forEach(function(item){
                count++;
            })
            if(count>0){
                trung = true;
                callback(err,trung);
            }   
            else{
                callback(err,trung);
            }
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
                quocGia: data.quocGia,
                urlMp3: data.urlMp3
            }
        }
    }
    isTrung(data.idM,function(err,trung){
        if(err)
        console.log(err);
        if(trung==false){
            docClient.put(music,function (err) {
                if (err){
                    console.log(err);
                    kq = false;
                    callback(kq);
                }
                else{
                    kq = true;
                    callback(kq);
                }
            })
        }
        else{
            kq=false;
            callback(kq);
        }
    })
    
}

