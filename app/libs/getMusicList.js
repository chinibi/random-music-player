const fs = require('fs');
const mm = require('music-metadata');

function getMusicList(dir) {
  let musicList = [];

  let filenames = fs.readdirSync(dir);
  musicList = filenames.map(filename => dir + filename).map(handleMusicFile);
  return musicList;
}

function handleMusicFile(file) {
  let fileData = {};

  mm.parseFile(file)
    .then(metadata => {
      fileData = metadata;
    })
    .catch(err => console.error(err.message));

  return fileData;
}


module.exports = getMusicList;
