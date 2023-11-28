const Decimal = require('decimal.js');
//responsible for update a table game state
//will map each action to its correct table and so on.
//initially will be just an object, later on possible becoming a microservice
// const { parentPort } = require('worker_threads');

const Table = require("./table")
const Logger = require("../logger")
const logger = new Logger("TableManager")
// // Receive messages from the main thread
// parentPort.on('message', (message) => {
//   logger.log(`Worker thread received message: ${JSON.stringify(message)}`);

//   // Send an object back to the main thread
//   parentPort.postMessage({ message: 'Hi, main thread!', value: 24 });
// });
class TableManager {
    constructor(socketManager, fastify, playerPoolManager) {
        logger.log("Table Manager")
        // logger.log(socketManager)
        // logger.log(fastify)
        // logger.log(playerPoolManager)
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
    //tableManager
    organizeTables(tournament) {
        logger.log(`organizeTables(${tournament.id})`)
        const tablesNeeded = Math.ceil(tournament.currentPlayers.length/tournament.tableSize)
        // const maxPlayersPerTable = Math.ceil(tournament.currentPlayers/tablesNeeded)
        // if (tablesNeeded===tournament.tables.length) return logger.log("there is no need to reorganize the tables.")
        for (let i = tournament.tables.length; i<tablesNeeded; i++) {
            logger.log(`creating table ${i}`)
            tournament.tables.push(this.createNewTable(tournament))
        }
        for (let i = tournament.tables.length; i>tablesNeeded; i--) {
            logger.log(`deleting table ${i-1}`)
            tournament.tables.pop()
        }
        logger.log("organizeTables 1")
        let playerIndex = 0
        Object.values(tournament.playersByUserID).forEach(playersArray => {
            const player = playersArray[playersArray.length-1]
            if (player.leftPosition) return logger.log("player already left the tournament")
            logger.log(`sitting player ${player.id} at table ${playerIndex%tablesNeeded}`)
            const table = tournament.tables[playerIndex%tablesNeeded]
            if (player.tableID) player.nextTableID = table.id
            if (!player.tableID) this.placePlayerIntoTable(player, table.id)
            playerIndex++
        })
        logger.log("organizeTables 2")
    }
    createNewTable(tournament) {
        logger.log(`createNewTable(${tournament.id})`)
        const newTable = new Table(this, tournament)
        logger.log("createNewTable 1")
        if (tournament.id in this.tables === false) this.tables[tournament.id] = {}
        logger.log(JSON.stringify(newTable.id))
        this.tables[tournament.id][newTable.id] = newTable
        logger.log("createNewTable 2")
        return newTable
        // this.tables.push(new Table())
    }
    placePlayerIntoTable(player, tableID) {
        logger.log("placePlayerIntoTable(player, table)")
        if (!player) return logger.log("player is undefined, something went wrong.")
        const table = this.tables[player.tournamentID][tableID]
        if (!table) return logger.log("table is undefined, something went wrong.")
        table.sitPlayer(player)
        if (player.nextTableID) delete player.nextTableID
    }
    parseAction(socket, player, action) {
        logger.log("parseAction(socket, player, action)")
        logger.log(socket.id)
        logger.log(player.name)
        logger.log(player.tournamentID)
        logger.log(action)
        const table = this.tables[player.tournamentID][player.tableID]
        if (!table.validateAction(player, action)) return logger.log("failed to make action")
        // this.socketManager.to(`table:${table.id}`).emit("updateGameState", {tableID : table.id, gameState : table.currentHand})
        if (socket) socket.emit("parseActionResponse", {response: "action received", status: 200, action: action, player: player})
        logger.log("action parsed.")
    }
    deleteTable(poolID, tableID) {
        logger.log("deleteTable(id)")
        this.socketManager.socketsLeave(`table:${tableID}`)
        delete this.tables[poolID][tableID]
        this.fastify.redis.del(`table:${tableID}`)
    }
    test() {
        logger.log("TableManager working")
    }
}

module.exports = TableManager;