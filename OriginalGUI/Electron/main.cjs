// main.js
const {app, BrowserWindow, ipcMain, Notification, dialog, screen} = require('electron');
const io = require('socket.io-client');
const path = require('path');
const { shell } = require('electron');
const sound = require('sound-play')
// const express = require('express');
// const { fileURLToPath } = require('url');
// const {handler} = require("./build/handler")
// import {app, BrowserWindow, ipcMain, Notification, dialog, screen} from 'electron';
// import io from 'socket.io-client';
// import path from 'path';
// import { handler } from './build/handler.js';
// import express from 'express';


// // let SvelteKit handle everything else, including serving prerendered pages and static assets
// let handler 
// const handlerPath = path.join(__dirname, 'build/handler.js')
// console.log(handlerPath)
// const moduleURL = fileURLToPath(handlerPath)
// console.log(moduleURL)
// const serverApp = express();
// import('./build/handler.js').then(module => {
//   handler = module.handler;
//   serverApp.use(handler);
//   serverApp.listen(10000, () => {
//     console.log('listening on port 10000');
//   });
// })

// try {
//   require('electron-reloader')(module)
// } catch (_) {}

// const socket = io('http://localhost:3000', { // Replace with your server's address
const socket = io('https://originaltrial.onrender.com', {
  reconnection: true,
  reconnectionAttempts: 30,
  reconnectionDelay: 1000,  // 1 segundo
  timeout: 20000,
}); // Replace with your server's address

// Serve the static SvelteKit build files
// serverApp.use(express.static(path.join(__dirname, 'svelte/myapp/build/client')));
// console.log(path.join(__dirname, 'svelte/myapp/.svelte-kit/output/server'))

function createWindow(winTitle = "Main Lobby", windowType = "lobby") {
  const primaryDisplay = screen.getPrimaryDisplay()
  // const { width, height } = primaryDisplay.workAreaSize
  let aspectRatio = 4/3 //lobby
  // let url = 'http://localhost:10000/lobby'
  let url = 'build/lobby.html'
  if (windowType === "table") {
    aspectRatio = 128/108 //mesa
    url = 'build/table.html'
  } 
  const initialHeight = 750
  const maxHeight = primaryDisplay.workAreaSize['height']
  let newWindow = new BrowserWindow({
    title: winTitle,
    height: initialHeight,
    width: initialHeight * aspectRatio,
    minWidth: 600,
    maximizable: false,
    icon: __dirname + '/icon.png',
    fullscreenable: false,

    frame: false,
    transparent: true,
    // useContentSize: true,
    webPreferences: {
      devTools: true,
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      // devTools: false
    }
  });
  newWindow.aspectRatio = aspectRatio
  newWindow.windowType = windowType
  
    // Load an HTML file into the windows
    // newWindow.loadURL(url);
    newWindow.loadFile(path.join(__dirname, url));
    // mainWindow2.loadURL('http://localhost:5173');
    newWindow.setAspectRatio(aspectRatio);
    // mainWindow2.setAspectRatio(128/108)
    // mainWindow2.loadFile(join('svelte\myapp\src\app.html'));
    newWindow.webContents.on('did-finish-load', () => {
      // Emit a message to the server
      newWindow.showAndFocus();
      // newWindow.focus({
      //   steal: true
      // });
    });
    newWindow.readyToReceiveMessages = false;
    newWindow.messageBuffer = []
    newWindow.startBufferSender = setInterval(() => {
      if (newWindow.messageBuffer.length > 0) {
        if (!newWindow) {
          clearInterval(newWindow.startBufferSender)
          return
        }
        if (!newWindow.readyToReceiveMessages) return
        const message = newWindow.messageBuffer.shift()
        newWindow.webContents.send(message.event, message.data)
      }
    }, 15)
      // console.log(newWindow.readyToReceiveMessages)
      // console.log(event, data)
      
    
    newWindow.addMessage = (event, data) => {
      // console.log(newWindow.readyToReceiveMessages)
      // console.log(event, data)
      return newWindow.messageBuffer.push({event: event, data: data})
      if (newWindow.messageBuffer.length === 0) return newWindow.webContents.send(event, data)
      if (newWindow.readyToReceiveMessages) return newWindow.webContents.send(event, data)
      if (!newWindow.readyToReceiveMessages) return newWindow.messageBuffer.push({event: event, data: data})
    }
    newWindow.sendMessage = (event, data) => {
      // console.log(newWindow.readyToReceiveMessages)
      // console.log(event, data)
      if (!newWindow) return
      if (newWindow.messageBuffer.length === 0) return newWindow.webContents.send(event, data)
      if (newWindow.readyToReceiveMessages) return newWindow.webContents.send(event, data)
      if (!newWindow.readyToReceiveMessages) return newWindow.messageBuffer.push({event: event, data: data})
    }
    newWindow.showAndFocus = () => {
      if (!newWindow) return
      newWindow.show()
      newWindow.setAlwaysOnTop(true)
      newWindow.focus({steal:true})
      newWindow.setAlwaysOnTop(false)
    }
    
    return newWindow
  }

  
