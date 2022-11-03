const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'text.txt');
const streamWrite = fs.createWriteStream(file);

process.stdout.write(`\nWelcome to Write Stream process\nPlease enter text\nTo exit - enter "exit" or press ctrl+c\n\n`)

process.openStdin().on('data', chunk => {
  if (chunk.toString('utf8').trim() === 'exit') {
    process.exit(0);
  } else {
    streamWrite.write(chunk);
  }
});

process.on('SIGINT', () => process.exit(0));
process.on('exit', () => process.stdout.write('\nGood Luck!\n\n'));