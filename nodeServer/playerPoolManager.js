//responsible for directioning each player to its table
// also responsible for asking for rebuy, handle reconnection, etc
//important to note that each user logged in, can play multiple tables
// so there is going to be 2 kind of players, the user and the player(inside the table) itself.
//initially will be just an object, later on possible becoming a microservice
// const { parentPort } = require('worker_threads');

const Decimal = require('decimal.js');
const Player = require("./player")
const TableManager = require("./tableManager")

// // Receive messages from the main thread
// parentPort.on('message', (message) => {
//   console.log(`Worker thread received message: ${JSON.stringify(message)}`);

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
        console.log("enterPool(socket, poolID, stackSize)")
        console.log(socket.id)
        console.log(poolID)
        console.log(stackSize)
        if (!socket) return console.log("enterPool socket undefined")
        if (!socket.userID) return console.log("enterPool user undefined")
        const user = this.users[socket.userID]
        if (!user) return console.log("enterPool user from usersConnected undefined")
        stackSize = new Decimal(stackSize)
        //player just entering the pool
        let player = new Player(user, stackSize)
        if (!player && socket) return socket.emit("enterPoolResponse", { response: "failed to enter pool", status: 401 })
        if (!player) return console.log("failed to enter pool")
        user.players[player.id] = player
        // console.log(poolID)
        // console.log(stackSize)
        // console.log(typeof stackSize)
        let pool = this.pools[poolID]
        // console.log(pool)
        // console.log(`${stackSize} >= ${pool.minBuyIn} : ${stackSize >= pool.minBuyIn}`)
        // console.log(`${stackSize} <= ${pool.maxBuyIn} : ${stackSize <= pool.maxBuyIn}`)
        console.log(`${user.balance} >= ${stackSize} : ${user.balance.greaterThanOrEqualTo(stackSize)}`)
        if (stackSize.greaterThanOrEqualTo(pool.minBuyIn) && stackSize.lessThanOrEqualTo(pool.maxBuyIn) && user.balance.greaterThanOrEqualTo(stackSize)) {
            console.log("log1")
            // console.log(socket.id)
            // console.log(this.socketsByUserID)
            this.socketsByUserID[player.userID] = socket
            console.log("log2")
            console.log(Object.keys(this.socketsByUserID))
            player.poolID = poolID
            let playerPool = this.playersByPool[poolID]
            playerPool[player.id] = player
            this.pools[poolID].currentPlayers = Object.keys(playerPool).length
            console.log("log3")
            if (socket) socket.emit("enterPoolResponse", { response : "player entered the pool", player : player, status: 200, pool: pool})
            this.tableManager.placePlayerIntoTable(player)
            this.socketManager.to("lobby").emit("updatePools", this.pools)
            console.log("log4")
            user.balance = user.balance.minus(stackSize)
            console.log("updating balance")
            const result = this.fastify.pg.query(`UPDATE users SET balance = balance - ${stackSize.toNumber()} WHERE username = '${user.name}'; INSERT INTO moneyTransactions(userid, amount, source) VALUES(${user.id}, ${-stackSize.toNumber()}, '⚡ ${this.pools[poolID].gameTitle}')`);
            console.log(result)
            // this.fastify.pg.connect().then(async (client) => {
            //     console.log("updating balance")
            //     try {
            //         const result = await client.query(`UPDATE users SET balance = balance - ${stackSize.toNumber()} WHERE username = '${user.name}'`);
            //         console.log(result)
            //     } catch (error) {
            //         console.log(error)
                    
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
        console.log("sendEmptyTable()")
        if (!player) return console.log("player is undefined.")
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
        if (socket) socket.emit("updateGameState", handState);
    }
    sitoutUpdate(playerID, poolID, isSitout) {
        console.log("sitoutUpdate")
        console.log(playerID)
        console.log(poolID)
        console.log(isSitout)
        const pool = this.pools[poolID]
        if (!pool) return console.log("pool invalid")
        const player = this.playersByPool[poolID][playerID]
        if (!player) return console.log("player invalid")
        const socket = this.socketsByUserID[player.userID]
        if (!socket) return console.log("socket invalid")
        console.log("updating sitout for player " + player.name + " isSitout: " + isSitout)
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
        console.log("reEnterPool()")
        if (!player) return console.log("player is undefined")
        console.log(player.name)
        // console.log(player)
        let poolID = player.poolID
        let pool = this.pools[poolID]
        console.log(`poolID: ${poolID}`)
        console.log(`pool: ${pool}`)
        // console.log("sockets")
        // console.log(Object.keys(this.socketsByUserID))
        const socket = this.socketsByUserID[player.userID]
        let playerPool = this.playersByPool[poolID]
        playerPool[player.id] = player
        const user = this.users[player.userID]
        if (user) user.players[player.id] = player
        player.tableID = undefined //reset player tableID
        // console.log("socket")
        // console.log(socket)
        console.log("player.tableClosed: " + player.tableClosed)
        if (player.tableClosed) return this.leavePool(player)
        this.sendEmptyTable(player)
        if (player.askingRebuy) {
            console.log("returning rebuy")
            return this.tableManager.playerPoolManager.rebuy(player.id, player.poolID, player.rebuyAmount)
        }
        if (player.stackSize.equals(0)) {
            console.log(`player.stackSize: ${player.stackSize}`)
            // this.leavePool(socket, player)
            if (socket) return socket.emit("askRebuy", {playerID : player.id, poolID: poolID, minBuyIn: pool.minBuyIn, maxBuyIn : pool.maxBuyIn})
        }
        if (player.isSitout) {
            console.log(`player.isSitout: ${player.isSitout}`)
            if (socket) socket.emit("sitoutUpdate", {playerID : player.id, isSitout: player.isSitout})
            // const playerFromID = JSON.parse(JSON.stringify(this.playersByPool[poolID][player.id])) //need to create a copy of this user instead of using a reference, because the user may have already leaved.
            // if (!playerFromID) return console.log("something went wrong on player from id")
            if (this.leavePoolTimeout[player.id]) clearTimeout(this.leavePoolTimeout[player.id])
            if (!this.tableManager.tables[poolID][player.tableID]) this.leavePoolTimeout[player.id] = setTimeout(()=>{
                console.log("leave pool timeout")
                if (!player) return console.log("player already leaved the pool")
                if (socket) socket.emit("closeTable", player.id)
                this.leavePool(player) 
            }, 300000)
            return
            //  this.leavePool(socket, player)
        }
        console.log(`playerPool: ${playerPool}`)
        console.log(Object.keys(playerPool))
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
        console.log("rebuy")
        console.log(playerID)
        console.log(poolID)
        console.log(rebuyAmount)
        const pool = this.pools[poolID]
        const player = this.playersByPool[poolID][playerID]
        const socket = this.socketsByUserID[player.userID]
        if (!pool) return console.log("pool invalid")
        if (!player) return console.log("player invalid")
        if (!socket) return console.log("socket invalid")
        if (!player.askingRebuy) {
            if (!typeof(rebuyAmount) === "number") return console.log("amount invalid")
            if (rebuyAmount <= 0) return console.log("amount is less than or equal to 0")
        }
        const user = this.users[socket.userID]
        rebuyAmount = new Decimal(rebuyAmount)
        player.stackSize = new Decimal(player.stackSize)
        console.log(player.stackSize)
        player.betSize = new Decimal(player.betSize)
        if (player.rebuyAmount) player.rebuyAmount = new Decimal(player.rebuyAmount)
        // console.log(pool)
        // console.log(`${rebuyAmount} >= ${pool.minBuyIn} : ${rebuyAmount >= pool.minBuyIn}`)
        // console.log(`${rebuyAmount} <= ${pool.maxBuyIn} : ${rebuyAmount <= pool.maxBuyIn}`)
        if (player.stackSize.plus(rebuyAmount).greaterThan(pool.maxBuyIn)) rebuyAmount = new Decimal(pool.maxBuyIn).minus(player.stackSize)
        console.log("updated rebuy Amount :" + rebuyAmount)
        // if (rebuyAmount <= 0) {
        //     //send him back into the pool as he cant make any rebuy
        //     console.log("rebuy <= 0")
        //     player.askingRebuy = false
        //     player.rebuyAmount = 0
        //     player.isSitout = false
        //     return this.reEnterPool(player) 
        // }
        if (player.stackSize.plus(rebuyAmount).greaterThanOrEqualTo(pool.minBuyIn) && player.stackSize.plus(rebuyAmount).lessThanOrEqualTo(pool.maxBuyIn) && user.balance.greaterThanOrEqualTo(rebuyAmount)) {
            console.log("rebuy 1")
            const table = this.tableManager.tables[poolID][player.tableID]
            if (table) {
                console.log(table)
                if (table.currentHand.handIsBeingPlayed && !player.hasFolded) {
                    player.askingRebuy = true
                    player.rebuyAmount = rebuyAmount
                    return console.log("player setted to rebuy at the end of the hand")
                }
            }
            if (rebuyAmount > 0) {
                console.log("rebuyAmount > 0")
                player.stackSize = player.stackSize.plus(rebuyAmount)
                user.balance = user.balance.minus(rebuyAmount)
                console.log("updating balance")
                const result = this.fastify.pg.query(`UPDATE users SET balance = balance - ${rebuyAmount.toNumber()} WHERE username = '${user.name}'; INSERT INTO moneyTransactions(userid, amount, source) VALUES(${user.id}, ${-rebuyAmount.toNumber()}, '⚡ ${this.pools[poolID].gameTitle}')`);
                console.log(result)
                // this.fastify.pg.connect().then(async (client) => {
                //     console.log("updating balance")
                //     const result = await client.query(`UPDATE users SET balance = balance - ${rebuyAmount.toNumber()} WHERE username = '${user.name}'`);
                //     console.log(result)
                //     client.release();
                // });
                player.askingRebuy = false
                player.rebuyAmount = new Decimal(0)
                player.isSitout = false
                socket.emit("updateUserInfo", { user : user, status: 200})
                if (table) {
                    if (table.waitingForPlayers) return table.broadcastHandState()
                }
                return this.reEnterPool(player)
            }
            console.log("rebuy amount <= 0")
            player.askingRebuy = false
            player.rebuyAmount = new Decimal(0)
            player.isSitout = false
        }
        console.log("rebuy 2")
        // console.log(pool)
        console.log(player.stackSize)
        console.log(user.balance)
        return this.reEnterPool(player)
    }
    leavePool(playerFromClient, tableClosed = false) {
        console.log("leavePool()")
        if (!playerFromClient) return console.log("playerFromClient is undefined")
        console.log(`playerFromClient.name: ${playerFromClient.name}`)
        console.log(`playerFromClient.tableID: ${playerFromClient.tableID}`)
        // console.log(socket)
        // console.log(playerFromClient)
        const player = this.playersByPool[playerFromClient.poolID][playerFromClient.id]
        // if (!socket) return console.log("socket already gone")
        if (!player) return console.log("player already leaved")
        const user = this.users[player.userID]
        player.stackSize = new Decimal(player.stackSize)
        player.betSize = new Decimal(player.betSize)
        //player reentering pool after played a hand
        // console.log(socket.id)
        // // console.log(player.socketID)
        // console.log(player.isDisconnected)
        // console.log(player.tableClosed)
        // console.log(player.isSitout)
        console.log("leavePool()1")
        const table = this.tableManager.tables[player.poolID][player.tableID]
        if (table && !table.waitingForPlayers) {
            console.log("leavePool() hand is being played")
            player.isSitout = true
            player.tableClosed = tableClosed
            const socket = this.socketsByUserID[player.userID]
            if (socket) socket.emit("sitoutUpdate", {playerID : player.id, isSitout: player.isSitout})
            if (table.currentHand.positionActing === player.position && !player.hasFolded && player.stackSize != 0) return table.validateAction(player, {type: "fold", amount: 0})
        }
        if (table && table.waitingForPlayers) table.removePlayer(player)
        if (!table || player.tableClosed || !player.tableID) {
            if (this.leavePoolTimeout[player.id]) clearTimeout(this.leavePoolTimeout[player.id])
            console.log("leavePool() 2 table undefined or player.tableClosed or player.tableID undefined")
            user.balance = user.balance.plus(player.stackSize) //devolver o balance pro jogador no banco de dados
            console.log("updating balance")
            const result = this.fastify.pg.query(`UPDATE users SET balance = balance + ${player.stackSize.toNumber()} WHERE username = '${player.name}'; INSERT INTO moneyTransactions(userid, amount, source) VALUES(${player.userID}, ${player.stackSize.toNumber()}, '⚡ ${this.pools[player.poolID].gameTitle}')`);
            console.log(result)
            const socket = this.socketsByUserID[player.userID]
            if (socket) {
                socket.emit("leavePoolResponse", { response : "player left the pool", status: 200})
                socket.emit("updateUserInfo", { user : user, status: 200})
            }
            delete user.players[player.id]
            delete this.playersByPool[player.poolID][player.id]
            this.pools[player.poolID].currentPlayers = Object.keys(this.playersByPool[player.poolID]).length
            this.socketManager.to("lobby").emit("updatePools", this.pools)
            return console.log("finish leavePool() 2")
        }
        



        // if (!socket || socket.id === user.socketID) {
        //     console.log("leavePool()2")
        //     console.log(`player.tableID: ${player.tableID}`)
            
        //     const table = this.tableManager.tables[player.poolID][player.tableID]
        //     if (table && !player.tableClosed) {
        //         console.log("leavePool()3")
        //         console.log(table.id)
        //         if (!table.waitingForPlayers) {
        //             console.log("leavePool()4")
        //             console.log(player.id)
        //             console.log(player.position)
        //             console.log(player.possibleActions)
        //             console.log(player.hasFolded)
        //             console.log(player.isSitout)
        //             console.log(table.currentHand.positionActing)
        //             player.isSitout = true
        //             player.tableClosed = tableClosed
        //             if (table.currentHand.positionActing === player.position && !player.hasFolded && player.stackSize != 0) return table.validateAction(player, {type: "fold", amount: 0})
        //         }
        //         else if (table.waitingForPlayers) {
        //             console.log("leavePool()5")
        //             if (table.waitingForPlayers) table.removePlayer(player) //tira o jogador antes da mao começar
        //             if (socket) user.balance = user.balance.plus(player.stackSize) //devolver o balance pro jogador no banco de dados
        //             console.log("updating balance")
        //             const result = this.fastify.pg.query(`UPDATE users SET balance = balance + ${player.stackSize.toNumber()} WHERE username = '${player.name}'; INSERT INTO moneyTransactions(userid, amount, source) VALUES(${player.userid}, ${player.stackSize.toNumber()}, '⚡ ${this.pools[player.poolID].gameTitle}')`);
        //             console.log(result)
        //             // this.fastify.pg.connect().then(async (client) => {
        //             //     console.log("updating balance")
        //             //     const result = await client.query(`UPDATE users SET balance = balance + ${player.stackSize.toNumber()} WHERE username = '${player.name}'`);
        //             //     console.log(result)
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
        //         console.log("leavePool() 7 table undefined or player.tableClosed = true")
        //         if (socket) user.balance = user.balance.plus(player.stackSize) //devolver o balance pro jogador no banco de dados
        //         console.log("updating balance")
        //         const result = this.fastify.pg.query(`UPDATE users SET balance = balance + ${player.stackSize.toNumber()} WHERE username = '${player.name}'; INSERT INTO moneyTransactions(userid, amount, source) VALUES(${player.userid}, ${player.stackSize.toNumber()}, '⚡ ${this.pools[player.poolID].gameTitle}')`);
        //         console.log(result)
        //         // this.fastify.pg.connect().then(async (client) => {
        //         //     console.log("updating balance")
        //         //     const result = await client.query(`UPDATE users SET balance = balance + ${player.stackSize.toNumber()} WHERE username = '${player.name}'`);
        //         //     console.log(result)
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
        console.log("leavePool()6")
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