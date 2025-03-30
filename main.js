// main.js - Main process file for Electron

const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    mainWindow = new BrowserWindow({
        width: 400,
        height: 150,
        transparent: true, // Make window transparent
        frame: false, // Remove window frame
        alwaysOnTop: true, // Keep timer on top of other windows
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');

    // Position the window in the bottom right corner initially
    mainWindow.setPosition(width - 400, height - 300);

    // For development
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// Handle resize requests from renderer
ipcMain.on('resize-window', (event, scale) => {
    const [width, height] = mainWindow.getSize();
    mainWindow.setSize(Math.round(400 * scale), Math.round(300 * scale));
});