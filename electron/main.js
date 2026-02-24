const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const isDev = !app.isPackaged;
const PORT = process.env.ELECTRON_NEXT_PORT || '3210';
let nextProcess = null;

function logError(message) {
  try {
    const dir = app.getPath('userData');
    fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(path.join(dir, 'desktop-error.log'), `[${new Date().toISOString()}] ${message}\n`);
  } catch {
    // ignore
  }
}

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

  const url = isDev ? 'http://127.0.0.1:3000' : `http://127.0.0.1:${PORT}`;
  win.loadURL(url).catch((err) => {
    const msg = `loadURL failed: ${err?.message || err}`;
    logError(msg);
    dialog.showErrorBox('页面加载失败', `${msg}\n\n请确认 Next 服务是否已启动。`);
  });
}

function waitForServer(url, timeoutMs = 45000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        const res = await fetch(url);
        if (res.ok || res.status === 404) {
          resolve();
          return;
        }
      } catch {
        // retry
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Server did not start in ${timeoutMs}ms: ${url}`));
        return;
      }
      setTimeout(check, 500);
    };
    check();
  });
}

async function startNextServer() {
  if (isDev || nextProcess) return;

  const nextBin = path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', 'next', 'dist', 'bin', 'next');
  const fallbackBin = path.join(process.resourcesPath, 'app', 'node_modules', 'next', 'dist', 'bin', 'next');
  const bin = fs.existsSync(nextBin) ? nextBin : fallbackBin;

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
    if (isDev) {
      await waitForServer('http://127.0.0.1:3000');
    } else {
      await startNextServer();
    }
    createWindow();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logError(msg);
    dialog.showErrorBox('启动失败', `${msg}\n\n开发模式请先执行 npm run dev，再执行 npm run desktop:dev`);
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
