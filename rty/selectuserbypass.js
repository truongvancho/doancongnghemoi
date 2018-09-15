var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

AWS.config.accessKeyId="AKIAIIVIX2PARDW5YT2A";
AWS.config.secretAccessKey="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";
var docClient = new AWS.DynamoDB.DocumentClient();
var params2={
    TableName:"User",
    KeyConditionExpression:"#yr=:yyyy and pass=:pa",
    ExpressionAttributeNames:{
      "#yr":"userName"
        ,"pass":"info.password"


    },
    ExpressionAttributeValues:{
        ":yyyy":"truong",
        ":pa":"123456"


    }

};
docClient.query(params2,function (err, data) {
    if(err){
        console.log(err);
    }
    else{
        data.Items.forEach(function (item) {
            console.log(item);
        })
    }
});