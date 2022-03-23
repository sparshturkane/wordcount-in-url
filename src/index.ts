import axios from "axios";
import fs from "fs";
import readline from "readline";

function fetchUrl(params: string): string {
    let url: string = params.split('=')[1];
    return url;
}

function fetchWords(params: string): string[] {
    let words: string[] = params.split('=')[1].split(',');
    return words
}

async function callAPI(url: string) {
    return new Promise(async (fulfill, reject) => {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        })
        let reponsePipe = await response.data.pipe(fs.createWriteStream("temp/website.txt"));
        reponsePipe.on('finish', fulfill)
        reponsePipe.on('error', reject)
    });
}

function readFile(word: string[]): void {
    const rl = readline.createInterface({
        input: fs.createReadStream('temp/website.txt'),
        output: process.stdout,
        terminal: false
    })

    let finalObject: { [x: string]: number; } = {};

    for (let i = 0; i < word.length; i++) {
        finalObject[word[i]] = 0
    }

    rl.on('line', (line) => {
        for (let i = 0; i < word.length; i++) {
            finalObject[word[i]] = finalObject[word[i]] + (line.toLowerCase().match(new RegExp(word[i].toLowerCase(), "g")) || []).length
        }
    })

    rl.on('close', () => {
        for (const finalValue in finalObject) {
            console.log(finalValue + ": " + finalObject[finalValue]);

        }
    })
}

async function init(): Promise<any> {
    const url: string = fetchUrl(process.argv[2]);
    const word: string[] = fetchWords(process.argv[3]);
    readFile(word)
}

init()