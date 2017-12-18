// Node Dependencies
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Recursively create a dir.
function recursiveMkDir(dir) {
    if (!fs.existsSync(dir)) {
        recursiveMkDir(path.dirname(dir));
        fs.mkdirSync(dir);
    }
}

// Copy files maintaining relative paths.
exports.relativeCopy = function _relativeCopy(fileGlob, from, to) {
  return new Promise((resolve, reject) => {
    glob(fileGlob, { cwd: from, nodir: true }, (err, files) => {
      if (err) reject(err);
    
      files.forEach(file => {
        const origin = path.join(from, file);
        const dest = path.join(to, file);
        const data = fs.readFileSync(origin, 'utf-8');
        recursiveMkDir(path.dirname(dest));
        fs.writeFileSync(dest, data);
        resolve();
      });
    });
  });
}
