const { twitterKeys, blueMixKeys } = require('./api_keys');
const { emotionsExtract, sentimentAverage } = require('./results_analyzer.js');
const { resultPrinter } = require('./terminal_printer');
const ntwitter = require('ntwitter');
const colors = require('colors');
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const jsonfile = require('jsonfile');
const outputFile = './results.json';

//Credentials - create a api_keys.js file
const twitter = new ntwitter(twitterKeys);
const toneAnalyzer = new ToneAnalyzerV3(blueMixKeys);

//User Settings (Max number for EXAMPLE ONLY)
const tags = ['Trump'];
const numberOfTweets = 10;
console.log(
  `Analyizing next ${numberOfTweets} Tweets containg: ${[
    ...tags
  ]} (using Bluemix)`
);

//Sentiment Analyizing on BlueMix
function sentimentScore(text) {
  const textToAnalyize = text;
  return new Promise((resolve, reject) => {
    toneAnalyzer.tone(
      {
        text: textToAnalyize
      },
      function(err, data) {
        if (err) {
          reject(err);
        }
        if (data === null) {
        } else {
          resolve(data.document_tone.tone_categories);
        }
      }
    );
  });
}

//EXAMPLE Result
let results = [];
twitter.stream('statuses/filter', { track: tags }, function(stream) {
  stream.on('data', function(tweet) {
    sentimentScore(tweet.text).then(sentiment => {
      let analyizedTweet = {
        sentiment,
        tweet: tweet.text,
        time_stamp: Date(tweet.created_at)
      };
      console.log(tweet.text.grey);
      results.push(analyizedTweet);
      if (results.length === numberOfTweets) {
        const sentimentEmotions = results.map(result => {
          return emotionsExtract(result);
        });
        jsonfile.writeFile(outputFile, results, { spaces: 2 }, function(err) {
          if (err) {
            console.error(err.red);
          } else {
            resultPrinter(sentimentEmotions);
          }
          process.exit();
        });
      }
    });
  });
});
