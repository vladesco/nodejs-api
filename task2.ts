import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import csv from 'csvtojson/v2'
import readline from 'readline';

const lineReader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question: (text: string) => Promise<string> = (questionText) =>
    new Promise(resolve => {
        lineReader.question(`${questionText}\n`, resolve);
    })

async function app() {

    const inputFileName = await question('enter input file name');
    const outputFileName = await question('enter output file name');

    pipeline(
        csv().fromFile(inputFileName),
        createWriteStream(outputFileName),
        error => console.log(error?.code)
    ).on('unpipe', () => process.exit(0))
}

app();


