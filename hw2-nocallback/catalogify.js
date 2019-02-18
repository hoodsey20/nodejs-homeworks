const fs = require('mz/fs');
const path = require('path');

const catalogify = (distFolder) => {
  return function (name, filePath) {
    const folderName = name[0].toUpperCase();
    const distCategory = path.join(distFolder, folderName);
    const distPath = path.join(distCategory, name);

    async function copyFile () {
      if (await !fs.exists(distPath)) {
        await fs.link(filePath, distPath);
      }
    }

    async function createFolder () {
      await fs.mkdir(distCategory);
    }

    async function makeCopy () {
      try {
        if (await fs.exists(distCategory)) {
          createFolder();
        } else {
          createFolder();
          copyFile();
        }
      } catch (error) {
        throw error;
      }
    }

    makeCopy();
  };
};

module.exports = catalogify;
