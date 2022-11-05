const fs = require('fs/promises');
const path = require('path');

const getFilesList = async () => {
  try {
    const files = await fs.readdir(path.join(__dirname, './secret-folder'), {
      withFileTypes: true
    });

    for (const el of files) {
      if (el.isFile()) {
        const elPath = path.join(__dirname, './secret-folder', el.name);
        const elName = path.parse(elPath).name;
        const elExtension = path.extname(elPath).slice(1);
        const elSize = (await fs.stat(elPath)).size;
        console.log(`${elName} - ${elExtension} - ${(elSize / 1024).toFixed(3)}kb`);
      }
    }
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
};

getFilesList();