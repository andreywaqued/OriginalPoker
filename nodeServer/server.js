const fastify = require('fastify')({ logger: true });
const socketManager = require('socket.io')(fastify.server);
const Decimal = require('decimal.js');
//docker acess
// fastify.register(require('@fastify/postgres'), {
//   connectionString: 'postgresql://postgres:dbpass@db:5432/original_poker'
// })
//internal render acess
fastify.register(require('@fastify/postgres'), {
  connectionString: 'postgres://original:fSuZdEE7T6fTqVCOlEobSioKlfwR4Rrb@dpg-ckdeitsgonuc73cmsucg-a/original_db'
})
//external render acess
// fastify.register(require('@fastify/postgres'), {
//   connectionString: 'postgres://original:fSuZdEE7T6fTqVCOlEobSioKlfwR4Rrb@dpg-ckdeitsgonuc73cmsucg-a.oregon-postgres.render.com/original_db?ssl=true'
// })
const PlayerPoolManager = require('./playerPoolManager');
// const TableManager = require('./tableManager');
const User = require('./user');
// const TableManager = require('./tableManager')
// const { Worker } = require('worker_threads');
fastify.addHook('onReady', async () => {
  console.log("connected")
  // const client = await fastify.pg.connect()
  // fastify.pg.query("DROP TABLE users")
  // fastify.pg.query("DROP TABLE hands")
  // fastify.pg.query("DROP TABLE moneyTransactions")
  fastify.pg.query("CREATE TABLE IF NOT EXISTS users(userid serial PRIMARY KEY, username VARCHAR ( 20 ) UNIQUE NOT NULL,password VARCHAR ( 20 ) NOT NULL,email VARCHAR ( 255 ) UNIQUE NOT NULL, avatar SMALLINT, balance NUMERIC,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
  fastify.pg.query("CREATE TABLE IF NOT EXISTS hands(handid serial PRIMARY KEY, handHistory text, created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
  fastify.pg.query("CREATE TABLE IF NOT EXISTS moneyTransactions(id serial PRIMARY KEY, userid serial NOT NULL, amount NUMERIC NOT NULL, source VARCHAR(50) NOT NULL, created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
  // client.release()
})
//COMENTEI PQ NAO TA FUNCIONANDO
// fastify.addHook('onClose', async () => {
//   console.log("onClose")
//   //return the money to the players that were waiting to leave the pool
//   Object.keys(PlayerPoolManager.sockets).forEach((socketID)=>{
//     PlayerPoolManager.sockets[socketID].disconnect()
//   })
//   Object.keys(PlayerPoolManager.leavePoolTimeout).forEach((key)=>{
//     PlayerPoolManager.leavePoolTimeout[key]._onTimeout()
//     clearTimeout(PlayerPoolManager.leavePoolTimeout[key])
//   })
//   done()
// })
fastify.setErrorHandler((error, request, reply) => {
  request.log.error(error.toString());
  reply.send({ error: 'Internal server error' });
});
// fastify.register(require('@fastify/redis'), { host: 'redis', port: 6379 })
disconnectedPlayers = {}
usersConnected = {}
playerPoolManager = new PlayerPoolManager(socketManager, fastify, usersConnected)
async function tryReconnect(socket, user) {
  console.log("tryReconnect");
    console.log(user);
    let userRecovered = usersConnected[user.id]
    if (!userRecovered) {
      userRecovered = await User.getUserFromDB(user.name, fastify.pg);
    }
    if (!userRecovered) return console.log("user is undefined")
    socket.userID = userRecovered.id
    userRecovered.socketID = socket.id
    usersConnected[userRecovered.id] = userRecovered
    playerPoolManager.socketsByUserID[userRecovered.id] = socket
    socket.emit("updateUserInfo", {user: userRecovered, status: 200})
    socket.emit("updatePools", playerPoolManager.pools)
    // Recuperar os jogadores desconectados do usuário
    for (const player of Object.values(userRecovered.players)) {
      if (!player) {
        console.log("player is null/undefined")
        continue
      }
      console.log("reconnecting playerName: " + player.name + " at table: " + player.tableID)
      player.socketID = socket.id;
      // if (!player.isDisconnected) {
      //   console.log("player is not disconnected")
      //   continue
      // }
      player.tableClosed = false;
      player.isDisconnected = false;
      // player.isSitout = false;
      const table = playerPoolManager.tableManager.tables[player.poolID][player.tableID];
      if (!table) {
        console.log("table is undefined, sending empty table");
        playerPoolManager.sendEmptyTable(player)
        playerPoolManager.sitoutUpdate(player.id, player.poolID, player.isSitout)
        continue
      }
      if (table.socketsByUserID[player.userID]) table.socketsByUserID[player.userID] = socket //check if is not undefined, and then change it on the table
      if (!table.broadcastHandState(player.id)) {
        console.log("failed to broadcast hand state, sending empty table.")
        playerPoolManager.sendEmptyTable(player)
        playerPoolManager.sitoutUpdate(player.id, player.poolID, player.isSitout)
        // playerPoolManager.leavePool(socket, player, true)
        // socket.emit("closeTable", player.id)
        // console.log("closing table, because player is not there anymore.")
        continue
      }
    }
    return userRecovered
}
// tableManager = new TableManager(socketManager, fastify, playerPoolManager)
// tableManager.test()
console.log("starting")
fastify.get('/users', async (request, reply) => {
  // const client = await fastify.pg.connect();
  const { rows } = await fastify.pg.query('SELECT * FROM users');
  // client.release();
  console.log(rows)
  return rows;
});
fastify.get('/usersConnected', async (request, reply) => {
  return usersConnected;
});
fastify.get('/hands', async (request, reply) => {
  // const client = await fastify.pg.connect();
  const { rows } = await fastify.pg.query('SELECT * FROM hands');
  // client.release();
  console.log(rows)
  return rows;
});
fastify.get('/transactions', async (request, reply) => {
  // const client = await fastify.pg.connect();
  const { rows } = await fastify.pg.query('SELECT * FROM moneyTransactions');
  // client.release();
  console.log(rows)
  return rows;
});
fastify.get('/addchips', async (request, reply) => {
  console.log(request.query)
  const userid = parseInt(request.query.user)
  const chips = new Decimal(request.query.chips)
  // const client = await fastify.pg.connect();
  const result = await fastify.pg.query(`UPDATE users SET balance = balance + ${chips} WHERE userid = ${userid}; INSERT INTO moneyTransactions(userid, amount, source) VALUES(${userid}, ${chips}, 'ORIGINAL CASHIER')`);
  // client.release();
  const user = usersConnected[userid]
  if (!user) return console.log("user undefined")
  user.balance = user.balance.plus(chips)
  const socket = playerPoolManager.socketsByUserID[userid]
  if (!socket) return console.log("socket undefined")
  socket.emit("updateUserInfo", { user : user, status: 200})
  // console.log("socketManager.sockets.sockets")
  // console.log(socketManager.sockets.sockets)
  // socketManager.sockets.sockets.forEach((socket, socketID) => {
  //   console.log(socketID)
  //   console.log(socket)
  //   if (socket.user) {
  //     console.log("updating chips on player " + socket.user.name)
  //     if (socket.user.id === userid) socket.user.balance = socket.user.balance.plus(chips)
  //     socket.emit("updateUserInfo", { user : socket.user, status: 200})
  //   }
  // })
  console.log(result)
  return result;
});
fastify.get('/pools', async (request, reply) => {
  return playerPoolManager.playersByPool
});
fastify.get('/tables', async (request, reply) => {
  let tablesMap = {}
  console.log(playerPoolManager.tableManager.tables)
  Object.values(playerPoolManager.tableManager.tables).forEach((pool) => {
    Object.values(pool).forEach((table) => {
      tablesMap[table.id] = {
        title: table.title,
        players: table.players,
        waitingForPlayers: table.waitingForPlayers,
        hand: table.currentHand

      }
    })
  })
  return tablesMap
});
// fastify.get('/set', async (request, reply) => {
//   const { user, name } = request.query
//   const { redis } = fastify
//   let response = ""
//   redis.set(`user${user}`, name, (err) => {
//     console.log(err || "ok")
//     response = err || "ok"
//   })
//   return { response: response}
  
// });
// fastify.post('/signIn', async (request, reply) => {
//   const { username, password } = request.query
//   let user
//   User.createAndLogin(username, password).then(newUser => {
//     user = newUser
//   }).catch (error => {
//     console.log(error)
//   })
// });
// fastify.get('/get', async (request, reply) => {
//   const { user } = request.query
//   const { redis } = fastify
//   let response = ""
//   redis.get(`user${user}`, (err, val) => {
//     console.log(err || JSON.stringify(val))
//     response = err || JSON.stringify(val)
//   })  
//   return { response: response }
// });

socketManager.on('connection', (socket) => {
  console.log('New connection:', socket.id);
  socket.join("lobby")
  if (socket.recovered) {
    // recovery was successful: socket.id, socket.rooms and socket.data were restored
    console.log("socket recovered: " + socket.id)
    console.log(socket.userID)
  } else {
    console.log('brand new connection: ' + socket.id);
    // new or unrecoverable session
  }

  // console.log(socket)
  socket.on("signIn", (data) => {
    const {user, password} = data
    console.log(`received signin: ${user} ${password}`)
    User.signIn(user, password, fastify.pg).then(async user => {
      console.log("signed user")
      console.log(user)
      user = await tryReconnect(socket, user)
      // socket.userID = user.id
      // user.socketID = socket.id
      // usersConnected[user.id] = user
      // playerPoolManager.socketsByUserID[user.id] = socket
      console.log("signIn 1")
      socket.emit("signInResponse", {response : "user logged in", status: 200, user : user})
      console.log("signIn 2")
      socket.emit("updatePools", playerPoolManager.pools)
    }).catch((err) => {
      console.log(err)
      socket.emit("signInResponse", {response : "failed to log in", status: 403})
    })
  })

  socket.on("signUp", (data) => {
    const {user, password, email} = data
    console.log(`received signup: ${user} ${password} ${email}`)
    User.signUp(user, password, email, fastify.pg).then(()=>{
      socket.emit("signUpResponse", {response : "user signed up", status: 200})
    }).catch((err) => {
      console.log(err)
      socket.emit("signUpResponse", {response : "failed to sign up", status: 403})
    })
  })

  socket.on("enterPool", (data) => {
    console.log(`received enterPool: ${data.poolID} ${data.stackSize}`)
    return playerPoolManager.enterPool(socket, data.poolID, data.stackSize)
  })
  socket.on("leavePool", (player) => {
    console.log(`received leavePool: ${player.name} ${player.poolID}`)
    const user = usersConnected[player.userID]
    if (socket.id != user.socketID) return console.log("socket mismatch on leavepool")
    return playerPoolManager.leavePool(player, true)
  })
  socket.on("parseAction", (data) => {
    console.log(`received parseAction: ${data.player.name} ${data.action}`)
    const user = usersConnected[data.player.userID]
    if (socket.id != user.socketID) return console.log("socket mismatch on parseAction")
    return playerPoolManager.tableManager.parseAction(socket, data.player, data.action)
  })
  socket.on("tryRebuy", (data) => {
    console.log(`received rebuyAction: ${data.playerID} ${data.poolID} ${data.stackSize}`)
    return playerPoolManager.rebuy(data.playerID, data.poolID, data.stackSize)
  })
  socket.on("sitoutUpdate", (data) => {
    console.log(`sitoutUpdate: ${data.playerID} ${data.poolID} ${data.isSitout}`)
    return playerPoolManager.sitoutUpdate(data.playerID, data.poolID, data.isSitout)
  })
  socket.on('getUserTx', async () => {
    // const client = await fastify.pg.connect();
    const { rows } = await fastify.pg.query(`SELECT * FROM moneyTransactions WHERE userid = ${socket.userID} ORDER BY created_on DESC`);
    // client.release();
    console.log(`received request getUserTx: ${socket.userID}`)
    // console.log(rows)
    return socket.emit('updateUserTx', rows)
  })
  


  socket.on('message', (data) => {
    if (data.includes("1000")) console.log(`Received message: ${data}`)
    // console.log(`Received message: ${data}`);
  });
  socket.on('reconnectPlayer', async (user) => {
    console.log("reconnectPlayer")
    await tryReconnect(socket, user)
  });
  // socket.on('disconnecting', (reason) => {
  //   console.log(`User disconnecting: ${socket.id}`);
  //   console.log(reason)
  //   // console.log(socket)
  //   console.log(socket.connected)
  //   socket.leave("lobby")
  //   if (!socket.user) return console.log("player didnt loggedin")
  //   console.log(JSON.stringify(socket.user))
  //   const userID = socket.user.id
  //   disconnectedPlayers[userID] = []
  //   for (let i = 0; i< socket.user.playerIDs.length; i++) {
  //     const playerID = socket.user.playerIDs[i]
  //     const poolID = socket.user.poolIDs[i]
  //     console.log("player disconnected: " + playerID + " - " + poolID)
  //     let player = playerPoolManager.playersByPool[poolID][playerID];
  //     if (!player) return console.log("player is undefined")
  //     player.tableClosed = true;
  //     player.isDisconnected = true;
  //     disconnectedPlayers[userID].push({playerID, poolID})
      

  //     console.log("player disconnected: " + playerID + " - " + poolID)

  //     // playerPoolManager.leavePool(socket, {id:playerID, poolID: poolID}, true)
  //   }
  //   delete playerPoolManager.sockets[socket.id]
  //   socket.leave("lobby")
  // });
});
const port = process.env.PORT || 3000
fastify.listen({
  host: "0.0.0.0",
  port:port
  }, 
  (err) => {
    if (err) {
      fastify.log.error(err);
      // process.exit(1);
    }
  }
);


// const worker = new Worker('./matchmaking.js');

// // Send an object from the main thread to the worker thread
// worker.postMessage({ message: 'Hello, worker!', value: 42 });

// // Receive messages from the worker thread
// worker.on('message', (message) => {
//   const { redis } = fastify
//   redis.set("message", message, (err) => {
//     console.log(err || "ok")
//   })
//   redis.get("message", (err, val) => {
//     console.log(err || JSON.stringify(val))
//   })
//   console.log(`Main thread received message: ${JSON.stringify(message)}`);

// });

