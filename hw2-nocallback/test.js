const fs = require('mz/fs');
const path = require('path');

const folder = process.argv[2];
const target = path.join(__dirname, folder);
function checkExisting () {
  return fs.exists(target);
}

async function check () {
  let existing = await checkExisting();
  console.log('TCL: existing', existing);
}
// check();

const search = async () => {
  const entry = await fs.readdir(target);
  console.log('TCL: search -> entry', entry)
  return entry.reverse();
};

const searchP = async (entry) => {
  const dirData = await fs.readdir(entry);
	console.log('TCL: searchP -> dirData', dirData)
  const p = dirData.map(async item => {
    const filePath = path.join(entry, item);
    const fileData = await fs.stat(filePath);
		console.log('TCL: searchP -> fileData', fileData.isFile())
    if (fileData.isFile()) {
      return filePath;
    }
  });
  const res = await Promise.all(p);

	console.log('TCL: search -> res', res)

};

searchP(target);
