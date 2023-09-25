// preload.js
const { contextBridge, ipcRenderer, screen } = require('electron');

contextBridge.exposeInMainWorld(
  "api", {
    send: (channel, data) => {
      ipcRenderer.send(channel, data);
    },
    on: (channel, callback) => {
      ipcRenderer.on(channel, (event, ...data) => {
        console.log(event)
        console.log(data)
        callback(...data)
      });
    },
    getProcessId: () => ipcRenderer.sendSync('get-process-id'),
    getDisplaySize: () => ipcRenderer.sendSync('get-screen-size'),
    getTitle: () => ipcRenderer.sendSync("get-title"),
  }
);
