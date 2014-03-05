GibberishAES = require("./gibberish-aes.js");

var key = random_string(32), enc = cipher(key,"password");

console.log("key=" + key);
console.log("enc=" + enc)

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
    console.log("ciphering...")
    return GibberishAES.enc(B, A)
}
