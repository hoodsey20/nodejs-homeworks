const fs = require('mz/fs');
const path = require('path');

const folder = process.argv[2];

const getFilesList = async (entry) => {
  let filesList = [];
  let queue = await fs.readdir(entry);

  while (queue.length) {
    const currentPath = path.join(entry, queue[0]);
    const currentData = await fs.stat(currentPath);

    if (currentData.isFile()) {
      const key = path.basename(queue[0])
        .trim()
        .replace('.', '')[0]
        .toUpperCase();
      filesList.push({ [key]: currentPath });
    }

    if (currentData.isDirectory()) {
      const folderContent = await fs.readdir(currentPath);
      folderContent.forEach(item => {
        const relativePath = path.relative(entry, currentPath);
        queue.push(`${relativePath}/${item}`);
      });
    }

    queue.shift();
  }

  return filesList;
};

getFilesList(folder)
  .then(res => console.log(res));
