var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});
AWS.config.accessKeyId="AKIAIIVIX2PARDW5YT2A";
AWS.config.secretAccessKey="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";
var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing movies into DynamoDB. Please wait.");
var allUsers = JSON.parse(fs.readFileSync('users.json','utf8'));
var allMuscics = JSON.parse(fs.readFileSync('musics.json','utf8'));
var allPlaylist = JSON.parse(fs.readFileSync('playlists.json','utf8'));
var allMovies = JSON.parse(fs.readFileSync('moviedata.json', 'utf8'));
allUsers.forEach(function(user) {
    var users = {
        TableName: "Users",
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
allMuscics.forEach(function (music) {
    var musics = {
        TableName: "Musics",
        Item: {
            "musicId": music.musicId,
            "info": music.info
        }
    };
    docClient.put(musics, function(err, data) {
        if(err){
            console.log("Error:"+JSON.stringify(err));
        }
        else{
            console.log("Put success!:"+music.musicId);
        }
    });
});
allPlaylist.forEach(function (playlist) {
    var playlists = {
        TableName: "Playlists",
        Item: {
            "userName": playlist.userName,
            "playlistName": playlist.playlistName,
            "musicIdList": playlist.musicIdList
        }
    };
    docClient.put(playlists, function(err, data) {
        if(err){
            console.log("Error:"+JSON.stringify(err));
        }
        else{
            console.log("Put success!:"+playlist.playlistName);
        }
    });
})