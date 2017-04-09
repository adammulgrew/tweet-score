require('dotenv').config();

const express = require('express'),
      path = require('path'),
      bodyParser = require('body-parser'),
      expressNunjucks = require('express-nunjucks');
      app = express(),  
      port = process.env.PORT || 3000,
      router = express.Router(),
      tweetScore = require('./libs/tweet-score');

app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/src/templates');

app.set('view engine', 'html');

const njk = expressNunjucks(app, {
    watch: app.get('env') === 'development',
    noCache: app.get('env') === 'development',
    globals: {title: 'Tweet Score'}
});

app.get('/', function(req, res){
    res.render('views/index');
});

app.post('/search', function(req, res){

    tweetScore(req.body.q)
        .then(function(output){
            res.render('views/search', { 
                q: req.body.q,
                score: (output.sentiment * 10).toFixed(1),
                keywords: output.keywords
            });
        });
    
});

app.listen(port, function() {
    console.log('server listening on port ' + port);
});

