//Extracts only emotional sentiment
function emotionsExtract({ sentiment }) {
  let sentimentEmotion = {};
  const emotions = ['anger', 'disgust', 'fear', 'joy', 'sadness'];
  sentiment[0].tones.forEach((tone, index) => {
    sentimentEmotion[emotions[index]] = tone.score;
  });
  return sentimentEmotion;
}

//Averages emotional sentiment
function sentimentAverage(tweetEmotions) {
  let sentimentAverage = {};
  Object.keys(tweetEmotions[0]).forEach(emotion => {
    sentimentAverage[emotion] = tweetEmotions
      .map(tweetEmotion => {
        return tweetEmotion[emotion];
      })
      .reduce((sum, amount, index) => {
        return (sum * index + amount) / (index + 1);
      }, 0);
  });
  return sentimentAverage;
}

module.exports = {
  emotionsExtract,
  sentimentAverage
};
