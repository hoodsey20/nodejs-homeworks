const fs = require('fs');
const path = require('path');

const catalogify = (distFolder) => {
  return function (name, filePath) {
    const folderName = name[0].toUpperCase();
    const distCategory = path.join(distFolder, folderName);
    const distPath = path.join(distCategory, name);

    var makeCopy = () => {
      if (!fs.existsSync(distPath)) {
        fs.link(filePath, distPath, (error) => {
          if (error) throw error;
        });
      }
    };

    if (!fs.existsSync(distCategory)) {
      fs.mkdir(distCategory, (error) => {
        if (error) throw error;
        makeCopy();
      });
    } else {
      makeCopy();
    }
  };
};

module.exports = catalogify;
