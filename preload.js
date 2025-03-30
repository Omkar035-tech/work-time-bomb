// preload.js
// This file is used to safely expose Node.js APIs to the renderer process

window.addEventListener('DOMContentLoaded', () => {
    // You can expose specific Node.js modules or custom APIs here if needed
    // For example, if you need to expose certain Electron APIs:

    const { contextBridge, ipcRenderer } = require('electron')

    contextBridge.exposeInMainWorld('electronAPI', {
        close: () => ipcRenderer.send('close-app'),
        resize: (scale) => ipcRenderer.send('resize-window', scale)
    })
})