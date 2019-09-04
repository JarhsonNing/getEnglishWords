const request = require('./request.js');
const cheerio = require("cheerio");
const fs = require('fs');
const emitter = require('./EventEmiter')

emitter.on('wordInfoListFinish', getWordsInfo)

let wordsListUrl = ["/dict/tag_381_1.html"],
    wordInfoUrl = [];
class getInfo {
    static getWordUrl (html){
        const $ = cheerio.load(html);
        $('.word-wrap>.word-box>a.word').each((idx,ele)=>{
            fs.writeFile('./wordUrlList.txt', $(ele).attr('href')+'\n', { 'flag': 'a' }, function(err) {
                if (err) {
                    throw err;
                }
            });
        })
    }
    static getWordInfo(html){
        const $ = cheerio.load(html);
        let word = {
            wordSpell:'',
            meaning:[]
        };
        $('h1.word-spell').each((idx,ele)=>{
            word.wordSpell = $(ele).text()
        });
        $('li.clearfix').each((idx,ele)=>{
            word.meaning.push({
                prop:$(ele).children().eq(0).text(),
                meaning: $(ele).children().eq(1).text().split(";")
            })
        });
        fs.writeFile('./wordInfoList.txt', JSON.stringify(word)+"\n", { 'flag': 'a' }, function(err) {
            if (err) {
                throw err;
            }
        });
    }
}
async function getUrlsList(idx=0){
    let res = await request.get(wordsListUrl[idx++])
    getInfo.getWordUrl(res)
    if(cheerio.load(res)('a.next').attr('href')){
        wordsListUrl.push(cheerio.load(res)('a.next').attr('href'))
        await getUrlsList(idx)
    }else{
        fs.readFile('./wordUrlList.txt', 'utf-8', function(err, data) {
            if (err) {
                throw err;
            }
            wordInfoUrl=data.split("\n")
            emitter.emit('wordInfoListFinish');
        });
    }
    return 0
}

async function getWordsInfo(idx=0){
    if(!wordInfoUrl.length){
        await getWordsInfo(idx);
        return ;
    }
    let res = await request.get(wordInfoUrl[idx++])
    getInfo.getWordInfo(res)
    if(idx>wordInfoUrl.length){
        return 0
    }else{
        await getWordsInfo(idx)
    }
}
getUrlsList().then(()=>{}
);

