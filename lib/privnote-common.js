// https://privnote.com/static-ffcdb2d/js-min/common.js
// Privnote Ver. 1.1-24-gffcdb2d / 2016-09-27 | © Ikatu - http://www.ikatu.us/privnote.html

var GibberishAES = require("gibberish-aes/dist/gibberish-aes-1.0.0");

var common = module.exports = function() {
    var auto_pass_length = 9;
    var auto_pass_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    var encrypt = function(data, password) {
        return GibberishAES.enc(data, password)
    }
    var decrypt = function(data, password) {
        return GibberishAES.dec(data, password)
    }
    var make_password = function() {
        var length = auto_pass_length;
        var chars = auto_pass_chars;
        var str = "";
        for (var i = 0; i < length; i++) {
            pos = Math.floor(Math.random() * chars.length);
            str += chars.charAt(pos);
        }
        return str;
    }
    var mangle = function(text) {
        var te = new TextEncoderLite();
        var u8a = te.encode(text);
        return base64js.fromByteArray(u8a);
    }
    var demangle = function(text) {
        var td = new TextDecoderLite();
        var u8a = base64js.toByteArray(text);
        return td.decode(u8a);
    }
    var score_password = function(pass) {
        if (!pass) return 0;
        var score = 0;
        var letters = new Object();
        for (var i = 0; i < pass.length; i++) {
            letters[pass[i]] = (letters[pass[i]] || 0) + 1;
            score += 5.0 / letters[pass[i]]
        }
        var variations = {
            digits: /\d/.test(pass),
            lower: /[a-z]/.test(pass),
            upper: /[A-Z]/.test(pass),
            other: /\W/.test(pass)
        }
        var variationCount = 0;
        for (var check in variations) {
            variationCount += (variations[check] == true) ? 1 : 0;
        }
        score += (variationCount - 1) * 10;
        return parseInt(score)
    }
    var pass_strength = function(pass) {
        var score = score_password(pass)
        if (score > 90) return "very_strong";
        else if (score > 80) return "strong";
        else if (score > 60) return "good";
        else if (score >= 30) return "weak";
        else return "very_weak";
    }
    var is_email = function(email) {
        var re = RegExp("^([a-zA-Z0-9\\._\\-\\+%]+)@([a-zA-Z0-9\\.\\-]+)\\.([a-zA-Z]){2,24}$")
        return (email.match(re) != null)
    }
    var urlmangle = function(text) {
        var m = mangle(text)
        return m.replace(/=/g, '')
    }
    var urldemangle = function(text) {
        var pad = 4 - (text.length % 4)
        if (pad == 1) text = text + '=';
        else if (pad == 2) text = text + '==';
        else if (pad == 3) text = text + '===';
        return demangle(text)
    }
    return {
        auto_pass_length: auto_pass_length,
        encrypt: encrypt,
        decrypt: decrypt,
        make_password: make_password,
        mangle: mangle,
        demangle: demangle,
        score_password: score_password,
        pass_strength: pass_strength,
        is_email: is_email,
        urlmangle: urlmangle,
        urldemangle: urldemangle
    }
}();
