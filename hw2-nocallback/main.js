const fs = require('fs');
const path = require('path');

const sourcePath = process.argv[2];
const distPath = process.argv[3] || 'dist';

if (!sourcePath) {
  throw Error('Source path is not specified');
}

const entryPoint = path.join(__dirname, sourcePath);
const distPoint = path.join(__dirname, distPath);

fs.access(entryPoint, error => {
  if (error) throw Error(`Source path is not exist or not available: ${entryPoint}`);

  const searchRecursive = require('./searchRecursive');
  const catalogify = require('./catalogify')(distPoint);

  fs.access(distPoint, error => {
    if (error) {
      fs.mkdir(distPoint, error => {
        if (error) throw error;
        searchRecursive(entryPoint, catalogify);
      });
    } else {
      searchRecursive(entryPoint, catalogify);
    }
  });
});

process.on('unhandledRejection', (reason, p) => {
  console.log('---\n Unhandled Rejection at:', p, 'reason:', reason);
});
