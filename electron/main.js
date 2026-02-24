const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

const isDev = !app.isPackaged;
const PORT = process.env.ELECTRON_NEXT_PORT || '3210';
let nextProcess = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 1366,
    height: 860,
    minWidth: 1100,
    minHeight: 760,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadURL(`http://127.0.0.1:${PORT}`);
  }
}

function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        const res = await fetch(url);
        if (res.ok || res.status === 404) {
          resolve();
          return;
        }
      } catch (err) {
        // keep retrying until timeout
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Next server did not start in ${timeoutMs}ms`));
        return;
      }
      setTimeout(check, 400);
    };
    check();
  });
}

async function startNextServer() {
  if (isDev || nextProcess) return;

  const nextBin = path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', 'next', 'dist', 'bin', 'next');
  const fallbackBin = path.join(process.resourcesPath, 'app', 'node_modules', 'next', 'dist', 'bin', 'next');
  const bin = require('fs').existsSync(nextBin) ? nextBin : fallbackBin;

  nextProcess = spawn(process.execPath, [bin, 'start', '-p', String(PORT)], {
    cwd: process.resourcesPath,
    env: {
      ...process.env,
      NODE_ENV: 'production'
    },
    stdio: 'ignore',
    detached: false
  });

  await waitForServer(`http://127.0.0.1:${PORT}`);
}

app.whenReady().then(async () => {
  try {
    await startNextServer();
    createWindow();
  } catch (err) {
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (nextProcess && !nextProcess.killed) {
    nextProcess.kill('SIGTERM');
  }
});
