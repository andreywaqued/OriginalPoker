const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors')
fastify.register(cors, { 
  // put your options here
})
const socketManager = require('socket.io')(fastify.server);
const Decimal = require('decimal.js');
const Logger = require("./logger")
const logger = new Logger("Server")
//docker acess
// fastify.register(require('@fastify/postgres'), {
//   connectionString: 'postgresql://postgres:dbpass@db:5432/original_poker'
// })
//internal render acess
fastify.register(require('@fastify/postgres'), {
  connectionString: 'postgres://original:fSuZdEE7T6fTqVCOlEobSioKlfwR4Rrb@dpg-ckdeitsgonuc73cmsucg-a/original_db'
})
fastify.register(require('@fastify/redis'), {
  url: 'redis://red-cksjdg6nfb1c73c8tgpg:6379'
})
//external render acess
// fastify.register(require('@fastify/postgres'), {
//     connectionString: 'postgres://original:fSuZdEE7T6fTqVCOlEobSioKlfwR4Rrb@dpg-ckdeitsgonuc73cmsucg-a.oregon-postgres.render.com/original_db?ssl=true'
//   })
// fastify.register(require('@fastify/redis'), {
//   url: 'rediss://red-cksjdg6nfb1c73c8tgpg:eEjoQXin0xOlVfhsOu26xy3BpIjjdgul@oregon-redis.render.com:6379'
// })
const LightningPoolManager = require('./lightning/playerPoolManager'); //testing the table
// const TournamentPoolManager = require('./tournaments/playerPoolManager');
// const TableManager = require('./tableManager');
const User = require('./user');
// const TableManager = require('./tableManager')
// const { Worker } = require('worker_threads');
fastify.addHook('onReady', async () => {
  logger.log("connected")
  // const client = await fastify.pg.connect()
  // await fastify.pg.query(`ALTER TABLE users ADD COLUMN settings JSONB`)
  // await fastify.pg.query("DROP TABLE hands")
  // await fastify.pg.query("DROP TABLE moneyTransactions")
  // await fastify.pg.query("DROP TABLE handsByUser")
  /* add extensions */
  fastify.pg.query("CREATE EXTENSION IF NOT EXISTS pgcrypto")
  fastify.pg.query("CREATE EXTENSION IF NOT EXISTS citext")
  fastify.pg.query("CREATE TABLE IF NOT EXISTS users(userid serial PRIMARY KEY, username CITEXT UNIQUE NOT NULL,password VARCHAR ( 256 ) NOT NULL,email CITEXT UNIQUE NOT NULL, avatar SMALLINT, balance NUMERIC,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP, settings JSONB)")
  fastify.pg.query("CREATE TABLE IF NOT EXISTS hands(handid serial PRIMARY KEY, handHistory text, created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
  fastify.pg.query("CREATE TABLE IF NOT EXISTS moneyTransactions(id serial PRIMARY KEY, userid serial NOT NULL, amount NUMERIC NOT NULL, source VARCHAR(50) NOT NULL, created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
  fastify.pg.query("CREATE TABLE IF NOT EXISTS handsByUser(userid serial NOT NULL, handid serial NOT NULL, created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (userid, handid))")
  // client.release()
})
//COMENTEI PQ NAO TA FUNCIONANDO
// fastify.addHook('onClose', async () => {
//   logger.log("onClose")
//   //return the money to the players that were waiting to leave the pool
//   Object.keys(lightningPoolManager.sockets).forEach((socketID)=>{
//     lightningPoolManager.sockets[socketID].disconnect()
//   })
//   Object.keys(lightningPoolManager.leavePoolTimeout).forEach((key)=>{
//     lightningPoolManager.leavePoolTimeout[key]._onTimeout()
//     clearTimeout(lightningPoolManager.leavePoolTimeout[key])
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
lightningPoolManager = new LightningPoolManager(socketManager, fastify, usersConnected)
// tournamentPoolManager = new TournamentPoolManager(socketManager, fastify, usersConnected)
async function tryReconnect(socket, user) {
  logger.log("tryReconnect");
    logger.log(user);
    let userRecovered = usersConnected[user.id]
    if (!userRecovered) {
      userRecovered = await User.getUserFromDB(user.name, fastify.pg);
    }
    if (!userRecovered) return logger.log("user is undefined")
    socket.userID = userRecovered.id
    userRecovered.socketID = socket.id
    usersConnected[userRecovered.id] = userRecovered
    lightningPoolManager.socketsByUserID[userRecovered.id] = socket
    socket.emit("updateUserInfo", {user: userRecovered, status: 200})
    socket.emit("updatePools", lightningPoolManager.pools)
    // Recuperar os jogadores desconectados do usuário
    for (const player of Object.values(userRecovered.players)) {
      if (!player) {
        logger.log("player is null/undefined")
        continue
      }
      if (player.tableClosed) {
        logger.log("player.tableClosed is true, doesnt need to send info anymore")
        continue
      }
      logger.log("reconnecting playerName: " + player.name + " at table: " + player.tableID)
      player.socketID = socket.id;

      // if (!player.isDisconnected) {
      //   logger.log("player is not disconnected")
      //   continue
      // }
      player.tableClosed = false;
      player.isDisconnected = false;
      // player.isSitout = false;
      const table = lightningPoolManager.tableManager.tables[player.poolID][player.tableID];
      if (!table) {
        logger.log("table is undefined, sending empty table");
        lightningPoolManager.sendEmptyTable(player)
        lightningPoolManager.sitoutUpdate(player.id, player.poolID, player.isSitout)
        continue
      }
      if (table.socketsByUserID[player.userID]) table.socketsByUserID[player.userID] = socket //check if is not undefined, and then change it on the table
      if (!table.broadcastHandState(player.id)) {
        logger.log("failed to broadcast hand state, sending empty table.")
        lightningPoolManager.sendEmptyTable(player)
        lightningPoolManager.sitoutUpdate(player.id, player.poolID, player.isSitout)
        // lightningPoolManager.leavePool(socket, player, true)
        // socket.emit("closeTable", player.id)
        // logger.log("closing table, because player is not there anymore.")
        continue
      }
    }
    return userRecovered
}

// async function changeAvatar(socket, avatar) {
//   await User.getChangeAvatarUserFromDB(socket.userID, avatar, fastify.pg).then(()=>{
//     console.log("updated avatar");
//   });
//   const user = usersConnected[socket.userID]
//   user.avatar = avatar;
//   socket.emit("updateUserInfo", {user: user, status: 200})
// }
// tableManager = new TableManager(socketManager, fastify, lightningPoolManager)
// tableManager.test()
logger.log("starting")
fastify.get('/users', async (request, reply) => {
  logger.log("/users")
  // const client = await fastify.pg.connect();
  const { rows } = await fastify.pg.query('SELECT * FROM users');
  // client.release();
  logger.log(rows)
  return rows;
});
fastify.get('/updateUserSettings', async (request, reply) => {
  logger.log("/updateUserSettings")
  let userSettings = {
    sounds: true,
    preferedSeat: {"3max": 0, "6max": 0, "9max": 0},
    showValuesInBB: true,
    adjustBetByBB: true,
    presetButtons: {
        preflop:[
            {type: "pot%", value: 25, display: "%"},
            {type: "pot%", value: 50, display: "%"},
            {type: "pot%", value: 75, display: "%"},
            {type: "pot%", value: 100, display: "%"}
        ], 
        postflop:[
            {type: "pot%", value: 25, display: "%"},
            {type: "pot%", value: 50, display: "%"},
            {type: "pot%", value: 75, display: "%"},
            {type: "pot%", value: 100, display: "%"}
        ]
    }
  }
  // const client = await fastify.pg.connect();
  const { rows } = await fastify.pg.query(`UPDATE users SET settings = '${JSON.stringify(userSettings)}'`);
  // client.release();
  logger.log(rows)
  return rows;
});
fastify.get('/usersConnected', async (request, reply) => {
  return usersConnected;
});
fastify.get('/adsCount', async (request, reply) => {
  const { rows } = await fastify.pg.query('SELECT count(*) FROM handsByUser');
  return rows[0];
});
fastify.get('/handsByUser', async (request, reply) => {
  // const client = await fastify.pg.connect();
  const users = {
    "Andrey": 1,
    "icaro": 2,
    "Giu" : 3,
    "Andersen": 4,
    "sgsabioni": 5,
    "grocha86": 6,
    "campeaodoms": 7,
    "Squirting": 8,
    "sarxa": 9,
    "gaban" : 10
  }
  await fastify.pg.query(`DELETE FROM hands WHERE handHistory = 'asdadsa'`);
  const { rows } = await fastify.pg.query(`SELECT * FROM hands`);
  rows.forEach(hand=>{
    const handID = hand.handid
    const created_on = hand.created_on
    const matches = [...hand.handhistory.matchAll(/Seat \d: ([\w\d.,]+)/g)]
    console.log(matches)
    let insertQuery = ""
    matches.forEach(playerMatch => {
      const playerName = playerMatch[1]
      const userID = users[playerName]
      insertQuery += `INSERT INTO handsByUser(userid, handid, created_on) VALUES (${userID}, ${handID}, '${new Date(created_on).toISOString()}');`
    } )
    fastify.pg.query(insertQuery);
    // return players
    // console.log(players)
  })
  // return result;
});
fastify.get('/getUsers', async (request, reply) => {
  // const client = await fastify.pg.connect();
  const { rows } = await fastify.pg.query(`SELECT users.userid, users.username, users.last_login, users.balance, count(handsByUser.userid) AS hands_count FROM users LEFT JOIN handsByUser ON users.userid = handsByUser.userid GROUP BY users.username, users.last_login, users.balance, users.userid ORDER BY users.last_login DESC`)
  return rows;
});
fastify.get('/hands', async (request, reply) => {
  // const client = await fastify.pg.connect();
  const { rows } = await fastify.pg.query('SELECT * FROM hands');
  // client.release();
  logger.log(rows)
  return rows;
});
fastify.get('/getHandsCount', async (request, reply) => {
  // const client = await fastify.pg.connect();
  const { rows } = await fastify.pg.query('SELECT count(*) FROM hands');
  // client.release();
  logger.log(rows)
  return rows[0].count;
});
fastify.get('/transactions', async (request, reply) => {
  // const client = await fastify.pg.connect();
  const { rows } = await fastify.pg.query('SELECT * FROM moneyTransactions');
  // client.release();
  logger.log(rows)
  return rows;
});
fastify.get('/addchips', async (request, reply) => {
  try {
    logger.log(request.query)
    const userid = parseInt(request.query.user)
    const chips = new Decimal(request.query.chips)
    // const client = await fastify.pg.connect();
    await User.handleMoney(chips.toNumber(), userid, 'ORIGINAL CASHIER', fastify.pg);
    const user = usersConnected[userid]
    if (!user) return logger.log("user undefined")
    user.balance = user.balance.plus(chips)
    const socket = lightningPoolManager.socketsByUserID[userid]
    if (!socket) return logger.log("socket undefined")
    socket.emit("updateUserInfo", { user : user, status: 200})
    // logger.log("socketManager.sockets.sockets")
    // logger.log(socketManager.sockets.sockets)
    // socketManager.sockets.sockets.forEach((socket, socketID) => {
    //   logger.log(socketID)
    //   logger.log(socket)
    //   if (socket.user) {
    //     logger.log("updating chips on player " + socket.user.name)
    //     if (socket.user.id === userid) socket.user.balance = socket.user.balance.plus(chips)
    //     socket.emit("updateUserInfo", { user : socket.user, status: 200})
    //   }
    // })
    return `Added $${chips} to ${user.name} that have a total of ${user.balance}`;
  } catch (err) {
    return console.log(err)
  }
  // client.release();
});
fastify.get('/pools', async (request, reply) => {
  return lightningPoolManager.playersByPool
});
fastify.get('/tables', async (request, reply) => {
  let tablesMap = {}
  logger.log(lightningPoolManager.tableManager.tables)
  Object.values(lightningPoolManager.tableManager.tables).forEach((pool) => {
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
//     logger.log(err || "ok")
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
//     logger.log(error)
//   })
// });
// fastify.get('/get', async (request, reply) => {
//   const { user } = request.query
//   const { redis } = fastify
//   let response = ""
//   redis.get(`user${user}`, (err, val) => {
//     logger.log(err || JSON.stringify(val))
//     response = err || JSON.stringify(val)
//   })  
//   return { response: response }
// });

socketManager.on('connection', (socket) => {
  logger.log('New connection:', socket.id);
  socket.join("lobby")
  socket.emit("updatePools", lightningPoolManager.pools)
  if (socket.recovered) {
    // recovery was successful: socket.id, socket.rooms and socket.data were restored
    logger.log("socket recovered: " + socket.id)
    logger.log(socket.userID)
  } else {
    logger.log('brand new connection: ' + socket.id);
    // new or unrecoverable session
  }

  // logger.log(socket)
  socket.on("signIn", (data) => {
    try {
      const {user, password} = data
      logger.log(`received signin: ${user}`)
      User.signIn(user, password, fastify.pg).then(async user => {
        logger.log("signed user")
        logger.log(user)
        user = await tryReconnect(socket, user)
        // socket.userID = user.id
        // user.socketID = socket.id
        // usersConnected[user.id] = user
        // lightningPoolManager.socketsByUserID[user.id] = socket
        logger.log("signIn 1")
        socket.emit("signInResponse", {response : "user logged in", status: 200, user})
        logger.log("signIn 2")
        socket.emit("updatePools", lightningPoolManager.pools)
      }).catch((err) => {
        logger.log(err)
        socket.emit("signInResponse", {response : "failed to log in", status: 403, error: err.message})
      })
    } catch (error) {
      logger.log(error)
    }
  })

  socket.on("signUp", (data) => {
    try {
      const {user, password, email} = data
      logger.log(`received signup: ${user} ${email}`)
      User.signUp(user, password, email, fastify.pg).then(()=>{
        socket.emit("signUpResponse", {response : "user signed up", status: 200})
      }).catch((err) => {
        logger.log(err)
        socket.emit("signUpResponse", {response : "failed to sign up", status: 403, error: err.message})
      })
    } catch (error) {
      logger.log(error)
    }
  })

  socket.on("changeAvatar", (data) => {
    try {
      const {userAvatar} = data
      const user = usersConnected[socket.userID]
      if (!user) return logger.log("user not found", "ERROR", "changeAvatar")
      logger.log(`received change avatar: ${user.name} ${userAvatar}`)
      user.avatar = userAvatar
      User.changeAvatar(socket.userID, userAvatar, fastify.pg)
    } catch (error) {
      logger.log(error)
    }
  })

  socket.on("updateUserSettings", (userSettings) => {
    try {
      logger.log("updateUserSettings", "INFO")
      logger.log(userSettings)
      const user = usersConnected[socket.userID]
      if (!user) return logger.log("user not found", "ERROR", "updateUserSettings")
      user.settings = userSettings
      User.updateUserSettings(socket.userID, userSettings, fastify.pg)
    } catch (error) {
      logger.log(error)
    }
  })

  socket.on("enterPool", (data) => {
    try {
      logger.log(`received enterPool: ${data.poolID} ${data.stackSize}`)
      return lightningPoolManager.enterPool(socket, data.poolID, data.stackSize)
    } catch (error) {
      logger.log(error)
    }
  })
  socket.on("leavePool", (player) => {
    try {
      logger.log(`received leavePool: ${player.name} ${player.poolID}`)
      const user = usersConnected[player.userID]
      if (!user) {
        logger.log("user not find, something went wrong")
        logger.log(player)
        logger.log(usersConnected)
        return
      }
      if (socket.id != user.socketID) return logger.log("socket mismatch on leavepool")
      return lightningPoolManager.leavePool(player, true)
    } catch (error) {
      logger.log(error)
    }
  })
  socket.on("parseAction", (data) => {
    try {
      logger.log(`received parseAction: ${data.player.name} ${data.action}`)
      const user = usersConnected[data.player.userID]
      if (!user) {
        logger.log("user not find, something went wrong")
        logger.log(data.player)
        logger.log(usersConnected)
        return
      }
      if (socket.id != user.socketID) return logger.log("socket mismatch on parseAction")
      return lightningPoolManager.tableManager.parseAction(socket, data.player, data.action)
    } catch (error) {
      logger.log(error)
    }
  })
  socket.on("tryRebuy", (data) => {
    try {
      logger.log(`received rebuyAction: ${data.playerID} ${data.poolID} ${data.stackSize}`)
      return lightningPoolManager.rebuy(data.playerID, data.poolID, data.stackSize)
    } catch (error) {
      logger.log(error)
    }
  })
  socket.on("sitoutUpdate", (data) => {
    try {
      logger.log(`sitoutUpdate: ${data.playerID} ${data.poolID} ${data.isSitout}`)
      return lightningPoolManager.sitoutUpdate(data.playerID, data.poolID, data.isSitout)
    } catch (error) {
      logger.log(error)
    }
  })
  socket.on('getUserTransactions', async ({user, offset}) => {
    try {
      console.log("getUserTransactions")
      const u = usersConnected[user.id]
      if (!u) return console.log("this user is not connected");
      // const client = await fastify.pg.connect();
      logger.log(`received request getUserTransactions: userid ${socket.userID}`)
      const txs = await User.getUserTransactionsFromDB(socket.userID, offset, fastify.pg)
      // client.release();
      // logger.log(txs)
      return socket.emit('userTransactionsResponse', {txs, offset})
    } catch (error) {
      logger.log(error)
    }
  })
  socket.on('reconnectPlayer', async (user) => {
    try {
      logger.log("reconnectPlayer")
      await tryReconnect(socket, user)
    } catch (error) {
      logger.log(error)
    }
  });
  // socket.on('disconnecting', (reason) => {
  //   logger.log(`User disconnecting: ${socket.id}`);
  //   logger.log(reason)
  //   // logger.log(socket)
  //   logger.log(socket.connected)
  //   socket.leave("lobby")
  //   if (!socket.user) return logger.log("player didnt loggedin")
  //   logger.log(JSON.stringify(socket.user))
  //   const userID = socket.user.id
  //   disconnectedPlayers[userID] = []
  //   for (let i = 0; i< socket.user.playerIDs.length; i++) {
  //     const playerID = socket.user.playerIDs[i]
  //     const poolID = socket.user.poolIDs[i]
  //     logger.log("player disconnected: " + playerID + " - " + poolID)
  //     let player = lightningPoolManager.playersByPool[poolID][playerID];
  //     if (!player) return logger.log("player is undefined")
  //     player.tableClosed = true;
  //     player.isDisconnected = true;
  //     disconnectedPlayers[userID].push({playerID, poolID})
      

  //     logger.log("player disconnected: " + playerID + " - " + poolID)

  //     // lightningPoolManager.leavePool(socket, {id:playerID, poolID: poolID}, true)
  //   }
  //   delete lightningPoolManager.sockets[socket.id]
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
//     logger.log(err || "ok")
//   })
//   redis.get("message", (err, val) => {
//     logger.log(err || JSON.stringify(val))
//   })
//   logger.log(`Main thread received message: ${JSON.stringify(message)}`);

// });

