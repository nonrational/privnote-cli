var GibberishAES = require("./gibberish-aes.js"),
    querystring = require('querystring'),
    // http = require('http'),
    https = require('https'),
    cheerio = require('cheerio');


function random_string(C) {
    if (C === null) {
        C = 16
    }
    var B = "abcdefghijklmnopqrstuvwxyz0123456789";
    var D = "";
    for (var A = 0; A < C; A++) {
        pos = Math.floor(Math.random() * B.length);
        D += B.charAt(pos)
    }
    return D
}

function cipher(A, B) { return GibberishAES.enc(B, A); }

var key = random_string(null),
    enc = cipher(key, "secret text");

// console.log("#" + key);
// console.log("body=" + enc);

var post_data = querystring.stringify({
  "body" : enc,
  "sender_email": "nortona@gmail.com",
  "reference": "testing " + new Date()
});

var post_options = {
    host: "privnote.com",
    port: 443,
    path: "/",
    method: 'POST',
    headers: {
        'Content-Length': post_data.length,
        "Cookie": "sessionid=a323ded53f943af9eb9e1595428d18f7;",
        "Origin": "https://privnote.com",
        "Accept-Language": "en-US,en;q=0.8",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.146 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json, text/javascript, */*",
        "Referer": "https://privnote.com/",
        "X-Requested-With": "XMLHttpRequest",
        "Connection": "keep-alive",
        "DNT": "1"
    }
};

var post_req = https.request(post_options, function(res) {

    res.setEncoding('utf8');
    res.on('data', function (data) {

        var html = data.replace(/\\n/g,'').replace(/\\"/g,'"');
        console.log(html);

        var $ = cheerio.load(html),
            baseLink = $('#destroylink').attr('href');

        console.log(baseLink);
        console.log(baseLink + "#" + key);
    });

});

post_req.write(post_data);
post_req.end();
