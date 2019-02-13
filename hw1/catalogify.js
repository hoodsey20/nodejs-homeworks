const fs = require('fs');
const path = require('path');

const catalogify = (distFolder) => {
  return function (name, filePath) {
    const folderName = name[0].toUpperCase();
    const distCategory = path.join(distFolder, folderName);
    const distPath = path.join(distCategory, name);

    var makeCopy = () => {
      fs.access(distPath, error => {
        if (error) {
          fs.link(filePath, distPath, (error) => {
            if (error) throw error;
          });
        }
      });
    };

    fs.access(distCategory, error => {
      if (error) {
        fs.mkdir(distCategory, (error) => {
          if (error) throw error;
          makeCopy();
        });
      } else {
        makeCopy();
      }
    });
  };
};

module.exports = catalogify;
