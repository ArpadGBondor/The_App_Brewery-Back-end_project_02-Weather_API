/* eslint linebreak-style: ["error", "windows"]*/
require('dotenv').config();

const consoleStamp = require('console-stamp');
consoleStamp(console, {
  pattern: 'HH:MM:ss.l',
  colors: {
    stamp: 'yellow',
    label: 'blue'
  }
});

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const util = require('util');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
  // if (Object.prototype.hasOwnProperty.call(req.query, "cityName")){
  //   log("query: ", req.query);
  // }
});
app.post('/', function(req, res) {
  // log('req.body.cityName: ', req.body.cityName);
  //
  const appID = process.env.WEATHER_API_KEY;
  const query = encodeURI(req.body.cityName);
  const units = 'metric';
  const apiurl = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=' + appID + '&units=' + units;

  // log('HTTPS GET: ', apiurl);
  https.get(apiurl, function(response) {
    // log('Status code: ', response.statusCode);

    const answer = [];

    response.on('data', function(chunk) {
      answer.push(chunk);
      // log('Data chunk: ', chunk);
    });

    response.on('end', function() {
      const data = answer.join('');
      const weatherData = JSON.parse(data);
      // log('Data object: ', weatherData);
      // log('Temperature: ', weatherData.main.temp);
      // log('Description: ', weatherData.weather[0].description);

      res.write('<html>');
        res.write('<head>');
          res.write('<meta charset="utf-8">');
          res.write('<title>Weather in ' + req.body.cityName + '</title>');
          res.write('<style media="screen">');
            // Challenge footer style
            res.write(' .attribution { font-size: 11px; text-align: center; margin: 0;}');
            res.write(' .attribution a { color: hsl(228, 45%, 44%); }');
          res.write('</style>');
          // Bootstrap
          res.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">');
        res.write('</head>');
        res.write('<body class="text-center">');
          res.write('<h1>Weather in ' + req.body.cityName + '</h1>');
          res.write('<div class="mt-5 mb-5">');
            res.write('<p> The temperature is ' + weatherData.main.temp + '°C. </p>');
            res.write('<p> The weather is currently ' +
              weatherData.weather[0].description + '. </p>');
            res.write('<img src = "http://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@2x.png">');
          res.write('</div>');
          res.write('<footer>');
            res.write('<p class="attribution">Challenge created by <a href="https://www.appbrewery.co/" target="_blank">The App Brewery</a>.</p>');
            res.write('<p class="attribution">Coded by <a href="https://arpadgbondor.github.io/CV/" target="_blank">Árpád Gábor Bondor</a> in 2020.</p>');
          res.write('</footer>');
        res.write('</body>');
      res.write('</html>');
      res.send();
    });
  }).on('error', function(error) {
    // log('Error: ', error);
    console.error(error.message);
  });
});

app.listen(port, () => log('Server is running on http://localhost:' + port + '/?cityName=Pitlochry'));

/**
 * log - colorfull console.log() for "description: object" style logging
 *
 * @param  {string} msg description of the object
 * @param  {any}    obj will be logged using util.inspect()
 * @return {undefined}
 */
function log(msg, obj) {
  if (typeof obj === 'undefined') {
    return console.log('\x1b[36m' + msg + '\x1b[0m');
  }
  return console.log('\x1b[36m' + msg + '\x1b[0m' +
    util.inspect(obj, {
      colors: true
    }));
}
