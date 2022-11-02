const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(file, {encoding: 'utf-8'});
let data ='';

stream.on('data', chunk => data += chunk);
stream.on('close', () => console.log(data));
stream.on('error', err => console.log('Error',err.message));