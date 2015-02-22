'use strict';

var GibberishAES = require("../node_modules/gibberish-aes/dist/gibberish-aes-1.0.0"),
    querystring = require('querystring'),
    https = require('https'),
    cheerio = require('cheerio');

function random_string(C) {
    if (C === null) {
        C = 16;
    }
    var B = "abcdefghijklmnopqrstuvwxyz0123456789";
    var D = "";
    var pos;
    for (var A = 0; A < C; A++) {
        pos = Math.floor(Math.random() * B.length);
        D += B.charAt(pos);
    }
    return D;
}

function cipher(A, B) {
    return GibberishAES.enc(B, A);
}

exports.crypt = function(note) {
    var key = random_string(null),
        enc = cipher(key, note);

    var post_data = querystring.stringify({
      "body" : enc,
      "sender_email": "",
      "reference": ""
    });

    var post_options = {
        host: "privnote.com",
        port: 443,
        path: "/",
        method: 'POST',
        headers: {
            'Content-Length': post_data.length,
            "Origin": "https://privnote.com",
            "Accept-Language": "en-US,en;q=0.8",
            "User-Agent": "privnote-cli/0.0.1 (https://github.com/nonrational/privnote-cli)",
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
            var $ = cheerio.load(html),
                baseLink = $('#destroylink').attr('href');

            console.log(baseLink + "#" + key);
        });

    });

    post_req.write(post_data);
    post_req.end();
};
