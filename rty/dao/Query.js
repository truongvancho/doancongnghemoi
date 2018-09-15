var AWS = require("aws-sdk");
var dao = require('./MusicDAO');
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

var data = {
    idM: "M0005",
    tenBh: 'abc',
    tacGia: 'abc',
    caSy: 'abc',
    urlMp3: 'abc'
}
dao.insertMusic(data,function(kq){
    if(kq==true)
        console.log("Add thành công!");
});
docClient.scan(params,function(err,data){
    if(err)
    console.log(err);
    else{
        data.Items.forEach(function(item){
            console.log(item);
        })
    }
})
