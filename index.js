const request = require('./request.js');
const cheerio = require("cheerio");
const fs = require('fs');
const emitter = require('./EventEmiter');
const getInfo = require('./cheerio');

emitter.on('wordInfoListFinish', getWordsInfo)

let wordsListUrl = ["/dict/tag_381_1.html"],
    wordInfoUrl = [];


async function getUrlsList(idx = 0) {
    let res = await request.get(wordsListUrl[idx++])
    getInfo.getWordUrl(res);
    if (cheerio.load(res)('a.next').attr('href')) {
        wordsListUrl.push(cheerio.load(res)('a.next').attr('href'))
        await getUrlsList(idx)
    } else {
        fs.readFile('./wordUrlList.txt', 'utf-8', function (err, data) {
            if (err) {
                throw err;
            }
            wordInfoUrl = data.split("\n")
            emitter.emit('wordInfoListFinish');
        });
    }
    return 0
}

async function getWordsInfo(idx = 0) {
    if (!wordInfoUrl.length) {
        await getWordsInfo(idx);
        return;
    }
    let res = await request.get(wordInfoUrl[idx++])
    getInfo.getWordInfo(res)
    if (idx > wordInfoUrl.length) {
        return 0
    } else {
        await getWordsInfo(idx)
    }
}

getUrlsList().then(() => {
    }
);

