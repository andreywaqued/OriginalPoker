// main.js
const { app, BrowserWindow, ipcMain, Notification, dialog, screen } = require('electron');

const io = require('socket.io-client');
const path = require('path')
// const { screen } = require('electron')
try {
  require('electron-reloader')(module)
} catch (_) {}

let mainWindow1, mainWindow2;
// const socket = io('http://127.0.0.1:5000'); // Replace with your server's address

function createWindow(winTitle = "Main Lobby", windowType = "lobby") {
  const primaryDisplay = screen.getPrimaryDisplay()
  // const { width, height } = primaryDisplay.workAreaSize
  let aspectRatio = 4/3 //lobby
  let url = 'http://localhost:5173/lobby'
  if (windowType === "table") {
    aspectRatio = 128/108 //mesa
    url = 'http://localhost:5173/table'
  } 
  const initialHeight = 500
  // console.log(primaryDisplay)
  // console.log(width)
  // console.log(height)
  const maxHeight = primaryDisplay.workAreaSize['height']
  // console.log(maxHeight)
  // Create two windows
  mainWindow1 = new BrowserWindow({
    title: winTitle,
    height: initialHeight,
    width: initialHeight * aspectRatio,
    minWidth: 600,
    
    // maxHeight: 600,
    // maxWidth: 600 * aspectRatio,
    maximizable: false,
    // autoHideMenuBar: true,
    // titleBarStyle: "hidden",
    // titleBarOverlay: {
    //   color: '#2f3241',
    //   symbolColor: '#74b1be',
    //   height: 30
    // },
    fullscreenable: false,

    frame: false,
    transparent: true,
    // useContentSize: true,
    webPreferences: {
      devTools: true,
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow1.aspectRatio = aspectRatio
  mainWindow1.windowType = windowType
  // mainWindow1.on('resize', () => {
  //   let [width, height] = mainWindow1.getSize();
  //   console.log(mainWindow1.getSize())
  //   console.log(maxHeight)
  //   // height = maxHeight/2;
  //   width = Math.round(height * aspectRatio);
  //   mainWindow1.setSize(width, height);
  //   // if (height >= maxHeight/2) {
  //   //   console.log(width)
  //   // }
  //   console.log(mainWindow1.getSize())
  // });

    // mainWindow2 = new BrowserWindow({
    //   title: "mainWindow2",
    //   width: 800,
    //   height: 600,
    //   frame: false,
    //   webPreferences: {
    //     // nodeIntegration: true,
    //     // contextIsolation: false
    //     preload: path.join(__dirname, 'preload.js')

    //   }
    // });
  
    // Load an HTML file into the windows
    mainWindow1.loadURL(url);
    // mainWindow2.loadURL('http://localhost:5173');
    mainWindow1.setAspectRatio(aspectRatio);
    // mainWindow2.setAspectRatio(128/108)
    // mainWindow2.loadFile('index.html');
    mainWindow1.webContents.on('did-finish-load', () => {
      // Emit a message to the server
      mainWindow1.show();
      mainWindow1.focus();
    });
    
    
    // ipcMain.on('start-dragging', () => {
    //   mainWindow1.webContents.send('drag-started');
    //   mainWindow1.on('will-resize', (e) => {
    //     e.preventDefault();
    //   });
    //   mainWindow1.setMovable(true);
    // });
  

    // Make sure the window contents have been loaded before sending messages
    // mainWindow1.webContents.on('did-finish-load', () => {
    //   // Emit a message to the server
    //   socket.emit('message', 'Hello, Server');
    // });

    // ipcMain.on("message", (event, message) => {
    //     const senderWebContents = event.sender;
    //     const windowId = senderWebContents.id;

    //     socket.emit("message", `Message from window ID ${windowId}: ${message}`)
    // })

    // ipcMain.on('get-process-id', async (event) => {
    //     const senderWebContents = event.sender;
    //     const pid = await senderWebContents.getOSProcessId();
        
    //     console.log(`Renderer Process ID: ${pid} from ${senderWebContents.getTitle()}`);
    
    //     // Optionally send the PID back to the renderer process that requested it
    //     event.returnValue = pid;
    //   });
    
  
    // // Handle incoming Socket.io messages
    // socket.on('update', (data) => {
    //     console.log("received message ", data)
    //     // data.search()
    //   // Update both windows with the data received from the server
    //   if (mainWindow1 && !mainWindow1.isDestroyed() && data.data.includes("ID 2")) {
    //     mainWindow1.webContents.send('update', data);
    //   }
    //   if (mainWindow2 && !mainWindow2.isDestroyed() && data.data.includes("ID 1")) {
    //     mainWindow2.webContents.send('update', data);
    //   }
    // });

    // socket.on('open-new-table', (data) => {
    //     console.log("received message ", data)
    //     data["title"]
    //     // data.search()
    //   // Update both windows with the data received from the server
    //   if (mainWindow1 && !mainWindow1.isDestroyed()) {
    //     mainWindow1.webContents.send('update', data);
    //   }
    //   if (mainWindow2 && !mainWindow2.isDestroyed()) {
    //     mainWindow2.webContents.send('update', data);
    //   }
    // });
  }


app.whenReady().then(createWindow);
ipcMain.on('open-new-table', (event, arg) => {
  console.log(arg)
  allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length < 5) createWindow("Lightning Cash Game ⚡ " + arg + " Table 1", "table")
});


ipcMain.on('organize-tables', (event) => {
  // TODO
  // for 1 to 5 lines:
  //  try to fit all tables side by side
  //  if not able, add one line and try again
  // TODO MVP
  // fit up to 4 tables in a 2x2 grid
  win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  allWindows = BrowserWindow.getAllWindows()
  console.log(allWindows)
  allTables = []
  display = screen.getPrimaryDisplay().workAreaSize
  displayAspectRatio = display.width / display.height
  allWindows.forEach(window => {
    if (window.windowType == "table") {
      allTables.push(window)
    }
  });
  console.log(allTables)
  tableHeight = Math.round(display.height / 2)
  tableWidth = Math.round(tableHeight*win.aspectRatio)
  initialWidthPos = (display.width - tableWidth*2) / 2
  console.log(tableWidth, tableHeight)
  if (initialWidthPos < 0) initialWidthPos = 0
  console.log(tableWidth, tableHeight)
  positions = {
    "pos1" : [initialWidthPos, 0],
    "pos2" : [initialWidthPos + tableWidth, 0],
    "pos3" : [initialWidthPos, tableHeight],
    "pos4" : [initialWidthPos + tableWidth, tableHeight]
  }
  for (tableIndex = 0; tableIndex < allTables.length; tableIndex++) {
    console.log(`loop ${tableIndex}`)
    table = allTables[tableIndex]
    table.setSize(tableWidth, tableHeight)
    console.log(positions[`pos${tableIndex+1}`])
    table.setPosition(positions[`pos${tableIndex+1}`][0], positions[`pos${tableIndex+1}`][1])
  }
  // console.log(allWindows)
});
ipcMain.on('open-hh', (event) => {
  win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  console.log("open-hh")
});
ipcMain.on('set-window-size', (event, arg) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) {
    // console.log(event)
    console.log(arg)
    const { width, height, position } = arg;
    win.setSize(width, height);
    win.setPosition(position[0], position[1]);
  }
});

// Listen for window size get request
ipcMain.on('get-screen-size', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const position = win.getPosition()
    const aspectRatio = win.aspectRatio
    console.log(width, height, position)
    event.returnValue = { width, height, position, aspectRatio };
  }
});
ipcMain.on('get-title', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) {
    title = win.getTitle()
    event.returnValue = title;
  }
});
ipcMain.on('close-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) {
    if (win.windowType === "lobby") {
      dialog.showMessageBox({
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Exit',
        message: 'Are you sure you want to quit?',
      }).then((response) => {
        // response.response will be the index of the clicked button
        if (response.response === 0) {
          // Destroy the window to ensure that it is closed
          app.quit()
      // mainWindow.destroy();
        }
      });
  
      // app.quit()
    } else {
      dialog.showMessageBox({
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Close Table',
        message: 'Are you sure you want to close this table?',
      }).then((response) => {
        // response.response will be the index of the clicked button
        if (response.response === 0) {
          // Destroy the window to ensure that it is closed
          win.close()
      // mainWindow.destroy();
        }
      });
    }
  }

});
ipcMain.on('minimize-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) {
    win.minimize()
  }
  // mainWindow1.minimize()
});

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

