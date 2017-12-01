/**
 * My good man Hofled helped out untangle the asynchronous javascript in this
 * file. Follow him at https://github.com/hofled
 */

import fs from 'fs';
import mm from 'musicmetadata';

/**
 * Get a list of files of supported file extensions from the given directory
 * Supported extensions are: .mp3, .mp4, .wav, .ogg, .flac, and .opus
 * @param dir (string) The relative path to the directory being searched.
 *    The trailing slash must be included.
 *
 * @return a Promise resolving into an array of objects each containing sound metadata
 */
async function getMusicList(dir) {
  let musicList = [];

  let filenames = fs.readdirSync(dir);
  // we should pass in only supported file types
  const supportedExtensions = /\.(mp3|mp4|wav|ogg|flac|opus)$/;
  filenames.filter(filename => filename.match(supportedExtensions));

  musicList = await handleFiles(filenames, dir);

  return musicList;
}

function handleFiles(files, dirName) {
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
