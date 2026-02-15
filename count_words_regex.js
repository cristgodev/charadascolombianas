
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/categories.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Regex to find category blocks and their titles/words
// This is a simple parser, assuming standard formatting in the file
const categoryRegex = /id:\s*'([^']+)',\s*title:\s*'([^']+)',[\s\S]*?words:\s*\[([\s\S]*?)\]/g;

let match;
console.log('/**');
console.log(' * WORD COUNTS (Generated Debug Info)');
console.log(' * ----------------------------------');
while ((match = categoryRegex.exec(content)) !== null) {
    const title = match[2];
    const wordsBlock = match[3];
    // Remove comments and whitespace
    const cleanBlock = wordsBlock.replace(/\/\/.*/g, '').replace(/\s/g, '');
    const words = cleanBlock.split("',").filter(w => w.length > 0);
    console.log(` * ${title}: ${words.length}`);
}
console.log(' */');
