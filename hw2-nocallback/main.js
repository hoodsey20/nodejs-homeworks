const fs = require('mz/fs');
const path = require('path');

const sourcePath = process.argv[2];
const distPath = process.argv[3] || 'dist';

if (!sourcePath) {
  throw Error('Source path is not specified');
}

const distPoint = path.join(__dirname, distPath);

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
        queue.push(relativePath + '/' + item);
      });
    }

    queue.shift();
  }

  return filesList;
};

const getUniqFolders = (data) => {
  let res = data
    .map(item => Object.keys(item)[0])
    .filter((value, index, self) => self.indexOf(value) === index);

  return res;
};

const createFolders = async (list) => {
  const isDistExists = await fs.exists(distPoint);
  if (!isDistExists) await fs.mkdir(distPoint);

  list.forEach(async item => {
    const distCatalog = path.join(distPoint, item);
    const isCatalogExists = await fs.exists(distCatalog);
    if (!isCatalogExists) await fs.mkdir(distCatalog);
  });
};

const copyFiles = async (list) => {
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const catalogFolder = Object.keys(item)[0];
    const fileSource = item[catalogFolder];
    const fileName = path.basename(fileSource);
    const filePath = path.join(distPoint, catalogFolder, fileName);
    const isFileExists = await fs.exists(filePath);
    if (!isFileExists) await fs.link(fileSource, filePath);
  }
};

const catalogify = async () => {
  try {
    const parsed = await getFilesList(sourcePath);
    const folders = getUniqFolders(parsed);
    await createFolders(folders);
    await copyFiles(parsed);
  } catch (error) {
    throw error;
  }
};

catalogify()
  .then(() => console.log('ok!'))
  .catch(error => {
    throw error;
  });

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});
