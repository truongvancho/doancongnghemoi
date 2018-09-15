var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});
AWS.config.accessKeyId="AKIAIIVIX2PARDW5YT2A";
AWS.config.secretAccessKey="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";
var dynamodb = new AWS.DynamoDB();

var users = {
    TableName : "User",
    KeySchema: [
        { AttributeName: "userName", KeyType: "HASH"}

    ],
    AttributeDefinitions: [
        { AttributeName: "userName", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};
var musics = {
    TableName: "Musics",
    KeySchema: [
        {AttributeName: "musicId", KeyType: "HASH"}
    ],
    AttributeDefinitions: [
        { AttributeName: "musicId", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
}
var playlists = {
    TableName: "Playlists",
    KeySchema: [
        { AttributeName: "userName", KeyType: "HASH"},  //Partition key
        { AttributeName: "playlistName", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "userName", AttributeType: "S" },
        { AttributeName: "playlistName", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
}
dynamodb.createTable(users, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
dynamodb.createTable(musics, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
dynamodb.createTable(playlists, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});