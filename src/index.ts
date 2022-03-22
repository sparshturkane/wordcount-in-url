import axios from "axios";
import fs from "fs";

function fetchUrl(params: string): string {
    let url: string = params.split('=')[1];
    return url;
}

function fetchWords(params: string): string[] {
    let words: string[] = params.split('=')[1].split(',');
    return words
}

async function callAPI(url: string) {
    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        })
        response.data.pipe(fs.createWriteStream("temp/website.html"));

    } catch (error) {
        console.error(error)
    }
}

async function init(): Promise<any> {
    const url: string = fetchUrl(process.argv[2]);
    const word: string[] = fetchWords(process.argv[3]);

    console.log(await callAPI(url));
}

init()