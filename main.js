'use strict';

const electron = require('electron');
// Automatically reload on file change
require('electron-reload')(__dirname);
// Load user settings handler
const SettingsStore = require('./app/libs/SettingsStore');

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// Module to customize browser menu items
const Menu = electron.Menu;

// Create menu items to override Electron's default menu
const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {'role': 'close'}
    ]
  },
  {
    label: 'Player',
    submenu: [
      {
        label: 'Play/Pause',
        accelerator: 'space',
        click: () => console.log('play/pause')
      },
      {
        label: 'Skip Track',
        click: () => console.log('skip track')
      },
      {
        label: 'Stop',
        click: () => console.log('stop track')
      }
    ]
  },
  {
    label: 'Developer',
    submenu: [
      {
        role: 'toggledevtools'
      }
    ]
  }
];

// Define default user settings
const settingsStore = new SettingsStore({
  configName: 'user-config',
  defaults: {
    windowBounds: { width: 800, height: 600 },
    soundDir: './public/sounds/'
  }
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  let { height, width } = settingsStore.get('windowBounds');
  mainWindow = new BrowserWindow({ height, width });

  // Set menu items
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is about to be closed.
  mainWindow.on('close', function() {
    settingsStore.set('windowBounds', {
      width: mainWindow.getBounds().width,
      height: mainWindow.getBounds().height
    });
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Install React Dev Tools on development environment
  if (process.env.NODE_ENV !== 'production') {
    const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => {
        console.log(`Added Extension:  ${name}`);
      })
      .catch((err) => {
        console.log('An error occurred: ', err);
      });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
