const electron = require('electron');
const path = require('path');
const fs = require('fs');

class SettingsStore {
  constructor(options) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');

    this.path = path.join(userDataPath, options.configName + '.json');
    this.data = this.parseDataFile(this.path, options.defaults);
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.data));
      return true;
    }
    catch(err) {
      console.error(err.message);
      return false;
    }
  }

  parseDataFile(filePath, defaults) {
    // A try/catch covers the case of no config file, such when the program is
    // first run.  fs.readFileSync will return a JSON string to be parsed as
    // a JS object
    try {
      return JSON.parse(fs.readFileSync(filePath));
    }
    catch(err) {
      return defaults;
    }
  }
}

module.exports = SettingsStore;
