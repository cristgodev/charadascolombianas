
const { DEFAULT_CATEGORIES } = require('./src/data/categories');

console.log('--- Word Counts per Category ---');
DEFAULT_CATEGORIES.forEach(cat => {
    console.log(`${cat.title}: ${cat.words.length} words`);
});
console.log('--------------------------------');
