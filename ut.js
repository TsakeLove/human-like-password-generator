const path = require("path");
const fs = require("fs");
const generatePassword = require("password-generator");
const crypto = require("crypto");
const argon2 = require("argon2");
const top25 = [
    "123456",
    "123456789",
    "12345",
    "qwerty",
    "password",
    "12345678",
    "111111",
    "123123",
    "1234567890",
    "1234567",
    "qwerty123",
    "000000",
    "1q2w3e",
    "aa12345678",
    "abc123",
    "password1",
    "1234",
    "qwertyuiop",
    "123321",
    "password123",
    "1q2w3e4r5t",
    "iloveyou",
    "654321",
    "666666",
    "987654321",
];
const hundredkPasses = fs
    .readFileSync(path.resolve(__dirname, "./common100k.txt"), "utf8")
    .split("\n");

function* algorithmSelector() {
    const ranges = [
        [0, 4],
        [5, 14],
        [14, 29],
        [30, 100],
    ];
    const isInRange = (v, s, e) => v >= s && v <= e;
    const findRange = (v) =>
        ranges.findIndex((r) => isInRange(v, r[0], r[1]));
    while (true) {
        yield findRange(Math.round(Math.random() * 100));
    }
}

function getRandom25ListPass() {
    return top25[Math.round(Math.random() * (top25.length - 1))];
}

function getRandom100kPass() {
    return hundredkPasses[
        Math.round(Math.random() * (hundredkPasses.length - 1))
        ];
}

const randomNumber = () => Math.round(Math.random() * 10).toString();
const randomLetter = () =>
    String.fromCharCode(Math.random() * 25 + [65, 97][Math.round(Math.random())]);

function getSuperRandomPass() {
    const length = Math.round(Math.random() * 2 + 6);
    const res = [];
    for (let i = 0; i < length; i++) {
        Math.round(Math.random())
            ? res.push(randomNumber())
            : res.push(randomLetter());
    }
    return res.join("");
}

function getHumanLikeRandomPass() {
    return generatePassword(8) + generatePassword(4, true, /[0-9]/);
}

const allAlgos = [
    getRandom25ListPass,
    getRandom100kPass,
    getSuperRandomPass,
    getHumanLikeRandomPass,
];

function generateNPasswords(n) {
    const result = [];
    const getAlgoIndex = algorithmSelector();
    for (let i = 0; i < n; i++) {
        const index = getAlgoIndex.next().value;
        result.push(allAlgos[index]());
    }
    return result;
}

function hashWithMD5(passwords) {
    const hashMD5 = crypto.createHash("md5");
    return passwords.map((p) => hashMD5.update(p).copy().digest("hex"));
}

async function hashWithArgon2(passwords) {
    const results = [];

    for (const pass in passwords) {
        let hash = await argon2.hash(pass);
        results.push(hash);
    }
    return results;
}

function writeHashesToFile(hashes, fileName) {
    if (!fs.existsSync(path.resolve(__dirname, "output")))
        fs.mkdirSync(path.resolve(__dirname, "output"));
    fs.writeFileSync(
        path.resolve(
            __dirname + "/output/",
            `${fileName}_${new Date().toISOString().replace(/:/g, "_")}.csv`
        ),
        hashes.join("\n")
    );
}

module.exports = {hashWithMD5, writeHashesToFile, generateNPasswords, hashWithArgon2}
