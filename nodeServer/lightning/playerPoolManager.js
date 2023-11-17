//responsible for directioning each player to its table
// also responsible for asking for rebuy, handle reconnection, etc
//important to note that each user logged in, can play multiple tables
// so there is going to be 2 kind of players, the user and the player(inside the table) itself.
//initially will be just an object, later on possible becoming a microservice
// const { parentPort } = require('worker_threads');

const Decimal = require('decimal.js');
const Player = require("./player")
const TableManager = require("./tableManager")
const Logger = require("../logger")
const User = require('../user');
const logger = new Logger("PlayerPoolManager")
// // Receive messages from the main thread
// parentPort.on('message', (message) => {
//   logger.log(`Worker thread received message: ${JSON.stringify(message)}`);

//   // Send an object back to the main thread
//   parentPort.postMessage({ message: 'Hi, main thread!', value: 24 });
// });
class PlayerPoolManager {
    constructor(socketManager, fastify, usersConnected) {
        this.socketManager = socketManager
        this.fastify = fastify
        // this.db = fastify.pg
        // this.redis = fastify.redis
        this.socketsByUserID = {}
        this.users = usersConnected
        this.playersByPool = { "lightning1" : {}, "lightning2": {}, "lightning3": {}, "lightning4": {}}
        this.pools = {
            "lightning1" : {title: "Lightning Cash Game ⚡ NL 10", gameTitle: "NL 10", gameType: "cash", pokerVariant : "texas", betType : "NL", tableSize : 6, sb:0.05, bb: 0.1, minBuyIn: 2, maxBuyIn: 10, currentPlayers:0},
            "lightning2" : {title: "Lightning Cash Game ⚡ NL 50", gameTitle: "NL 50", gameType: "cash", pokerVariant : "texas", betType : "NL", tableSize : 6, sb:0.25, bb: 0.5, minBuyIn: 10, maxBuyIn: 50, currentPlayers:0},
            "lightning3" : {title: "Lightning Cash Game ⚡ NL 100", gameTitle: "NL 100", gameType: "cash", pokerVariant : "texas", betType : "NL", tableSize : 6, sb:0.50, bb: 1, minBuyIn: 20, maxBuyIn: 100, currentPlayers:0},
            "lightning4" : {title: "Lightning Cash Game ⚡ NL 200", gameTitle: "NL 200", gameType: "cash", pokerVariant : "texas", betType : "NL", tableSize : 6, sb:1, bb: 2, minBuyIn: 40, maxBuyIn: 200, currentPlayers:0}
        }
        this.leavePoolTimeout = {}
        this.tableManager = new TableManager(this.socketManager, fastify, this)
    }
    /**
     * 
     * @param {*} socket 
     * @param {string} poolID 
     * @param {number} stackSize 
     * @returns 
     */
    enterPool(socket, poolID, stackSize) {
        logger.log("enterPool(socket, poolID, stackSize)")
        logger.log(socket.id)
        logger.log(poolID)
        logger.log(stackSize)
        if (!socket) return logger.log("enterPool socket undefined")
        if (!socket.userID) return logger.log("enterPool user undefined")
        const user = this.users[socket.userID]
        if (!user) return logger.log("enterPool user from usersConnected undefined")
        stackSize = new Decimal(stackSize)
        //player just entering the pool
        let player = new Player(user, stackSize)
        if (!player && socket) return socket.emit("enterPoolResponse", { response: "failed to enter pool", status: 401 })
        if (!player) return logger.log("failed to enter pool")
        user.players[player.id] = player
        // logger.log(poolID)
        // logger.log(stackSize)
        // logger.log(typeof stackSize)
        let pool = this.pools[poolID]
        // logger.log(pool)
        // logger.log(`${stackSize} >= ${pool.minBuyIn} : ${stackSize >= pool.minBuyIn}`)
        // logger.log(`${stackSize} <= ${pool.maxBuyIn} : ${stackSize <= pool.maxBuyIn}`)
        logger.log(`${user.balance} >= ${stackSize} : ${user.balance.greaterThanOrEqualTo(stackSize)}`)
        if (stackSize.greaterThanOrEqualTo(pool.minBuyIn) && stackSize.lessThanOrEqualTo(pool.maxBuyIn) && user.balance.greaterThanOrEqualTo(stackSize)) {
            logger.log("log1")
            // logger.log(socket.id)
            // logger.log(this.socketsByUserID)
            this.socketsByUserID[player.userID] = socket
            logger.log("log2")
            logger.log(Object.keys(this.socketsByUserID))
            player.poolID = poolID
            let playerPool = this.playersByPool[poolID]
            playerPool[player.id] = player
            this.pools[poolID].currentPlayers = Object.keys(playerPool).length
            logger.log("log3")
            if (socket) socket.emit("enterPoolResponse", { response : "player entered the pool", player : player, status: 200, pool: pool})
            this.tableManager.placePlayerIntoTable(player)
            this.socketManager.to("lobby").emit("updatePools", this.pools)
            logger.log("log4")
            user.balance = user.balance.minus(stackSize)
            logger.log("updating balance")
            User.handleMoney(-stackSize.toNumber(), user.id, `⚡ ${this.pools[poolID].gameTitle}`, this.fastify.pg)
            // this.fastify.pg.connect().then(async (client) => {
            //     logger.log("updating balance")
            //     try {
            //         const result = await client.query(`UPDATE users SET balance = balance - ${stackSize.toNumber()} WHERE username = '${user.name}'`);
            //         logger.log(result)
            //     } catch (error) {
            //         logger.log(error)
                    
            //     }
                
            //     client.release();
            // });
            // if (socket) socket.emit("updatePlayerInfo", player)
            if (socket) socket.emit("updateUserInfo", { user : user, status: 200})
            return 
        }
        if (socket) socket.emit("enterPoolResponse", { response: "stacksize not valid", status: 403 })
    }
    sendEmptyTable(player) {
        logger.log("sendEmptyTable()")
        if (!player) return logger.log("player is undefined.")
        const pool = this.pools[player.poolID]
        let handState = {
            title : pool.title,
            tableSize : pool.tableSize,
            sb : pool.sb,
            bb : pool.bb,
            handIsBeingPlayed : false,
            isShowdown : false,
            // players : this.players,
            pots : [0],
            actionSequence : [],
            // playersActive : this.playerIDByPositionIndex,
            boardCards : [],
            boardRound : 0,
            minBet : 0,
            maxBet : 9999999999,
            biggestBet : 0,
            positionActing : -1,
            timeLimitToAct: 0,
            playersAllin : 0,
            playersFolded : 0,
            dealerPos: -1,
            sbPos: 0,
            bbPos: 0,
        }
        handState.players = {}
        handState.players[player.id] = {
            id : player.id,
            userID : player.userID,
            name: player.name,
            avatar: player.avatar,
            tableID: player.tableID,
            poolID: player.poolID,
            stackSize: player.stackSize,
            tableClosed: player.tableClosed,
            hasFolded: true,
            cards: [],
            isSitout: player.isSitout,
            betSize: 0,
            possibleActions: [],
            isButton : false,
            position : player.position,
            showCards : false,
            lastAction: player.lastAction
        }
        const socket = this.socketsByUserID[player.userID]
        if (socket) {
            socket.emit("updateGameState", handState)
            socket.emit("updatePlayerInfo", handState.players[player.id])
        }
    }
    sitoutUpdate(playerID, poolID, isSitout) {
        logger.log("sitoutUpdate")
        logger.log(playerID)
        logger.log(poolID)
        logger.log(isSitout)
        const pool = this.pools[poolID]
        if (!pool) return logger.log("pool invalid")
        const player = this.playersByPool[poolID][playerID]
        if (!player) return logger.log("player invalid")
        const socket = this.socketsByUserID[player.userID]
        if (!socket) return logger.log("socket invalid")
        logger.log("updating sitout for player " + player.name + " isSitout: " + isSitout)
        player.isSitout = isSitout //player can become sitout or not
        const table = this.tableManager.tables[poolID][player.tableID]
        // if (table && player.tableClosed) table.broadcastHandState()
        if (!isSitout) {
            // clearTimeout(player.leavePoolTimeout)
            clearTimeout(this.leavePoolTimeout[player.id])
            if (!table) return this.reEnterPool(player) //player is coming back from sitout
            if (table.currentHand.handIsBeingPlayed && player.hasFolded) return this.reEnterPool(player) //player is coming back from sitout
        }
        if (isSitout) {
            if (table) {
                if (table.waitingForPlayers) {
                    table.removePlayer(player)
                    this.reEnterPool(player)
                }
            }
        }
    }
    reEnterPool(player) {
        //player reentering pool after played a hand
        logger.log("reEnterPool()")
        if (!player) return logger.log("player is undefined")
        logger.log(player.name)
        // logger.log(player)
        let poolID = player.poolID
        let pool = this.pools[poolID]
        logger.log(`poolID: ${poolID}`)
        logger.log(`pool: ${pool}`)
        // logger.log("sockets")
        // logger.log(Object.keys(this.socketsByUserID))
        const socket = this.socketsByUserID[player.userID]
        let playerPool = this.playersByPool[poolID]
        playerPool[player.id] = player
        const user = this.users[player.userID]
        if (user) user.players[player.id] = player
        player.tableID = undefined //reset player tableID
        // logger.log("socket")
        // logger.log(socket)
        logger.log("player.tableClosed: " + player.tableClosed)
        if (player.tableClosed) return this.leavePool(player)
        this.sendEmptyTable(player)
        if (player.askingRebuy) {
            logger.log("returning rebuy")
            return this.rebuy(player.id, player.poolID, player.rebuyAmount)
        }
        if (player.stackSize.equals(0)) {
            logger.log(`player.stackSize: ${player.stackSize}`)
            // this.leavePool(socket, player)
            if (socket) return socket.emit("askRebuy", {playerID : player.id, poolID: poolID, minBuyIn: pool.minBuyIn, maxBuyIn : pool.maxBuyIn})
        }
        if (player.isSitout) {
            logger.log(`player.isSitout: ${player.isSitout}`)
            if (socket) socket.emit("sitoutUpdate", {playerID : player.id, isSitout: player.isSitout})
            // const playerFromID = JSON.parse(JSON.stringify(this.playersByPool[poolID][player.id])) //need to create a copy of this user instead of using a reference, because the user may have already leaved.
            // if (!playerFromID) return logger.log("something went wrong on player from id")
            if (this.leavePoolTimeout[player.id]) clearTimeout(this.leavePoolTimeout[player.id])
            if (!this.tableManager.tables[poolID][player.tableID]) this.leavePoolTimeout[player.id] = setTimeout(()=>{
                logger.log("leave pool timeout")
                if (!player) return logger.log("player already leaved the pool")
                if (socket) socket.emit("closeTable", player.id)
                this.leavePool(player) 
            }, 300000)
            return
            //  this.leavePool(socket, player)
        }
        logger.log(`playerPool: ${playerPool}`)
        logger.log(Object.keys(playerPool))
        this.tableManager.placePlayerIntoTable(player)
        // if (socket) socket.emit("updatePlayerInfo", player)
            // this.playersByPool.poolID[player.id] = player
    }
    /**
     * 
     * @param {string} playerID 
     * @param {string} poolID 
     * @param {number} rebuyAmount 
     * @returns 
     */
    rebuy(playerID, poolID, rebuyAmount) {
        logger.log("rebuy")
        logger.log(playerID)
        logger.log(poolID)
        logger.log(rebuyAmount)
        const pool = this.pools[poolID]
        if (!pool) return logger.log("pool invalid")
        const player = this.playersByPool[poolID][playerID]
        if (!player) {
            logger.log("player invalid", "ERROR", "rebuy player undefined")
            logger.log(Object.keys(this.playersByPool), "ERROR", "rebuy player undefined")
            return
        }
        const socket = this.socketsByUserID[player.userID]
        if (!socket) return logger.log("socket invalid")
        if (!player.askingRebuy) {
            if (!typeof(rebuyAmount) === "number") return logger.log("amount invalid")
            if (rebuyAmount <= 0) return logger.log("amount is less than or equal to 0")
        }
        const user = this.users[socket.userID]
        rebuyAmount = new Decimal(rebuyAmount)
        player.stackSize = new Decimal(player.stackSize)
        logger.log(player.stackSize)
        player.betSize = new Decimal(player.betSize)
        if (player.rebuyAmount) player.rebuyAmount = new Decimal(player.rebuyAmount)
        // logger.log(pool)
        // logger.log(`${rebuyAmount} >= ${pool.minBuyIn} : ${rebuyAmount >= pool.minBuyIn}`)
        // logger.log(`${rebuyAmount} <= ${pool.maxBuyIn} : ${rebuyAmount <= pool.maxBuyIn}`)
        if (player.stackSize.plus(rebuyAmount).greaterThan(pool.maxBuyIn)) rebuyAmount = new Decimal(pool.maxBuyIn).minus(player.stackSize)
        logger.log("updated rebuy Amount :" + rebuyAmount)
        if (player.askingRebuy) player.askingRebuy = false //try only once per request
        // if (rebuyAmount <= 0) {
        //     //send him back into the pool as he cant make any rebuy
        //     logger.log("rebuy <= 0")
        //     player.askingRebuy = false
        //     player.rebuyAmount = 0
        //     player.isSitout = false
        //     return this.reEnterPool(player) 
        // }
        if (player.stackSize.plus(rebuyAmount).greaterThanOrEqualTo(pool.minBuyIn) && player.stackSize.plus(rebuyAmount).lessThanOrEqualTo(pool.maxBuyIn) && user.balance.greaterThanOrEqualTo(rebuyAmount)) {
            logger.log("rebuy 1")
            const table = this.tableManager.tables[poolID][player.tableID]
            if (table) {
                if (table.currentHand.handIsBeingPlayed && !player.hasFolded) {
                    player.askingRebuy = true
                    player.rebuyAmount = rebuyAmount
                    return logger.log("player setted to rebuy at the end of the hand")
                }
            }
            if (rebuyAmount > 0) {
                logger.log("rebuyAmount > 0")
                player.stackSize = player.stackSize.plus(rebuyAmount)
                user.balance = user.balance.minus(rebuyAmount)
                logger.log("updating balance")
                User.handleMoney(-rebuyAmount.toNumber(), user.id, `⚡ ${this.pools[poolID].gameTitle}`, this.fastify.pg)
                // this.fastify.pg.connect().then(async (client) => {
                //     logger.log("updating balance")
                //     const result = await client.query(`UPDATE users SET balance = balance - ${rebuyAmount.toNumber()} WHERE username = '${user.name}'`);
                //     logger.log(result)
                //     client.release();
                // });
                player.rebuyAmount = new Decimal(0)
                player.isSitout = false
                socket.emit("updateUserInfo", { user : user, status: 200})
                if (table) {
                    if (table.waitingForPlayers) return table.broadcastHandState()
                }
                return this.reEnterPool(player)
            }
            logger.log("rebuy amount <= 0")
            player.rebuyAmount = new Decimal(0)
            player.isSitout = false
        }
        logger.log("rebuy 2")
        // logger.log(pool)
        logger.log(player.stackSize)
        logger.log(user.balance)
        if (!player.tableID) return this.reEnterPool(player)
    }
    leavePool(playerFromClient, tableClosed = false) {
        logger.log("leavePool()")
        if (!playerFromClient) return logger.log("playerFromClient is undefined")
        logger.log(`playerFromClient.name: ${playerFromClient.name}`)
        logger.log(`playerFromClient.tableID: ${playerFromClient.tableID}`)
        // logger.log(socket)
        // logger.log(playerFromClient)
        const player = this.playersByPool[playerFromClient.poolID][playerFromClient.id]
        // if (!socket) return logger.log("socket already gone")
        if (!player) return logger.log("player already leaved")
        const user = this.users[player.userID]
        player.stackSize = new Decimal(player.stackSize)
        player.betSize = new Decimal(player.betSize)
        //player reentering pool after played a hand
        // logger.log(socket.id)
        // // logger.log(player.socketID)
        // logger.log(player.isDisconnected)
        // logger.log(player.tableClosed)
        // logger.log(player.isSitout)
        logger.log("leavePool()1")
        const table = this.tableManager.tables[player.poolID][player.tableID]
        if (table && !table.waitingForPlayers) {
            logger.log("leavePool() hand is being played")
            player.isSitout = true
            player.tableClosed = tableClosed
            const socket = this.socketsByUserID[player.userID]
            if (socket) socket.emit("sitoutUpdate", {playerID : player.id, isSitout: player.isSitout})
            if (table.currentHand.positionActing === player.position && !player.hasFolded && player.stackSize != 0) table.validateAction(player, {type: "fold", amount: 0})
            return logger.log("leavePool() returning after set player to sitout and table closed")
        }
        if (table && table.waitingForPlayers) table.removePlayer(player)
        if (!table || player.tableClosed || !player.tableID) {
            if (this.leavePoolTimeout[player.id]) clearTimeout(this.leavePoolTimeout[player.id])
            logger.log("leavePool() 2 table undefined or player.tableClosed or player.tableID undefined")
            user.balance = user.balance.plus(player.stackSize) //devolver o balance pro jogador no banco de dados
            logger.log("updating balance")
            User.handleMoney(player.stackSize.toNumber(), player.userID, `⚡ ${this.pools[player.poolID].gameTitle}`, this.fastify.pg)
            const socket = this.socketsByUserID[player.userID]
            if (socket) {
                socket.emit("leavePoolResponse", { response : "player left the pool", status: 200})
                socket.emit("updateUserInfo", { user : user, status: 200})
            }
            delete user.players[player.id]
            delete this.playersByPool[player.poolID][player.id]
            this.pools[player.poolID].currentPlayers = Object.keys(this.playersByPool[player.poolID]).length
            this.socketManager.to("lobby").emit("updatePools", this.pools)
            return logger.log("finish leavePool() 2")
        }
        



        // if (!socket || socket.id === user.socketID) {
        //     logger.log("leavePool()2")
        //     logger.log(`player.tableID: ${player.tableID}`)
            
        //     const table = this.tableManager.tables[player.poolID][player.tableID]
        //     if (table && !player.tableClosed) {
        //         logger.log("leavePool()3")
        //         logger.log(table.id)
        //         if (!table.waitingForPlayers) {
        //             logger.log("leavePool()4")
        //             logger.log(player.id)
        //             logger.log(player.position)
        //             logger.log(player.possibleActions)
        //             logger.log(player.hasFolded)
        //             logger.log(player.isSitout)
        //             logger.log(table.currentHand.positionActing)
        //             player.isSitout = true
        //             player.tableClosed = tableClosed
        //             if (table.currentHand.positionActing === player.position && !player.hasFolded && player.stackSize != 0) return table.validateAction(player, {type: "fold", amount: 0})
        //         }
        //         else if (table.waitingForPlayers) {
        //             logger.log("leavePool()5")
        //             if (table.waitingForPlayers) table.removePlayer(player) //tira o jogador antes da mao começar
        //             if (socket) user.balance = user.balance.plus(player.stackSize) //devolver o balance pro jogador no banco de dados
        //             logger.log("updating balance")
        //             const result = this.fastify.pg.query(`UPDATE users SET balance = balance + ${player.stackSize.toNumber()} WHERE username = '${player.name}'; INSERT INTO moneyTransactions(userid, amount, source) VALUES(${player.userid}, ${player.stackSize.toNumber()}, '⚡ ${this.pools[player.poolID].gameTitle}')`);
        //             logger.log(result)
        //             // this.fastify.pg.connect().then(async (client) => {
        //             //     logger.log("updating balance")
        //             //     const result = await client.query(`UPDATE users SET balance = balance + ${player.stackSize.toNumber()} WHERE username = '${player.name}'`);
        //             //     logger.log(result)
        //             //     client.release();
        //             // });
        //             if (socket) {
        //                 const playerIndex = user.playerIDs.indexOf(player.id)
        //                 user.playerIDs.splice(playerIndex, 1)
        //                 user.poolIDs.splice(playerIndex, 1)
        //                 socket.emit("leavePoolResponse", { response : "player left the pool", status: 200})
        //                 socket.emit("updateUserInfo", { user : user, status: 200})
        //             }
        //             delete this.playersByPool[player.poolID][player.id]
        //             this.pools[player.poolID].currentPlayers = Object.keys(this.playersByPool[player.poolID]).length
        //             this.socketManager.to("lobby").emit("updatePools", this.pools)
        //             // delete this.socketsByUserID[player.socketID]
        //             // if (table.countPlayers() === 0) {
        //             //     this.socketManager.socketsByUserIDLeave(`table:${table.id}`)
        //             //     delete this.tableManager.tables[player.poolID][table.id]
        //             // }
        //             return 
        //         }
        //     } else {
        //         logger.log("leavePool() 7 table undefined or player.tableClosed = true")
        //         if (socket) user.balance = user.balance.plus(player.stackSize) //devolver o balance pro jogador no banco de dados
        //         logger.log("updating balance")
        //         const result = this.fastify.pg.query(`UPDATE users SET balance = balance + ${player.stackSize.toNumber()} WHERE username = '${player.name}'; INSERT INTO moneyTransactions(userid, amount, source) VALUES(${player.userid}, ${player.stackSize.toNumber()}, '⚡ ${this.pools[player.poolID].gameTitle}')`);
        //         logger.log(result)
        //         // this.fastify.pg.connect().then(async (client) => {
        //         //     logger.log("updating balance")
        //         //     const result = await client.query(`UPDATE users SET balance = balance + ${player.stackSize.toNumber()} WHERE username = '${player.name}'`);
        //         //     logger.log(result)
        //         //     client.release();

        //         // });
        //         if (socket) {
        //             const playerIndex = user.playerIDs.indexOf(player.id)
        //             user.playerIDs.splice(playerIndex, 1)
        //             user.poolIDs.splice(playerIndex, 1)
        //             socket.emit("leavePoolResponse", { response : "player left the pool", status: 200})
        //             socket.emit("updateUserInfo", { user : user, status: 200})
        //         }
        //         delete this.playersByPool[player.poolID][player.id]
        //         this.pools[player.poolID].currentPlayers = Object.keys(this.playersByPool[player.poolID]).length
        //         this.socketManager.to("lobby").emit("updatePools", this.pools)
        //     }
        // }
        logger.log("leavePool()6")
        // if (socket) {
        //     socket.user.balance += player.stackSize
        //     delete this.playersByPool[player.poolID][player.id]
        //     this.pools[player.poolID].currentPlayers = Object.keys(this.playersByPool[player.poolID]).length
        //     this.socketManager.to("lobby").emit("updatePools", this.pools)
        //     if (socket) socket.emit("leavePoolResponse", { response : "player left the pool", status: 200})
        //     if (socket) socket.emit("updateUserInfo", { user : socket.user, status: 200})
        // }
    }
}

module.exports = PlayerPoolManager;
