const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const oldDir = path.join(__dirname, 'files');
const newDir = path.join(__dirname, 'files-copy');

const copyDir = () => {
  fsPromises.mkdir(newDir).then(function () { recursive: true }, (err) => {
    if (err) {
      fs.readdir(newDir, (err, files) => {
        if (err) throw err;
        for (const file of files) {
          fs.access(`${oldDir}/${file}`, function (error) {
            if (error) {
              fs.unlink(path.join(newDir, file), err => {
                if (err) throw err;
              });
            }
          });
        }
      });
    }
  });
  fs.readdir(oldDir, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.copyFile(path.join(oldDir, file), path.join(newDir, file), err => {
        if (err) throw err;
      });
    }
  });
}

copyDir();