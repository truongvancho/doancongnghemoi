var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});
AWS.config.accessKeyId="AKIAIIVIX2PARDW5YT2A";
AWS.config.secretAccessKey="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";
var docClient = new AWS.DynamoDB.DocumentClient();
var allUsers = JSON.parse(fs.readFileSync('users.json','utf8'));
allUsers.forEach(function(user) {
    var users = {
        TableName: "User",

        Item: {
            "userName": user.userName,
            "info": user.info
        }
    };
    docClient.put(users, function(err, data) {
        if(err){
            console.log("Error:"+JSON.stringify(err));
        }
        else{
            console.log("Put success!:"+user.userName);
        }
    });
});
dynamodb.createTable(users, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});