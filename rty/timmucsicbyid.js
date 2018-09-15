var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

AWS.config.accessKeyId="AKIAIIVIX2PARDW5YT2A";
AWS.config.secretAccessKey="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";
var docClient = new AWS.DynamoDB.DocumentClient();
var a=new Array();
var params = {
    TableName: "Musics",
    KeyConditionExpression:"#yr=:yyyy",
    ExpressionAttributeNames:{
      "#yr":"musicId"
    },
    ExpressionAttributeValues:{
        ":yyyy":"M0001"
    }
};
docClient.query(params,function (err,data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log(item);
        });
    }
});
