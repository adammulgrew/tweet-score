require('dotenv').config();
var Twitter = require('twitter');
var jsonfile = require('jsonfile');


var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// var stream = client.stream('statuses/filter', {track: 'Ghost in the Shell, #GhostintheShell'});
// stream.on('data', function(event) {
//   console.log(event && event.text);
// });
 
// stream.on('error', function(error) {
//   throw error;
// });

var file = './data.json';
client.get('search/tweets', {q: 'Ghost in the Shell, #GhostintheShell', lang: 'en'}, function(error, tweets, response) {
   console.log(tweets);
	   jsonfile.writeFile(file, tweets.statuses.map(function(tweet, i){ 
	   	return  {
             "language": "en",
             "id": i,
             "text": tweet.text
         }
	   }), function (err) {
		  	console.error(err)
		});

});
 

 
