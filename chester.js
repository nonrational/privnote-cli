// chester.js - cheerio tester

fs = require('fs'),
cheerio = require('cheerio')

fs.readFile('example.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var $ = cheerio.load(data.replace(/\\n/g,'').replace(/\\"/g,'"')),
    baseLink = $('#destroylink').attr('href');
  console.log(baseLink)

});