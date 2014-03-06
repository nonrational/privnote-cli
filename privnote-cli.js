var GibberishAES = require("./gibberish-aes.js"),
    querystring = require('querystring'),
    https = require('https'),
    cheerio = require('cheerio'),
    fs = require('fs');

function usage(){ console.error(
"Usage:\n\tnode privnote-cli.js <note>\n\techo <note> | node privnote-cli.js\n\
\tnode privnote-cli.js << EOF\n\
\t\t<note-part-1>\n\
\t\t<note-part-2>\n\
\tEOF"
);}

try {

    args = process.argv

    while(!!args[0] && (!!args[0].match(/node/) || !!args[0].match(/privnote-cli.js/))){
        args.shift()
    }

    if(args.length == 0) {

        var content = '';
        process.stdin.resume();
        process.stdin.on('data', function(buf) { content += buf.toString(); });
        process.stdin.on('end', function() {
            sendPrivNote(content);
        });

    } else {
        sendPrivNote(args.join(' '));
    }

} catch(err) {
    console.error("You must provide your message as an argument or through stdin.");
    console.error(err);
}


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

function cipher(A, B) {
    return GibberishAES.enc(B, A);
}

function sendPrivNote(note){
    if (note === "") {
        usage()
        process.exit()
    }
    // console.log("note=" + note);

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
            var $ = cheerio.load(html),
                baseLink = $('#destroylink').attr('href');

            console.log(baseLink + "#" + key);
        });

    });

    post_req.write(post_data);
    post_req.end();
}
