const fs = require('fs');
const path = require('path');

const sourcePath = process.argv[2];
const distPath = process.argv[3] || 'dist';

if (!sourcePath) {
  throw Error('Source path is not specified');
}

const entryPoint = path.join(__dirname, sourcePath);
const distPoint = path.join(__dirname, distPath);

if (!fs.existsSync(entryPoint)) {
  throw Error(`Source path is not exist: ${entryPoint}`);
}

const searchRecursive = require('./searchRecursive');
const catalogify = require('./catalogify')(distPoint);

if (!fs.existsSync(distPoint)) {
  fs.mkdirSync(distPoint);
}

searchRecursive(entryPoint, catalogify);
