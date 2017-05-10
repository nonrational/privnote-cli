'use strict';

var querystring = require('querystring'),
    https = require('https'),
    privnote_common = require('../lib/privnote-common.js');

exports.crypt = function(note, fn) {
    var key = privnote_common.make_password(),
        enc = privnote_common.encrypt(note, key);

    var version = require('../package.json').version;

    var post_data = querystring.stringify({
      "data" : enc,
      "has_manual_pass": false,
      "duration_hours" : 0,
      "data_type": "T",
      "notify_email": null,
      "notify_ref" : null
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
            "User-Agent": "privnote-cli/" + version + " (https://github.com/nonrational/privnote-cli)",
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
            var result = JSON.parse(data);
            fn(result['note_link'] + "#" + key);
        });
    });

    post_req.write(post_data);
    post_req.end();
};
