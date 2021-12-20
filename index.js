const {writeHashesToFile} = require("./ut");
const {hashWithMD5} = require("./ut");
const {generateNPasswords} = require("./ut");
const {hashWithArgon2} = require("./ut");
console.log("Start generate");
const passformd5 = generateNPasswords(100000);
console.log("Created passwords");
const md5hashes = hashWithMD5(passformd5);
console.log("hashed with md5");
writeHashesToFile(md5hashes, "weak");
console.log("Written to file");
const passforargon = generateNPasswords(100000);
console.log("Created passwords");
hashWithArgon2(passforargon).then(result => {
    console.log(result);
    console.log("hashed with argon2");
    writeHashesToFile(
        result,
        "strong_w_salt"
    );
    console.log("Written to file");
});


