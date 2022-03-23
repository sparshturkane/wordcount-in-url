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

    let growthGounter = 0;
    let sustainableCounter = 0;
    let annataCounter = 0;
    rl.on('line', (line) => {
        if (line) {
            growthGounter = growthGounter + (line.toLowerCase().match(new RegExp("growth", "g")) || []).length
            sustainableCounter = sustainableCounter + (line.toLowerCase().match(new RegExp("sustainable", "g")) || []).length
            annataCounter = annataCounter + (line.toLowerCase().match(new RegExp("anatta", "g")) || []).length
        }
    })

    rl.on('close', () => {
        console.log('Done!');
        console.log(growthGounter);
        console.log(sustainableCounter);
        console.log(annataCounter);

    })
}

async function init(): Promise<any> {
    const url: string = fetchUrl(process.argv[2]);
    const word: string[] = fetchWords(process.argv[3]);

    console.log(await callAPI(url));
    console.log(readFile(word));

}

init()