const Decimal = require('decimal.js');
//responsible for update a table game state
//will map each action to its correct table and so on.
//initially will be just an object, later on possible becoming a microservice
// const { parentPort } = require('worker_threads');

const Table = require("./table")
// // Receive messages from the main thread
// parentPort.on('message', (message) => {
//   console.log(`Worker thread received message: ${JSON.stringify(message)}`);

//   // Send an object back to the main thread
//   parentPort.postMessage({ message: 'Hi, main thread!', value: 24 });
// });
class TableManager {
    constructor(socketManager, fastify, playerPoolManager) {
        console.log("Table Manager")
        // console.log(socketManager)
        // console.log(fastify)
        // console.log(playerPoolManager)
        this.socketManager = socketManager
        this.fastify = fastify
        // this.db = fastify.pg
        // this.redis = fastify.redis
        this.playerPoolManager = playerPoolManager
        this.tables = {}
        // Object.keys(this.playerPoolManager.pools).forEach(poolID => {
        //     this.createNewTable(poolID)
        // })
    }
    createNewTable(poolID) {
        console.log("createNewTable(poolID)")
        console.log(poolID)
        const pool = this.playerPoolManager.pools[poolID]
        const newTable = new Table(this, pool, poolID)
        if (poolID in this.tables === false) this.tables[poolID] = {}
        this.tables[poolID][newTable.id] = newTable
        return newTable
        // this.tables.push(new Table())
    }
    placePlayerIntoTable(player) {
        console.log("placePlayerIntoTable(player)")
        // let playerJoined = false
        //check if player can join table

        if (!player) return console.log("player is undefined, something went wrong.")
        if (player.isSitout) return player.tableID = undefined
        if (player.stackSize.equals(0)) return player.tableID = undefined//ask if wants to rebuy
        // console.log(player.poolID)
        // console.log(this.tables[player.poolID])
        for (const key in this.tables[player.poolID]) {
            const table = this.tables[player.poolID][key]
            if (!table) continue
            if (!table.waitingForPlayers) continue
            if (player.userID in table.socketsByUserID) continue
            if (table.countPlayers() === table.tableSize) continue
            table.sitPlayer(player)
            return
        }
        // if (!playerJoined) {
            // }
        const table = this.createNewTable(player.poolID)
        table.sitPlayer(player)
        return 
    }
    parseAction(socket, player, action) {
        console.log("parseAction(socket, player, action)")
        console.log(socket.id)
        console.log(player.name)
        console.log(action)
        const table = this.tables[player.poolID][player.tableID]
        if (!table.validateAction(player, action)) return console.log("failed to make action")
        // this.socketManager.to(`table:${table.id}`).emit("updateGameState", {tableID : table.id, gameState : table.currentHand})
        if (socket) socket.emit("parseActionResponse", {response: "action received", status: 200, action: action, player: player})
        console.log("action parsed.")
    }
    deleteTable(poolID, tableID) {
        console.log("deleteTable(id)")
        this.socketManager.socketsLeave(`table:${tableID}`)
        delete this.tables[poolID][tableID]
        this.fastify.redis.del(`table:${tableID}`)
    }
    test() {
        console.log("TableManager working")
    }
}

module.exports = TableManager;