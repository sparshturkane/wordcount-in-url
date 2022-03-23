import axios from "axios";
import fs from "fs";
import readline from "readline";

/**
 * Parses string passed via terminal into clean url
 * @param params pass string which contains url to be called & inputed via cmd
 * @returns string containing URL
 */
function fetchUrl(params: string): string {
    let url: string = params.split('=')[1];
    return url;
}

/**
 * Parses string passed via terminal and convert comma seperated words into array
 * @param params pass string which contains words to be counted & inputed via cmd
 * @returns array of strings containing each word
 */
function fetchWords(params: string): string[] {
    let words: string[] = params.split('=')[1].split(',');
    return words
}

/**
 * Stores html data present inside URL into a txt file
 * @param url pass URL which user wants to hic
 * @returns a promise
 */
async function convertUrlToFile(url: string): Promise<any> {
    return new Promise(async (fulfill, reject) => {
        try {
            const response = await axios({
                method: 'get',
                url: url,
                responseType: 'stream'
            })
            let reponsePipe = await response.data.pipe(fs.createWriteStream("temp/website.txt"));
            reponsePipe.on('finish', fulfill)
            reponsePipe.on('error', reject)
        } catch (error) {
            reject(error)
        }
    });
}

/**
 * Counts the number of words present in a file and stores it in dynamic object
 * @param word pass array of words to be counted
 * @returns a promise which has dynamic object of word & their count
 */
function findWordInFile(word: string[]): Promise<any> {
    return new Promise(async (fulfill, reject) => {
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
            fulfill(finalObject)
        })
        rl.on('error', reject)
    });
}

/**
 * Initial function which will call other function and finally print Words & their counts
 */
async function init(): Promise<any> {
    try {
        const url: string = fetchUrl(process.argv[2]);
        const word: string[] = fetchWords(process.argv[3]);
        await convertUrlToFile(url)
        let readFileResponse = await findWordInFile(word)

        for (const finalValue in readFileResponse) {
            console.log(finalValue + ": " + readFileResponse[finalValue]);
        }
    } catch (error) {
        console.log(error);
    }
}

init()