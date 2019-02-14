const fs = require('fs');
const path = require('path');

const catalogify = (distFolder) => {
  return function (name, filePath) {
    const folderName = name[0].toUpperCase();
    const distCategory = path.join(distFolder, folderName);
    const distPath = path.join(distCategory, name);

    var makeCopy = () => {
      if (!fs.existsSync(distPath)) {
        try {
          fs.linkSync(filePath, distPath);
        } catch (error) {
          throw error;
        }
      }
    };

    if (!fs.existsSync(distCategory)) {
      try {
        fs.mkdirSync(distCategory);
      } catch (error) {
        throw error;
      }
    }
    makeCopy();
  };
};

module.exports = catalogify;
