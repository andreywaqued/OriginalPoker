const fastify = require('fastify')({ logger: true });
const socketManager = require('socket.io')(fastify.server);
const PlayerPoolManager = require('./playerPoolManager');
// const TableManager = require('./tableManager');
const User = require('./user');
// const TableManager = require('./tableManager')
// const { Worker } = require('worker_threads');
// fastify.register(require('@fastify/postgres'), {
//   connectionString: 'postgresql://postgres:dbpass@db:5432/original_poker'
// })
// fastify.register(require('@fastify/redis'), { host: 'redis', port: 6379 })

playerPoolManager = new PlayerPoolManager(socketManager, fastify)
// tableManager = new TableManager(socketManager, fastify, playerPoolManager)
// tableManager.test()
console.log("starting")
// fastify.get('/', async (request, reply) => {
//   const client = await fastify.pg.connect();
//   const { rows } = await client.query('SELECT NOW()');
//   client.release();
//   return { time: rows[0].now };


//   return { hello: 'world' };
// });
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
  // console.log(socket)
  console.log(socket.connected)
  socket.on("signIn", (data) => {
    console.log(`received signin: ${data.user} ${data.password}`)
    User.createAndLogin(data.user, data.password).then(user => {
      socket.user = user
      socket.user.playerIDs = []
      socket.user.poolIDs = []
      socket.emit("signInResponse", {response : "user logged in", status: 200, user : user})
      socket.emit("updatePools", playerPoolManager.pools)
    }).catch(err => {
      console.log(err)
      socket.emit("signInResponse", {response : "failed to log in", status: 403})
    })
  })

  socket.on("enterPool", (data) => {
    console.log(`received enterPool: ${data.poolID} ${data.stackSize}`)
    return playerPoolManager.enterPool(socket, data.poolID, data.stackSize)
  })
  socket.on("leavePool", (player) => {
    console.log(`received leavePool: ${player.name} ${player.poolID}`)
    return playerPoolManager.leavePool(socket, player)
  })
  socket.on("parseAction", (data) => {
    console.log(`received parseAction: ${data.player.name} ${data.action}`)
    return playerPoolManager.tableManager.parseAction(socket, data.player, data.action)
  })
  socket.on("tryRebuy", (data) => {
    console.log(`received rebuyAction: ${data.playerID} ${data.poolID} ${data.stackSize}`)
    return playerPoolManager.rebuy(data.playerID, data.poolID, data.stackSize)
  })
  


  socket.on('message', (data) => {
    if (data.includes("1000")) console.log(`Received message: ${data}`)
    // console.log(`Received message: ${data}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    // console.log(socket)
    console.log(socket.connected)
    socket.leave("lobby")
    for (let i = 0; i< socket.user.playerIDs.length; i++) {
      const playerID = socket.user.playerIDs[i]
      const poolID = socket.user.poolIDs[i]
      playerPoolManager.leavePool(socket, {id:playerID, poolID: poolID})
    }
    delete playerPoolManager.sockets[socket.id]
  });
});
const port = process.env.PORT || 3000
fastify.listen({
  host: "0.0.0.0",
  port:port
  }, 
  (err) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
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

