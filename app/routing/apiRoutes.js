var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require("path");

router.get("/api/friends", function(req, res) 
{
    res.json(getAllUsers());
});

router.post("/api/friends", function(req, res) 
{
    var surveyData = req.body;
    var allUsers = getAllUsers();
    var bestFriend = null;

    if (allUsers.length > 0)
    {
        bestFriend = mostCompatible(allUsers, surveyData);
        putNewUser(allUsers, surveyData);
        res.json(bestFriend);
    }
    else
    {
        putNewUser(allUsers, surveyData);
        res.json(null);
    }
});

function mostCompatible(allUsers, surveyData)
{
    var scores = surveyData.scores;
    var closestMatch = -1;
    var totalDifference = 100;

    for (user in allUsers)
    {
        var tempDifference = 0;
        var tempScores = allUsers[user].scores;

        for (question in tempScores)
        {
            tempDifference += Math.abs(parseInt(scores[question]) - parseInt(tempScores[question]));
        }
        if (tempDifference < totalDifference)
        {
            totalDifference = tempDifference;
            closestMatch = user;
        }
    }
    if (closestMatch > -1)
    {
        return allUsers[closestMatch];
    }
    else 
        return [];
}

function getAllUsers()
{
    var rawdata = fs.readFileSync(path.join(__dirname, "..", "data", "friends.js"), "utf8");
    if (rawdata.length > 0)
        return JSON.parse(rawdata);
    else return [];
}

function putNewUser(allUsers, userData)
{
    allUsers.push(userData);
    fs.writeFile(path.join(__dirname, "..", "data", "friends.js"), JSON.stringify(allUsers), function(err) {if (err) throw err;});
}

module.exports = router;