let mainLobby
let user
let userTx
app.whenReady().then( () => {
  mainLobby = createWindow("Main Lobby", "lobby")
});
// let playerByTableIndex = []
let tables = []
let players = []
let playersID = []
socket.on('connect', () => {
    console.log(`Connected to the server with id: ${socket.id}`);
    // socket.emit("signIn", {user: "asd", password: "asd"})
    if (user) {
      socket.emit('reconnectPlayer', user);
      console.log("Tentando reconectar");
    }
});
socket.on("signInResponse", response => {
    console.log("signInResponse")
    console.log(response)
    if (response.status === 200) {
        // console.log("entrou aqui")
        user = response.user
        mainLobby.user = user
        // console.log(mainLobby)
        console.log("chamando send message")
        if (mainLobby) mainLobby.addMessage("updateUser", user)
        // ipcMain.emit("updateUser", user)
    // socket.emit("enterPool", {poolID : "lightning4", stackSize: 100})
    } else if (response.status === 403) {
        // show error
        const error = response.error
        if (mainLobby) mainLobby.addMessage("updateUserError", error)
    }
})
socket.on("signUpResponse", response => {
  console.log("signUpReponse")
  console.log(response)
    if (response.status === 200) {
        // console.log("entrou aqui")
        user = response.user
        mainLobby.user = user
        // console.log(mainLobby)
        console.log("chamando send message")
        mainLobby.addMessage("signedUser", user)
    } else if (response.status === 403) {
        const error = response.error
        if (mainLobby) mainLobby.addMessage("signedUserError", error)
    }
})
socket.on("enterPoolResponse", response => {
    console.log("enterPoolResponse")
    // console.log(response)
    if (response.status === 200) {
      if (tables.length < 4) {
        const lastIndex = tables.push(createWindow(response.pool.title + " Table 1", "table")) - 1
        const table = tables[lastIndex]
        console.log(table)
        players.push(response.player)
        playersID.push(response.player.id)
        table.player = response.player
        console.log("chamando send message 1")
        if (table) table.addMessage("updatePlayer", table.player)
        
        // ipcMain.emit("updatePlayer", {})
      }
        // socket.emit("parseAction", {player: response.player, action: {type: "raise", amount: 200}})
        // socket.emit("leavePool", response.player)
    }
})
socket.on("updateGameState", gameState => {
    console.log("updateGameState")
    console.log(gameState)
    for (let i = 0; i < players.length; i++) {
      const player = players[i]
      const table = tables[i]
      if (player.id in gameState.players) {
        if (table) return table.addMessage("updateGameState", gameState)
      } 
    }
    console.log("didnt find the table opened, will try to find the player on the gamestate and open a new table")
    for (const player of Object.values(gameState.players)) {
      if (user.name === player.name) {
        console.log("found the player on the gamestate, opening new table.")
        if (player.tableClosed) {
          console.log("player.tableClosed is true")
          continue
        }
        if (tables.length < 4) {
          const lastIndex = tables.push(createWindow(gameState.title + " Table 1", "table")) - 1
          const table = tables[lastIndex]
          console.log(table)
          players.push(player)
          playersID.push(player.id)
          table.player = player
          console.log("chamando send message 1")
          if (table) table.addMessage("updateGameState", gameState)
          if (table) table.addMessage("updatePlayer", table.player)
        }
        // socket.emit("leavePool", player)
      } 
    }
})
socket.on("updateUserInfo", response => {
    console.log("updateUserInfo")
    console.log(response)
    user = response.user
    mainLobby.user = user
    if (mainLobby) mainLobby.addMessage("updateUser", user)
})
socket.on("updateUserTx", response => {
  console.log("updateUserTx")
  console.log(response)
  userTx = response
  if (mainLobby) mainLobby.addMessage("updateUserTx", userTx)
})
socket.on("updatePlayerInfo", player => {
    console.log("updatePlayerInfo")
    console.log(player)
    if (!player) return
    const playerIndex = playersID.indexOf(player.id)
    const table = tables[playerIndex]
    players[playerIndex] = player
    if (table) table.addMessage("updatePlayer", player)
})
socket.on("sitoutUpdate", data => {
    console.log("sitoutUpdate")
    console.log(data)
    const table = tables[playersID.indexOf(data.playerID)]
    if (table) table.addMessage("sitoutUpdate", data.isSitout)
})
socket.on("askRebuy", data => {
    console.log("askRebuy")
    console.log(data)
    const table = tables[playersID.indexOf(data.playerID)]
    if (table) table.addMessage("askRebuy", data)
})
socket.on("handTransition", player => {
    console.log("handTransition")
    console.log(player)
    const table = tables[playersID.indexOf(player.id)]
    if (table) table.addMessage("handTransition")
    // const table = tables[playersID.indexOf(playerID)]
    // if (table) table.addMessage("askRebuy", data)
})
socket.on("updateHandHistory", data => {
    console.log("updateHandHistory")
    if (!data.player) return console.log("player is undefined")
    if (!data.handHistory) return console.log("handHistory is undefined")
    const player = data.player
    const handHistory = data.handHistory
    const table = tables[playersID.indexOf(player.id)]
    if (table) table.addMessage("updateHandHistory", handHistory)
    // const table = tables[playersID.indexOf(playerID)]
    // if (table) table.addMessage("askRebuy", data)
})
socket.on("closeTable", playerID => {
    console.log("closeTable")
    console.log(playerID)
    console.log(playersID)
    console.log(tables)
    const tableIndex = playersID.indexOf(playerID)
    console.log(tableIndex)
    const table = tables[tableIndex]
    console.log(table)
    if (table) {
      table.close()
      tables.splice(tableIndex,1)
      players.splice(tableIndex,1)
      playersID.splice(tableIndex,1)
    }
})
socket.on("leavePoolResponse", response => {
    console.log("leavePoolResponse")
    // console.log(response)
})
socket.on("parseActionResponse", response => {
    console.log("parseActionResponse")
    // console.log(response)
})
socket.on("updatePools", (pools) => {
    console.log("updatePools")
    // console.log(pools)
    // console.log(mainLobby)
    console.log("chamando send message 2")
    if (mainLobby) mainLobby.addMessage("updatePools", pools)
})
socket.on('disconnect', () => {
  console.log('Disconnected from server');
  // reconnectToServer();
});
socket.io.on("reconnect_attempt", (attempt) => {
  console.log("reconnect_attempt")
  //TODO
  //colocar janela de tentativa de reconexao (aviso ao usuario e animacao de loading)
  // ...
});
socket.io.on("reconnect", (attempt) => {
  console.log("reconnect")
  //TODO
  //tirar janela de tentativa de reconexao e deixar tudo atualizado para o usuario
  // ...
});
socket.io.on("reconnect_failed", () => {
  //TODO 
  //colocar janela de falha de conexao e abrir a chamada de conexao manual.
  console.log("reconnect_failed")
  // ...
});



