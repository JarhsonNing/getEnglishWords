const cheerio = require("cheerio");
const fs = require('fs');

class getInfo {
    static getWordUrl(html) {
        const $ = cheerio.load(html);
        $('.word-wrap>.word-box>a.word').each((idx, ele) => {
            fs.writeFile('./wordUrlList.txt', $(ele).attr('href') + '\n', {'flag': 'a'}, function (err) {
                if (err) {
                    throw err;
                }
            });
        })
    }

    static getWordInfo(html) {
        const $ = cheerio.load(html);
        let word = {
            wordSpell: '',
            read:[],
            example:[],
            meaning: []
        };
        $('h1.word-spell').each((idx, ele) => {
            word.wordSpell = $(ele).text()
        });
        $('span.word-spell-audio').each((idx, ele) => {
            word.read.push({
                yb:$(ele).prev().text(),
                audio:$(ele).attr('data-url')
            })
        });
        $('#dict-chart-examples').prev().children("li").each((idx, ele) => {
            word.example.push({
                source:$(ele).html().split("<br>")[0],
                target:$(ele).html().split("<br>")[1]
            })
        });
        $('li.clearfix').each((idx, ele) => {
            word.meaning.push({
                prop: $(ele).children().eq(0).text(),
                meaning: $(ele).children().eq(1).text().split(";")
            })
        });
        fs.writeFile('./wordInfoList.txt', JSON.stringify(word) + "\n", {'flag': 'a'}, function (err) {
            if (err) {
                throw err;
            }
        });
    }
}


module.exports = getInfo;