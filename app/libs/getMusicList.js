/**
 * My good man Hofled helped out untangle the asynchronous javascript in this
 * file. Follow him at https://github.com/hofled
 */

import fs from 'fs';
import mm from 'musicmetadata';

async function getMusicList(dir) {
  let musicList = [];

  let filenames = fs.readdirSync(dir);
  musicList = await handleMusicFiles(filenames, dir);

  return musicList;
}

function handleMusicFiles(files, dirName) {
  return new Promise((res, rej) => {
    let filesData = [];
    let filesRemaining = files.length;

    files.forEach(file => {
      let readStream = fs.createReadStream(dirName + file);
      // asynchronous function
      mm(readStream, (err, metadata) => {
        if (err) {
          readStream.close();
          rej('handleMusicFile failed');
        }
        let newFile = metadata;
        newFile.filename = file;
        filesData.push(newFile);
        // checking for completion of iteration on files
        --filesRemaining;
        readStream.close();
        if (!filesRemaining) {
          res(filesData);
        }
      });
    });
  });
}

export default getMusicList;
