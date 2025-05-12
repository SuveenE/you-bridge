/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

// Configure logging
log.transports.file.level = 'debug';
log.transports.console.level = 'debug';

// Override console logging
Object.assign(console, log.functions);

class AppUpdater {
  constructor() {
    log.info('Initializing auto-updater');

    // Allow updates in development
    if (process.env.NODE_ENV === 'development') {
      autoUpdater.forceDevUpdateConfig = true;
      log.info('Development mode: Forcing dev update config');
    }

    // Disable automatic downloading of updates
    autoUpdater.autoDownload = true;
    // Enable automatic installation of updates on the next computer restart
    autoUpdater.autoInstallOnAppQuit = true;

    try {
      // Start listening for update events
      this.listenEvents();
      // Check for available updates
      log.info('Checking for updates on startup');
      this.checkForUpdates().catch((err) => {
        log.error('Failed to check for updates on startup:', err);
      });
    } catch (error) {
      log.error('Error initializing auto-updater:', error);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async checkForUpdates(): Promise<void> {
    try {
      await autoUpdater.checkForUpdates();
    } catch (error) {
      log.error('Error checking for updates:', error);
      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async listenEvents(): Promise<void> {
    // Event listener for when the app is checking for updates
    autoUpdater.on('checking-for-update', () => {
      log.info('Checking for updates...');
    });

    // Event listener for when an update is available
    autoUpdater.on('update-available', (info) => {
      log.info('Update available:', {
        version: info.version,
        releaseDate: info.releaseDate,
        files: info.files,
      });
      // Download the latest version of the update
      autoUpdater.downloadUpdate().catch((err) => {
        log.error('Failed to download update:', err);
      });
    });

    // Event listener for when no update is available
    autoUpdater.on('update-not-available', (info) => {
      log.info('Update not available. Current version is latest:', {
        version: info.version,
        releaseDate: info.releaseDate,
      });
    });

    // Event listener for when an error occurs during the update process
    autoUpdater.on('error', (err) => {
      log.error('Error in auto-updater:', err);
    });

    // Event listener for download progress
    autoUpdater.on('download-progress', (progressObj) => {
      log.info('Download progress:', {
        progress: `${progressObj.percent}%`,
        speed: `${progressObj.bytesPerSecond} bytes/s`,
        transferred: `${progressObj.transferred}/${progressObj.total} bytes`,
      });
    });

    // Event listener for when an update has been downloaded
    autoUpdater.on('update-downloaded', (info) => {
      log.info('Update downloaded successfully:', {
        version: info.version,
        releaseDate: info.releaseDate,
        files: info.files,
      });
    });
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.sender.send('ipc-example', msgTemplate('pong'));
});

// Add handler for app restart
ipcMain.on('restart_app', () => {
  log.info('Restarting app for update installation...');
  autoUpdater.quitAndInstall();
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata: { url: string }) => {
    shell.openExternal(edata.url);
    return { action: 'deny' as const };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
