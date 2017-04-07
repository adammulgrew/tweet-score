var request = require('request');
var ENDPOINT = process.env.MCS_ENDPOINT;
var KEY = process.env.MCS_KEY;
var Promise = require('bluebird');
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var queryCognitiveServices = function(data, service){
    return new Promise(function(resolve, reject){
         request({
            headers: {
                'Ocp-Apim-Subscription-Key': KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            url: `${ENDPOINT}${service}`,
            method: 'POST',
            json: true,
            body: {"documents" : data },
        }, (error, response, body) => {
            if(error) reject(error);
            resolve(body.documents);
        });
    });
};

var getAverageSentiment = function(tweets){
    return queryCognitiveServices(tweets, 'sentiment')
};
var getKeywords = function(tweets){
    return queryCognitiveServices(tweets, 'keyPhrases')
};

var getTweets = function(q){
    return new Promise(function(resolve, reject){
        client.get('search/tweets', {q: q + '  -filter:retweets', lang: 'en', count: 100}, function(error, tweets, response) {
            if(error) reject(error);

            resolve(tweets.statuses.map(function(tweet, i){ 
                return  {
                    "language": "en",
                    "id": i,
                    "text": tweet.text
                }
            }));
        });
    });
};

module.exports = function(q, cb){
    return new Promise(function(resolve, reject){
        getTweets(q)
            .then(function(tweets){

                var output = {
                    sentiment: 0,
                    keywords: []
                };

                getAverageSentiment(tweets)
                    .then(function(sentiment){
                        output.sentiment = sentiment.map(item => item.score).reduce((a, b) => a + b, 0) / sentiment.length;
                        
                        getKeywords(tweets)
                            .then(function(res){
                                output.keywords = res.reduce((a, b) => {
                                    return a.concat(b.keyPhrases);
                                }, []);
                                resolve(output);
                            });

                    });

            }, function(err){
                console.log(err);
            });
    });
};



