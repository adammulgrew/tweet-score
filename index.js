require('dotenv').config();
var request = require('request');
var ENDPOINT = 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/';
var KEY = 'f495997a78dd437ca4eb40ea4932aee8';
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var getAverageSentiment = function(data) {
    request({
        headers: {
            'Ocp-Apim-Subscription-Key': KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        url: `${ENDPOINT}sentiment`,
        method: 'POST',
        json: true,
        body: {"documents" : data },
    }, (error, response, body) => {
        console.log(body.documents.map(item => item.score).reduce((a, b) => a + b, 0) / 100);
    });
};

client.get('search/tweets', {q: 'Ghost in the Shell, #GhostintheShell -filter:retweets', lang: 'en', count: 100}, function(error, tweets, response) {
    if(error) {
        console.log(error);
        return;
    }

    getAverageSentiment(tweets.statuses.map(function(tweet, i){ 
        return  {
             "language": "en",
             "id": i,
             "text": tweet.text
         }
    }));

});


// var data =  {
//      "documents": [
//          {
//              "language": "en",
//              "id": "1",
//              "text": "Slickly stylish & synthetically streamlined. A superb sci-fi thriller that stimulates the eyes & mind."
//          },
//          {
//              "language": "en",
//              "id": "2",
//              "text": "GHOST IN THE SHELL: pretty cool. Wish the action had been better, but pretty cool."
//          },
//          {
//              "language": "en",
//              "id": "3",
//              "text": "Ghost in the Shell was spectacularly bad. Then.....spider tank!!! I nearly wet myself. Hate dissing movies but this was seriously poor."
//          }
//      ]
//  };







 // var TYPES = [
 //     'sentiment',
 //     'keyPhrases'
 // ];
// TYPES.forEach(type => {
//     request({
//         headers: {
//             'Ocp-Apim-Subscription-Key': KEY,
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//         },
//         url: `${ENDPOINT}${type}`,
//         method: 'POST',
//         json: true,
//         body: data
//     }, (error, response, body) => {
//         body.documents.reduce(item => {
//             return item.score ? item.score : 0
//             //if(item.score) console.log(item.score);
//             // if(item.keyPhrases) item.keyPhrases.forEach(phrase => {
//             //     console.log(phrase);
//             // });

//             //console.log(item.score.reduce(function(a,b){ return a + b;}, 0) / 15);
//         }, 0);
//     });
// });
