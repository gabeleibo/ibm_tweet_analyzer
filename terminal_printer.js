const { sentimentAverage } = require('./results_analyzer.js');

function resultPrinter(sentimentEmotions) {
  console.log('Anaylsis Complete\nOutput JSON saved as "data.json"');
  console.log('-'.repeat(15) + '\nSentiment Summary:\n' + '-'.repeat(15));
  const averages = sentimentAverage(sentimentEmotions);
  Object.keys(averages).forEach(emotion => {
    console.log(
      `${emotion[0].toUpperCase()}${emotion.substring(1)}: ${Math.round(
        averages[emotion] * 100,
        2
      )}%
    `
    );
  });
}

module.exports.resultPrinter = resultPrinter;
