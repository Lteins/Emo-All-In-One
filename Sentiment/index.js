var jsonfile = require('jsonfile')
var check = require("./check");
var additor = require("./add");
const util = require('util');
var Twitter = require('twitter-node-client').Twitter;

var userJson = "../data/data1.json";
var lib = "../data/library.json";

var pre_id = null;
var regular_check  = function(){
    console.log("Begin a new round of check");
    jsonfile.readFile(userJson, function(err, obj) {
        if (!err){
            //Callback functions        
            var twitter_data = JSON.parse(obj.twitter);
            console.log(twitter_data);       

            //Get this data from your twitter apps dashboard
            var twitter_init = {
                "consumerKey": "KTluEZY5hFSuDVVLGvNOqDdBV",
                "consumerSecret": "IPNS5kqhu8XCdx0cFRUXbQA3Z9n1FjkBdlr4wJM02QmGl1rD1b",
                "accessToken": twitter_data.oauth_token,
                "accessTokenSecret": twitter_data.oauth_token_secret,
                "callBackUrl": "https://oauth.io/auth"
            };
            console.log(twitter_init);
            var twitter = new Twitter(twitter_init);
            var error = function (err, response, body) {
                console.log('ERROR: ', err);
            };
            var success = function (data) {
                data = JSON.parse(data);
                if (pre_id){
                    if (data[0]['id'] != pre_id){
                        console.log("We do need to check");
                        pre_id = data[0]['id'];
                        var cut_index = data[0]['text'].indexOf("http");
                        var text="";
                        if (cut_index > 0)
                            text = data[0]['text'].substring(0,cut_index);
                        else
                            text = data[0]['text'];

                        console.log("DEBUG: SCUCEED IN EXTRACTING THE TEXT");
                        console.log(text);
                        check.analyze(text, function(result){
                            console.log('-----------------');
                            console.log("Result is: ");
                            console.log(result);
                            result = JSON.parse(result);
                            score = result.documents[0].score;
                            jsonfile.readFile(lib, function(err, obj){
                                var diff = 0;
                                for (var i=0;i<obj.length;i++){
                                    diff = score - obj[i].emoScore;
                                    if (diff <=0)
                                        break;
                                }
                                console.log("The ideal song is");
                                console.log(obj[i]);
                                additor.add(obj[i].spotify_id);
                            });
                            console.log('-----------------')
                        })
                    }else{
                        console.log("We do not need to check");
                    }
                }else{
                    console.log("We do need to check");
                    pre_id = data[0]['id'];
                    var cut_index = data[0]['text'].indexOf("http");
                    var text="";
                    if (cut_index > 0)
                        text = data[0]['text'].substring(0,cut_index);
                    else
                        text = data[0]['text'];

                    console.log("DEBUG: SCUCEED IN EXTRACTING THE TEXT");
                    console.log(text);
                    check.analyze(text, function(result){
                        console.log('-----------------')
                        console.log("Result is: ");
                        console.log(result);
                        result = JSON.parse(result);
                        score = result.documents[0].score;
                        jsonfile.readFile(lib, function(err, obj){
                            var diff = 0;
                            for (var i=0;i<obj.length;i++){
                                diff = score - obj[i].emoScore;
                                if (diff <=0)
                                    break;
                            }
                            console.log("The ideal song is");
                            console.log(obj[i]);
                            additor.add(obj[i].spotify_id);
                        });
                        console.log('-----------------')
                    })
                }
            };
            var parameters = {"user_id": twitter_data.user_id,'count': 1};
            twitter.getUserTimeline(parameters, error, success);
        }else{
            console.log(err);

        }
    })    
}
    

setInterval(regular_check, 5000);