// socket.send("SIGN_IN;ALEXANDER;123456")


ipcMain.on('open-new-table', (event, data) => {
  console.log('open-new-table')
  console.log(data)
  
  // allWindows = BrowserWindow.getAllWindows()
  
  // if (allWindows.length < 5) createWindow("Lightning Cash Game ⚡ " + arg + " Table 1", "table")
  if (tables.length < 4) socket.emit("enterPool", {poolID : data.poolID, stackSize: data.stackSize})
});
ipcMain.on('openExternalUrl', (event, url) => {
  console.log('openExternalUrl')
  console.log(url)
  shell.openExternal(url)
});
ipcMain.on('focusOnWindow', (event) => {
  console.log('focusOnWindow')
  win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  win.showAndFocus()
});
ipcMain.on('playSound', (event, soundFile) => {
  console.log('playSound: ' + path.join(process.resourcesPath, soundFile))
  sound.play(path.join(process.resourcesPath, soundFile), 1)
});
ipcMain.on('sitoutUpdate', (event, data) => {
  console.log("sitoutUpdate")
  console.log(data)
  win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  console.log("sending sitout update")
  socket.emit("sitoutUpdate", data)
});
ipcMain.on('tryRebuy', (event, data) => {
  console.log(data)
  socket.emit("tryRebuy", {playerID: data.playerID, poolID : data.poolID, stackSize: data.stackSize})
  // allWindows = BrowserWindow.getAllWindows()
  
  // if (allWindows.length < 5) createWindow("Lightning Cash Game ⚡ " + arg + " Table 1", "table")
  // if (tables.length < 4) socket.emit("enterPool", {poolID : arg, stackSize: 100})
});
// Handle window-ready event from renderer process
ipcMain.on('signIn', (event, user) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  // console.log(user)
  if (win) {
    socket.emit("signIn", user)
  }
});
ipcMain.on('signUp', (event, user) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  // console.log(user)
  if (win) {
    socket.emit("signUp", user)
  }
});
ipcMain.on('changeAvatar', (event, user) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  // console.log(user)
  if (win) {
    socket.emit("changeAvatar", user)
  }
});
ipcMain.on('window-ready', (event) => {
  console.log("window is ready")
  const win = BrowserWindow.fromWebContents(event.sender)
  console.log(win)
  win.readyToReceiveMessages = true;
  // for (let i = win.messageBuffer.length; i > 0; i--) {
  //     const message = win.messageBuffer.pop()    
  //     console.log(message)
  //     console.log("chamando send message 3")
  //     win.sendMessage(message.event, message.data);
  //   };

  // if (win.messageBuffer.length > 0) {
  //   win.startBufferSender()
  //   // Flush the buffer to the window
  //   // messageBuffer[windowId] = [];
  // }
  // Mark the window as ready
});

