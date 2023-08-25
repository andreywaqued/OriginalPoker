// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const io = require('socket.io-client');
const path = require('path')
try {
  require('electron-reloader')(module)
} catch (_) {}

let mainWindow1, mainWindow2;
const socket = io('http://127.0.0.1:5000'); // Replace with your server's address

function createWindow() {
    // Create two windows
    mainWindow1 = new BrowserWindow({
      title: "mainWindow1",
      width: 800,
      height: 600,
      webPreferences: {
        // nodeIntegration: true,
        // contextIsolation: false
        preload: path.join(__dirname, 'preload.js')

      }
    });
  
    mainWindow2 = new BrowserWindow({
      title: "mainWindow2",
      width: 800,
      height: 600,
      webPreferences: {
        // nodeIntegration: true,
        // contextIsolation: false
        preload: path.join(__dirname, 'preload.js')

      }
    });
  
    // Load an HTML file into the windows
    mainWindow1.loadFile('index.html');
    mainWindow2.loadFile('index.html');
  
    // Make sure the window contents have been loaded before sending messages
    mainWindow1.webContents.on('did-finish-load', () => {
      // Emit a message to the server
      socket.emit('message', 'Hello, Server');
    });

    ipcMain.on("message", (event, message) => {
        const senderWebContents = event.sender;
        const windowId = senderWebContents.id;

        socket.emit("message", `Message from window ID ${windowId}: ${message}`)
    })

    ipcMain.on('get-process-id', async (event) => {
        const senderWebContents = event.sender;
        const pid = await senderWebContents.getOSProcessId();
        
        console.log(`Renderer Process ID: ${pid} from ${senderWebContents.getTitle()}`);
    
        // Optionally send the PID back to the renderer process that requested it
        event.returnValue = pid;
      });
    
  
    // Handle incoming Socket.io messages
    socket.on('update', (data) => {
        console.log("received message ", data)
        // data.search()
      // Update both windows with the data received from the server
      if (mainWindow1 && !mainWindow1.isDestroyed() && data.data.includes("ID 2")) {
        mainWindow1.webContents.send('update', data);
      }
      if (mainWindow2 && !mainWindow2.isDestroyed() && data.data.includes("ID 1")) {
        mainWindow2.webContents.send('update', data);
      }
    });

    socket.on('open-new-table', (data) => {
        console.log("received message ", data)
        data["title"]
        // data.search()
      // Update both windows with the data received from the server
      if (mainWindow1 && !mainWindow1.isDestroyed()) {
        mainWindow1.webContents.send('update', data);
      }
      if (mainWindow2 && !mainWindow2.isDestroyed()) {
        mainWindow2.webContents.send('update', data);
      }
    });
  }
  

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
