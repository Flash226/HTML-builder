const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');


fsPromises.mkdir(path.join(__dirname, 'project-dist')).then(function () { recursive: true }, (err) => {
  if (err) { } });

const streamWrite = fs.createWriteStream(path.join(__dirname, '/project-dist/style.css'), 'utf-8');

fsPromises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
  .then(files => files.forEach(el => {
    if (el.isFile() && path.extname(path.join(__dirname, 'styles', el.name)) === '.css') {
      const read = fs.createReadStream(path.join(__dirname, 'styles', el.name));
      read.on('data', chunk => streamWrite.write(chunk.toString() + '\n'));
    };
  }))
  .catch(err => console.log(`Error: ${err.message}`));



let html = '';
const read = fs.createReadStream(path.join(__dirname, 'template.html'), {encoding: 'utf-8'});
read.on('data', chunk => html += chunk);
read.on('close', () => {
  fsPromises.readdir(path.join(__dirname, 'components'), { withFileTypes: true })
    .then(files => {
      let i = files.length;
      files.forEach(el => {
        if (i > 0) {
          if (el.isFile() && path.extname(path.join(__dirname, 'components', el.name)) === '.html') {
            const nameFile = path.parse(path.join(__dirname, 'components', el.name)).name;
            const read = fs.createReadStream(path.join(path.join(__dirname, 'components', el.name)), {encoding: 'utf-8'});
            let data = '';  
            read.on('data', chunk => data += chunk);
            read.on('close', () => { 
              replaceHtml = html.replace(`{{${nameFile}}}`, data);
              html = replaceHtml;
              i = i - 1;
              if (i === 0) {
                fs.writeFile(__dirname + '/project-dist/index.html', html, (err) => {
                  if (err) {
                    return console.log(err);
                  }  
                });
              }
            });
          }
        }
      });
    })
  .catch(err => console.log(`Error: ${err.message}`));
});
read.on('error', err => console.log('Error',err.message));

  



const oldDir = path.join(__dirname, 'assets');
const newDir = path.join(__dirname, 'project-dist', 'assets');

copyDir(oldDir, newDir);

async function copyDir(oldDir, newDir) {
  await fsPromises.mkdir(newDir, {recursive: true});
  try {
    const files = await fsPromises.readdir(oldDir, {withFileTypes: true});
    for (let file of files) {
      if (file.isFile()) {
        await fsPromises.copyFile(path.resolve(oldDir, file.name), path.resolve(newDir, file.name));
      } else if (!file.isFile()) {
        await fsPromises.mkdir(path.resolve(newDir, file.name), {recursive: true});
        await copyDir(path.resolve(oldDir, file.name), path.resolve(newDir, file.name));
      }
    }
  }
  catch(err) {
    console.log(err);
  }
}