ipcMain.on('organize-tables', (event) => {
  // TODO
  // for 1 to 5 lines:
  //  try to fit all tables side by side
  //  if not able, add one line and try again
  // TODO MVP
  // fit up to 4 tables in a 2x2 grid
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  // allWindows = BrowserWindow.getAllWindows()
  // console.log(allWindows)
  // allTables = []
  const display = screen.getPrimaryDisplay().workAreaSize
  // displayAspectRatio = display.width / display.height
  // allWindows.forEach(window => {
  //   if (window.windowType == "table") {
  //     allTables.push(window)
  //   }
  // });
  const allTables = tables
  console.log(allTables)
  const tableHeight = Math.round(display.height / 2)
  const tableWidth = Math.round(tableHeight*win.aspectRatio)
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
    const table = allTables[tableIndex]
    table.setSize(tableWidth, tableHeight)
    console.log(positions[`pos${tableIndex+1}`])
    table.setPosition(positions[`pos${tableIndex+1}`][0], positions[`pos${tableIndex+1}`][1])
    table.showAndFocus()
  }
  // console.log(allWindows)
});
ipcMain.on('open-hh', (event) => {
  win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  console.log("open-hh")
});
ipcMain.on('parseAction', (event, data) => {
  console.log("parseAction")
  console.log(data)
  socket.emit("parseAction", data)
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
ipcMain.on('getUserTx', () => {
  console.log("Requesting getUserTx")
  socket.emit('getUserTx')
})

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
  console.log(win)
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
          for (let i = tables.length - 1; i >= 0 ; i--) {
            console.log("leavePool player: " + players[i].id)
            console.log(players[i])
            socket.emit("leavePool", players[i])
            tables.splice(i,1)
            players.splice(i,1)
            playersID.splice(i,1)
          }
          // socket.disconnect()
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
          const tableIndex = tables.indexOf(win)
          console.log(tableIndex)
          console.log(playersID)
          console.log(players)
          socket.emit("leavePool", players[tableIndex])
          win.close()
          tables.splice(tableIndex,1)
          players.splice(tableIndex,1)
          playersID.splice(tableIndex,1)

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
  // newWindow.minimize()
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

