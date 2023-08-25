// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  "api", {
    send: (channel, data) => {
      ipcRenderer.send(channel, data);
    },
    on: (channel, callback) => {
      ipcRenderer.on(channel, (event, data) => callback(data));
    },
    getProcessId: () => ipcRenderer.sendSync('get-process-id')
  }
);
