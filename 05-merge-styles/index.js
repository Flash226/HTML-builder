const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const streamWrite = fs.createWriteStream(path.join(__dirname, '/project-dist/bundle.css'), 'utf-8');

fsPromises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
  .then(files => files.forEach(el => {
    if (el.isFile() && path.extname(path.join(__dirname, 'styles', el.name)) === '.css') {
      const read = fs.createReadStream(path.join(__dirname, 'styles', el.name));
      read.on('data', chunk => streamWrite.write(chunk.toString() + '\n'));
    };
  }))
  .catch(err => console.log(`Error: ${err.message}`));