const fs = require('fs');
const path = require('path');

const searchRecursive = (entry, onFileClb) => {
  fs.readdir(entry, (error, contents) => {
    if (error) throw error;

    contents.forEach(dataItem => {
      const filePath = path.join(entry, dataItem);

      fs.stat(filePath, (error, fileData) => {
        if (error) throw error;

        if (fileData.isDirectory()) {
          searchRecursive(filePath, onFileClb);
          return;
        }

        if (fileData.isFile()) {
          onFileClb(dataItem, filePath);
        }
      });
    });
  });
};

module.exports = searchRecursive;
