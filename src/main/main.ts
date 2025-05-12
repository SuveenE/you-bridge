import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { promises as fs } from 'fs';
import sourceMapSupport from 'source-map-support';
import debug from 'electron-debug';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';
import MenuBuilder from './menu';
import { AppUpdater, resolveHtmlPath } from './util';

log.transports.file.level = 'debug';
log.transports.console.level = 'debug';

Object.assign(console, log.functions);

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

ipcMain.handle('store-file', async (_event, record) => {
  const userData = app.getPath('userData');
  const storePath = path.join(userData, 'files.json');

  let files = [];
  try {
    const raw = await fs.readFile(storePath, 'utf8');
    files = JSON.parse(raw);
  } catch (err: any) {
    if (err.code !== 'ENOENT') throw err;
  }

  files.push(record);
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(files, null, 2), 'utf8');

  log.info('File stored successfully at location:', {
    storePath,
  });

  return { success: true };
});

if (process.env.NODE_ENV === 'production') {
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  debug();
}

const installExtensions = async () => {
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  return installExtension([REACT_DEVELOPER_TOOLS], forceDownload).catch(
    console.log,
  );
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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
    return undefined;
  })
  .catch(console.log);
