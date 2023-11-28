//responsible for directioning each player to its table
// also responsible for asking for rebuy, handle reconnection, etc
//important to note that each user logged in, can play multiple tables
// so there is going to be 2 kind of players, the user and the player(inside the table) itself.
//initially will be just an object, later on possible becoming a microservice
// const { parentPort } = require('worker_threads');

//TOURNAMENTS STEPS:
//convert table to become fixed (players should not move from table to table as in lightning) //working
//create a tournament that starts with 2 players like a HUSNG (test out the tournament creation) //working
//create a blind structure and test that out //working
//adjust the tournament to start on a given time //working
//keep the registering open and allow players to late register //working
//handle reentry //working
//create the frontend to show the tournament info

const Decimal = require('decimal.js');
const Player = require("./player")
const TableManager = require("./tableManager")
const Logger = require("../logger")
const User = require('../user');
const { mergeSort } = require('../mergeAlg');
const logger = new Logger("PlayerPoolManager")
const { v4: uuidv4 } = require('uuid');
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
        this.tournaments = {}
        this.tableManager = new TableManager(this.socketManager, fastify, this)
        this.createTournament()
    }
    //tournamentManager
    registerOnTournament(user, tournamentID) {
        logger.log(`registerOnTournament(${user.name}, ${tournamentID})`)
        const tournament = this.tournaments[tournamentID]
        if (!tournament) return logger.log("tournament is undefined, something went wrong.")
        if (!tournament.registrationAllowed) return logger.log("tournament is not allowed to register")
        if (user.balance.lessThan(tournament.buyIn)) return logger.log("user doesnt have balance to join tournament")
        //TODO handle reentry
        // if (!tournament.players[user.id]) {
        //     registrationAllowed = true
        // } else if (tournament.started)  {
        //     const lastPlayerRegistered = tournament.playersByUser[user.id][tournament.playersByUser[user.id].length-1]
        //     if (!lastPlayerRegistered) registrationAllowed = true
        //     if (lastPlayerRegistered.leftTournament) registrationAllowed = true
        // }
        if (user.tournamentsPlaying[tournamentID]) return logger.log("player already registered")
        if (!user.tournamentsPlaying[tournamentID]) {
            const socket = this.socketsByUserID[user.id]
            User.handleMoney(-tournament.buyIn, user, socket, tournament.title, this.fastify.pg)
            user.tournamentsPlaying[tournamentID] = tournamentID
            const newPlayer = new Player(user, tournament.startingChips)
            newPlayer.tournamentID = tournamentID
            newPlayer.tournamentPosition = tournament.currentPlayers.length + 1
            if (user.id in tournament.playersByUserID === false) tournament.playersByUserID[user.id] = []
            // newPlayer.name += tournament.playersByUserID[user.id].length
            tournament.playersByUserID[user.id].push(newPlayer)
            user.players[newPlayer.id] = newPlayer
            
            tournament.entriesCount += 1
            tournament.currentPlayers.push(newPlayer)
            tournament.totalPrize += tournament.buyIn
            socket.join(`tournament:${tournament.id}`)
            this.rankPlayers(tournament.id)
            this.adjustPrizeProol(tournament)
            if (tournament.started) this.broadcastTournamentInfo(tournament)
        }
        if (tournament.started) this.tableManager.organizeTables(tournament)
        if (!tournament.started && tournament.currentPlayers.length>=tournament.minPlayers && !tournament.startTimer) this.startTournament(tournamentID)
        this.broadcastTournamentList()
    }
    unregisterOnTournament(user, tournamentID) {
        logger.log(`unregisterOnTournament(${user.name}, ${tournamentID})`)
        const tournament = this.tournaments[tournamentID]
        if (tournament.started) return logger.log("tournament has already started")
        if (!user.tournamentsPlaying[tournamentID]) return logger.log("player is not registered on this tournament, something went wrong.")
        const socket = this.socketsByUserID[user.id]
        User.handleMoney(tournament.buyIn, user, socket, tournament.title, this.fastify.pg)
        delete user.tournamentsPlaying[tournamentID]
        const player = tournament.playersByUserID[user.id][0] //only allowed to unregister before the tournament has started, thus, there will be only one player
        delete user.players[player.id]
        delete tournament.playersByUserID[user.id]
        // this.broadcastTournamentInfo(tournament)
        socket.leave(`tournament:${tournament.id}`)
        tournament.entriesCount -= 1
        tournament.currentPlayers.splice(tournament.currentPlayers.indexOf(player), 1)
        tournament.totalPrize -= tournament.buyIn
        this.rankPlayers(tournament.id)
        this.adjustPrizeProol(tournament)
        this.broadcastTournamentList()
    }
    broadcastTournamentList(socket = undefined) {
        logger.log("broadcastTournamentList")
        let tournamentsList = []
        Object.values(this.tournaments).forEach(tournament => {
            let tournamentInfo = {
                tournamentID: tournament.id,
                title: tournament.title,
                buyIn: tournament.buyIn,
                pokerVariant: tournament.pokerVariant,
                tableSize: tournament.tableSize,
                startingChips: tournament.startingChips,
                blindLevel: tournament.blindLevel,
                blindStructure: tournament.blindStructure,
                blindLevelUpTime: tournament.blindLevelUpTime,
                nextBlindTime: tournament.nextBlindTime,
                playersList: tournament.playersList,
                playersLeft: tournament.currentPlayers.length,
                totalEntries: tournament.entriesCount,
                prizeStructure : tournament.prizeStructure ? tournament.prizeStructure : [],
                state: tournament.state
            }
            tournamentsList.push(tournamentInfo)
        })
        if (!socket) this.socketManager.to(`tournamentLobby`).emit("updateTournamentList", tournamentsList)
        if (socket) socket.emit("updateTournamentList", tournamentsList)
    }
    broadcastTournamentInfo(tournament) {
        logger.log("broadcastTournamentInfo")
        let tournamentInfo = {
            tournamentID: tournament.id,
            blindLevel: tournament.blindLevel,
            sb: tournament.sb,
            bb: tournament.bb,
            ante: tournament.ante,
            nextBlindTime: tournament.nextBlindTime,
            playersLeft: tournament.currentPlayers.length,
            prizedPlayers : tournament.prizeStructure.length,
        }
        logger.log("setting nextPrize")
        if (tournament.currentPlayers.length <= 1) {
            logger.log("one player left")
            tournamentInfo.nextPrize = tournament.prizeStructure[0]
        } else if (tournament.currentPlayers.length <= tournament.prizeStructure.length + 1) {
            logger.log("bubble or ITM")
            logger.log(`next player is ${tournament.currentPlayers.length-1}`)
            logger.log(`prizeStructure:`)
            logger.log(tournament.prizeStructure)
            tournamentInfo.nextPrize = tournament.prizeStructure[tournament.currentPlayers.length-2]
        } else {
            logger.log("not ITM")
            tournamentInfo.nextPrize = 0
        }
        logger.log(tournamentInfo.nextPrize)
        this.socketManager.to(`tournament:${tournament.id}`).emit("updateTournamentInfo", tournamentInfo)
        logger.log(tournamentInfo)
    }

    startTournament(tournamentID){
        logger.log(`startTournament(${tournamentID})`)
        const tournament = this.tournaments[tournamentID]
        if (tournament.started) return logger.log("tournament has already started")
        if (!tournament.lateRegister) {
            tournament.registrationAllowed = false
            tournament.state = "Running"
        }
        if (tournament.currentPlayers.length < tournament.minPlayers) {
            logger.log("tournament cannot start because there is not enough players")
            return this.cancelTournament(tournament)
        }
        this.tableManager.organizeTables(tournament)
        this.createBlindTimer(tournament)
        tournament.started = true
        if (tournament.lateRegister) tournament.state = "Late Register"
        this.broadcastTournamentInfo(tournament)
        if (Object.values(this.tournaments).length === 1) this.createTournament()
    }
    // getTournamentInfo(tournamentID) {}
    cancelTournament(tournament) {
        logger.log(`cancelTournament(${tournament.id})`)
        Object.keys(tournament.playersByUserID).forEach(userID => {
            const user = this.users[userID]
            this.unregisterOnTournament(user, tournament.id)
        })
        this.closeTournament(tournament.id)
    }
    closeTournament(tournamentID) {
        logger.log(`closeTournament(${tournamentID})`)
        const tournament = this.tournaments[tournamentID]
        clearInterval(tournament.blindTimer)
        this.socketManager.socketsLeave(`tournament:${tournament.id}`)
        tournament.state = "Completed"
        this.deleteTournament(tournamentID)
    }
    createBlindTimer(tournament) {
        //TODO create a timer interval and change blind Level and blind values.
        if (!tournament) return logger.log("tournament is undefined, something went wrong.")
        tournament.nextBlindTime = new Date().getTime() + tournament.blindLevelUpTime
        tournament.blindTimer = setInterval(()=>{
            logger.log(`blinds going up level ${tournament.blindLevel}`)
            if (tournament.blindLevel>=tournament.blindStructure.length) return clearInterval(tournament.blindTimer)
            tournament.blindLevel++
            tournament.sb = tournament.blindStructure[tournament.blindLevel-1].sb
            tournament.bb = tournament.blindStructure[tournament.blindLevel-1].bb
            tournament.ante = tournament.blindStructure[tournament.blindLevel-1].ante
            tournament.nextBlindTime = new Date().getTime() + tournament.blindLevelUpTime
            this.broadcastTournamentInfo(tournament)
        }, tournament.blindLevelUpTime)
    }
    leaveTournament(player) {
        logger.log(`leaveTournament(${player.name}, ${player.tournamentID})`)
        const user = this.users[player.userID]
        if (!user) return logger.log("user is undefined, something went wrong")
        const tournament = this.tournaments[player.tournamentID]
        if (!tournament) return logger.log("tournament is undefined, something went wrong.")
        
        if (!user.tournamentsPlaying[player.tournamentID]) return logger.log("player has already left the tournament.")
        delete user.tournamentsPlaying[player.tournamentID]
        delete user.players[player.id]
        // delete tournament.players[user.id]
        const socket = this.socketsByUserID[user.id]
        logger.log("prizeStructure")
        logger.log(tournament.prizeStructure)
        player.leftPosition = tournament.currentPlayers.length
        if (player.leftPosition <= tournament.prizeStructure.length) {
            logger.log(`player ${player.name} left at pos ${player.leftPosition} and won ${tournament.prizeStructure[player.leftPosition-1]}`)
            User.handleMoney(tournament.prizeStructure[player.leftPosition-1], user, socket, tournament.title, this.fastify.pg)
        }
        if (socket) {
            socket.emit("tournamentFinishMessage", {player: player, place: player.leftPosition, wonAmount: (player.leftPosition <= tournament.prizeStructure.length) ? tournament.prizeStructure[player.leftPosition-1] : 0})
        }
        tournament.currentPlayers.splice(tournament.currentPlayers.indexOf(player), 1)
        tournament.finishedPlayers.unshift(player)
        this.rankPlayers(tournament.id)
        this.broadcastTournamentInfo(tournament)
        socket.leave(`tournament:${tournament.id}`)
        if (tournament.currentPlayers.length === 1) return this.leaveTournament(tournament.currentPlayers[0])
        if (tournament.currentPlayers.length === 0) return this.closeTournament(tournament.id)
        this.tableManager.organizeTables(tournament)
        this.broadcastTournamentList()
    }
    createTournament(tournamentStructure = undefined){
        logger.log(`createTournament(${tournamentStructure})`)
        if (!tournamentStructure) tournamentStructure = {
            title: "ON DEMAND TOURNAMENT",
            id: uuidv4(),
            state: "Registering",
            gameType: "tournament",
            pokerVariant: "texas",
            betType: "NL",
            tableSize: 3,
            registrationAllowed: true,
            started: false,
            startingChips: 500,
            blindStructure : [
                {sb: 10, bb: 20, ante: 0},
                {sb: 15, bb: 30, ante: 0},
                {sb: 20, bb: 40, ante: 0},
                {sb: 30, bb: 60, ante: 0},
                {sb: 40, bb: 80, ante: 0},
                {sb: 50, bb: 100, ante: 0},
                {sb: 60, bb: 120, ante: 0},
                {sb: 80, bb: 160, ante: 0},
                {sb: 100, bb: 200, ante: 0},
                {sb: 125, bb: 250, ante: 0},
                {sb: 150, bb: 300, ante: 0},
                {sb: 200, bb: 400, ante: 0},
                {sb: 250, bb: 500, ante: 0},
                {sb: 300, bb: 600, ante: 0},
                {sb: 400, bb: 800, ante: 0},
                {sb: 500, bb: 1000, ante: 0},
            ],
            blindLevel: 1,
            sb: 10,
            bb: 20,
            ante: 0,
            buyIn: 10,
            entriesCount: 0,
            currentPlayers: [],
            finishedPlayers: [],
            playersList: [],
            minPlayers: 2,
            playersByUserID: {},
            tables: [],
            totalPrize: 0,
            blindLevelUpTime: 180000,
            startTimer: undefined,
            lateRegister: true
        }
        // tournamentStructure.startTimer = setTimeout(()=>{this.startTournament(tournamentStructure.id)}, 60000)
        this.tournaments[tournamentStructure.id] = tournamentStructure
        // this.tableManager.tables[tournamentStructure.id] = {}
        this.broadcastTournamentList()
    }
    deleteTournament(tournamentID){
        logger.log(`deleteTournament(${tournamentID})`)
        delete this.tournaments[tournamentID]
        if (Object.values(this.tournaments).length === 0) this.createTournament()
        this.broadcastTournamentList()
    }
    adjustPrizeProol(tournament) {
        logger.log(`adjustPrizeProol(${tournament.id})`)
        let numPlayers = tournament.entriesCount
        let tournamentBuyin = new Decimal(tournament.buyIn)
        let tournamentDistribution = 0.20;
        let prizeStructure = []
        let prizedPlayers = Math.ceil(numPlayers * tournamentDistribution)
        if (numPlayers === 0) {
            tournament.prizeStructure = prizeStructure
            return logger.log("there is no players left")
        }
        // console.log("prizedPlayers " + prizedPlayers)
        let totalPrize = tournamentBuyin.times(numPlayers)
        let initialTotalPrize = tournamentBuyin.times(numPlayers)
        // let minPrize = (1 + Math.sqrt(numPlayers) / Math.sqrt(prizedPlayers) * (1*(Math.sqrt(numPlayers)/100))) * tournamentBuyin
        let minPrize = new Decimal((1 + 0.1*(1 / (Math.sqrt(prizedPlayers)/Math.sqrt(numPlayers)))) * tournamentBuyin)
        for (let i = 0; i < prizedPlayers; i++) {
            prizeStructure.push(minPrize)
            // console.log(minPrize)
            totalPrize = totalPrize.minus(minPrize)
        }
        for (let i = 0; i < prizedPlayers; i++) {
            let prizeShare = new Decimal((Math.sqrt(numPlayers)/Math.sqrt(prizedPlayers) + prizedPlayers)/(numPlayers) * (prizedPlayers / (prizedPlayers+i)))
            // let prizeShare = new Decimal(numPlayers).squareRoot().dividedBy(new Decimal(prizedPlayers).squareRoot()).plus(prizedPlayers).dividedBy(new Decimal(numPlayers).times(new Decimal(prizedPlayers).dividedBy(new Decimal(prizedPlayers).plus(i))))
            // (Math.sqrt(numPlayers)/Math.sqrt(prizedPlayers) + prizedPlayers)
            // /
            // (numPlayers) * (prizedPlayers / (prizedPlayers+i))
            // console.log(`${i} : ${prizeShare.toNumber()}`)
            let playerPrize = prizeShare.times(totalPrize)
            prizeStructure[i] = prizeStructure[i].plus(playerPrize)
            totalPrize = totalPrize.minus(playerPrize)
        }
        let testPrize = new Decimal(0)
        for (let i = 0; i < prizeStructure.length; i++) {
            prizeStructure[i] = prizeStructure[i].plus(totalPrize.dividedBy(prizeStructure.length))
            prizeStructure[i] = prizeStructure[i].toDecimalPlaces(2)
            // console.log(`${i} : ${prizeStructure[i]}`)
            testPrize = testPrize.plus(prizeStructure[i])
        }
        prizeStructure[prizeStructure.length-1] = prizeStructure[prizeStructure.length-1].minus(testPrize.minus(initialTotalPrize))
        testPrize = new Decimal(0)
        for (let i = 0; i < prizeStructure.length; i++) {
            // console.log(`${i} : ${prizeStructure[i]}`)
            testPrize = testPrize.plus(prizeStructure[i])
            prizeStructure[i] = prizeStructure[i].toNumber()
        }
        tournament.prizeStructure = prizeStructure
    }
    rankPlayers(tournamentID) {
        logger.log(`rankPlayers(${tournamentID})`)
        const tournament = this.tournaments[tournamentID]
        if (!tournament) return logger.log("tournament doesnt exists anymore")
        mergeSort(tournament.currentPlayers, 0, tournament.currentPlayers.length-1)
        tournament.playersList = tournament.currentPlayers.concat(tournament.finishedPlayers)
        logger.log(tournament.playersList)
    }
    // getTournamentsList(){}

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
            logger.log("updating balance")
            User.handleMoney(-stackSize.toNumber(), user, socket, `⚡ ${this.pools[poolID].gameTitle}`, this.fastify.pg)

            if (socket) socket.emit("updateUserInfo", { user : user, status: 200})
            return 
        }
        if (socket) socket.emit("enterPoolResponse", { response: "stacksize not valid", status: 403 })
    }
    sendEmptyTable(player) {
        logger.log("sendEmptyTable()")
        if (!player) return logger.log("player is undefined.")
        const tournament = this.tournaments[player.tournamentID]
        if (!tournament) return logger.log("tournament is over.")
        let handState = {
            title : tournament.title,
            tableSize : tournament.tableSize,
            sb : tournament.sb,
            bb : tournament.bb,
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
            tournamentID: player.tournamentID,
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
        if (socket) socket.emit("updateGameState", handState);
        if (player.stackSize.equals(0)) {
            logger.log(`player.stackSize: ${player.stackSize}`)
            // this.leavePool(socket, player)
            // if (socket) return socket.emit("askRebuy", {playerID : player.id, tournamentID: player.tournamentID, buyIn: tournament.buyIn})
        }
    }
    sitoutUpdate(playerID, tournamentID, isSitout) {
        logger.log("sitoutUpdate")
        logger.log(playerID)
        logger.log(tournamentID)
        logger.log(isSitout)
        const tournament = this.tournaments[tournamentID]
        if (!tournament) return logger.log("tournament invalid")
        const player = tournament.currentPlayers.filter((player) => player.id === playerID)[0]
        if (!player) return logger.log("player invalid")
        const socket = this.socketsByUserID[player.userID]
        if (!socket) return logger.log("socket invalid")
        logger.log("updating sitout for player " + player.name + " isSitout: " + isSitout)
        player.isSitout = isSitout //player can become sitout or not
        const table = tournament.tables.filter((table) => table.id === player.tableID)[0]
        if (!table) return logger.log("table is invalid")
        table.broadcastHandState()
    }
}

module.exports = PlayerPoolManager;
