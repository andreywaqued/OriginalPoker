const { rankHands } = require('@xpressit/winning-poker-hand-rank');
const { v4: uuidv4 } = require('uuid');
const Decimal = require('decimal.js');
const Logger = require("../logger")
const logger = new Logger("Table")
class Deck {
    constructor() {
        this.cards = [
            "AS", "AH", "AC", "AD",
            "KS", "KH", "KC", "KD",
            "QS", "QH", "QC", "QD",
            "JS", "JH", "JC", "JD",
            "TS", "TH", "TC", "TD",
            "9S", "9H", "9C", "9D",
            "8S", "8H", "8C", "8D",
            "7S", "7H", "7C", "7D",
            "6S", "6H", "6C", "6D",
            "5S", "5H", "5C", "5D",
            "4S", "4H", "4C", "4D",
            "3S", "3H", "3C", "3D",
            "2S", "2H", "2C", "2D",
        ]
    }
    getCard() {
        this.shuffleDeck()
        // logger.log(this.cards)
        if (Math.random() < 0.5) return this.cards.shift()
        return this.cards.pop()
    }
    shuffleDeck() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]
        }
        return this.cards
    }
}

roundStr = ["Preflop", "Flop", "Turn", "River"]

class Table {
    constructor(TableManager, tournament) {
        this.id = uuidv4();
        this.title = tournament.title || "Table X";
        this.betType = tournament.betType || "NL";
        this.gameType = tournament.gameType || "tournament";
        this.pokerVariant = tournament.pokerVariant || "texas";
        this.tableSize = tournament.tableSize || 6;
        this.sb = new Decimal(tournament.sb);
        this.bb = new Decimal(tournament.bb);
        this.ante = new Decimal(tournament.ante) || new Decimal(0);
        this.tournamentID = tournament.id || "";
        this.timeBank = 20000
        this.timeLimitCounter = undefined
        this.waitingForPlayers = true;
        this.startHandTimer = undefined
        TableManager.fastify.redis.hset(`table:${this.id}`, "tableInfo", JSON.stringify(this))
        this.players = {};
        this.socketsByUserID = {};
        this.playerIDByPositionIndex = new Array(this.tableSize).fill(null);
        this.tableManager = TableManager;
        this.socketManager = TableManager.socketManager;
        this.currentHand = {
            title: this.title,
            tableSize : this.tableSize,
            sb : this.sb,
            bb : this.bb,
            handIsBeingPlayed : false,
            isShowdown : false,
            // players : this.players,
            pots : [new Decimal(0)],
            actionSequence : [],
            // playersActive : this.playerIDByPositionIndex,
            boardCards : [],
            boardRound : 0,
            minBet : new Decimal(0),
            maxBet : new Decimal(9999999999),
            biggestBet : new Decimal(0),
            positionActing : -1,
            timeLimitToAct: 0,
            playersAllin : 0,
            playersFolded : 0,
            dealerPos: -1,
            sbPos: -1,
            bbPos: -1,
            handHistory: "",
        }
    }

    sitPlayer(player) {
        logger.log(`sitPlayer(player)`)
        logger.log(player.name)
        // if (this.playerIDByPositionIndex.length === 0) player.stackSize = 50 //so pra testar a criacao dos pots
        if (!this.tableManager.playerPoolManager.socketsByUserID[player.userID]) {
            logger.log("socket nao encontrado")
            logger.log(player.socketID)
            logger.log(Object.keys(this.tableManager.playerPoolManager.socketsByUserID))
            return
        } 
        player.position = -1;
        for (let i = 0; i < this.playerIDByPositionIndex.length; i++) {
            if (!this.playerIDByPositionIndex[i]) {
                this.playerIDByPositionIndex[i] = player.id;
                player.position = i;
                break
            }
        }
        if (player.position === -1) {
            //TODO talvez isso daqui possa bugar qnd tiver muitos jogadores e 2 jogadores sentarem exatamente ao mesmo tempo e a mesa estiver cheia (1 jogador sentou qnd tinham 5 e outro qnd tinham 6)
            //testando implementacao
            logger.log("failed to find a seat")
            return this.tableManager.placePlayerIntoTable(player)
        }
        player.cards = []
        player.actedSinceLastRaise = false
        player.possibleActions = []
        player.hasFolded = true //just for animation purposes, it will be setted to false when the hand starts.
        player.askedToFold = false
        player.isButton = false
        player.showCards = false
        player.isWinner = false
        player.stackSize = new Decimal(player.stackSize)
        player.betSize = new Decimal(0)
        player.contestingPots = [0]
        player.finalHandRank = {rank: -1, combination: ""}
        player.lastAction = ""
        // player.isSitout = false;
        this.players[player.id] = player;
        // this.playerIDByPositionIndex.push(player.id);
        player.tableID = this.id;
        this.socketsByUserID[player.userID] = this.tableManager.playerPoolManager.socketsByUserID[player.userID];
        this.sendHandTrasition(player)
        this.socketsByUserID[player.userID].join(`table:${this.id}`);
        // logger.log(this.players)
        // logger.log(this.playerIDByPositionIndex)
        // logger.log(this.socketsByPlayerID)
        
        // if (!this.currentHand.handIsBeingPlayed) this.broadcastHandState()
        this.broadcastHandState()
        if (!this.currentHand.handIsBeingPlayed) this.startHandRoutine()
        // this.socketManager.to(`table:${this.id}`).emit("updateGameState", this.currentHand);
        
    }
    startHandRoutine(){
        logger.log("startHandRoutine()")
        clearTimeout(this.startHandTimer)
        const countPlayers = this.countPlayers()
        logger.log("countPlayers " + countPlayers)
        if (countPlayers === 0) return this.tableManager.deleteTable(this.tournamentID, this.id)
        if (countPlayers < this.tableSize) this.waitingForPlayers = true
        if (countPlayers === this.tableSize) {
            this.waitingForPlayers = false
            // clearTimeout(this.startHandTimer)
            this.startHandTimer = setTimeout(() => this.startNewHand(), 500)
            // this.startNewHand()
        } else if (countPlayers >= 2) {
            // clearTimeout(this.startHandTimer)
            this.startHandTimer = setTimeout(() => this.startNewHand(), 1000)
        }
    }
    sendHandTrasition(player) {
        logger.log(`sendHandTrasition()`)
        //send hand transition when player folds or the hand is over
        if (this.socketsByUserID[player.userID]) this.socketsByUserID[player.userID].emit("handTransition", player)
    }
    broadCastIndividualPlayerInfo(playerID = undefined) {
        logger.log(`broadCastIndividualPlayerInfo()`)
        //send cardback to all players except the player holding its cards
        if (playerID) {
            const player = this.players[playerID]
            if (!player) return logger.log("player is undefined")
            if (player.askedToFold) return logger.log("player asked to fold")
            // if (!player.tableID) continue
            // if (player.hasFolded) continue
            logger.log(`id: ${player.id}, name: ${player.name}, stack: ${player.stackSize}, cards: ${player.cards}, tableID: ${player.tableID}`)//this gave an error recently,
            if (this.currentHand.boardCards.length>=3 && !player.hasFolded && !player.askedToFold && player.cards.length>0) player.finalHandRank = rankHands(this.pokerVariant, this.currentHand.boardCards, [player.cards])[0]
            // trying to verify what it is sending to see if can filter to avoid sending too much information
            if (this.socketsByUserID[player.userID]) this.socketsByUserID[player.userID].emit("updatePlayerInfo", player)
            return
        }
        for (let i = 0; i < this.playerIDByPositionIndex.length; i++) {
            const playerID = this.playerIDByPositionIndex[i]
            const player = this.players[playerID]
            if (!player) continue
            if (player.askedToFold) continue
            // if (!player.tableID) continue
            // if (player.hasFolded) continue
            logger.log(`id: ${player.id}, name: ${player.name}, stack: ${player.stackSize}, cards: ${player.cards}, tableID: ${player.tableID}`)//this gave an error recently,
            if (this.currentHand.boardCards.length>=3 && !player.hasFolded && !player.askedToFold && player.cards.length>0) player.finalHandRank = rankHands(this.pokerVariant, this.currentHand.boardCards, [player.cards])[0]
            // trying to verify what it is sending to see if can filter to avoid sending too much information
            if (this.socketsByUserID[player.userID]) this.socketsByUserID[player.userID].emit("updatePlayerInfo", player)
        }
    }
    broadcastHandState(playerID = undefined) {
        logger.log("broadcasting handState for table: " + this.id)
        let handState = JSON.parse(JSON.stringify(this.currentHand)) // copies the current hand
        handState.players = {}
        delete handState.handHistory
        for (let i = 0; i < this.playerIDByPositionIndex.length; i++) {
            logger.log("entrou no player " + this.playerIDByPositionIndex[i])
            const playerID = this.playerIDByPositionIndex[i]
            const player = this.players[playerID]
            if (!player) continue
            handState.players[playerID] = {
                id : player.id,
                name: player.name,
                userID: player.userID,
                avatar: player.avatar,
                tableID: player.tableID,
                tournamentID: player.tournamentID,
                stackSize: player.stackSize.toNumber(),
                hasFolded: player.hasFolded,
                isSitout: player.isSitout,
                betSize: player.betSize.toNumber(),
                cards: [],
                possibleActions: player.possibleActions,
                isButton : player.isButton,
                position : player.position,
                showCards : player.showCards,
                isWinner : player.isWinner,
                lastAction: player.lastAction,
                tableClosed: player.tableClosed
            }
            if (player.cards.length > 0) handState.players[playerID].cards = ["cb", "cb"]
            if (handState.isShowdown && player.showCards) handState.players[playerID].cards = player.cards
            // if (handState.handIsBeingPlayed && handState.isShowdown) handState.players[playerID].cards = ["cb", "cb"]

            // logger.log(this.socketsByPlayerID[player.socketID])
            // this.socketsByPlayerID[player.socketID].emit("updateGameState", handState)
        }
        // logger.log("asd")
        logger.log(handState)
        this.tableManager.fastify.redis.hset(`table:${this.id}`, "players", JSON.stringify(this.players))
        this.tableManager.fastify.redis.hset(`table:${this.id}`, "gameState", JSON.stringify(this.currentHand))
        if (!playerID) {
            this.socketManager.to(`table:${this.id}`).emit("updateGameState", handState);
            this.broadCastIndividualPlayerInfo()
        }
        if (playerID) {
            logger.log("individual player broadcast")
            const player = this.players[playerID]
            if (player) {
                logger.log("sending gameState to player: " + player.name)
                if (player.askedToFold) return false
                if (player.hasFolded) return false
                const socket = this.socketsByUserID[player.userID]
                if (!socket) return false
                socket.join(`table:${this.id}`)
                socket.emit("updateGameState", handState)
                this.broadCastIndividualPlayerInfo(playerID)
                return true
            }
            return false
        }
        // if (playerID) this.socketManager.to(`table:${this.id}`).emit("updateGameState", handState);
        // if (this.currentHand.handIsBeingPlayed) this.broadCastIndividualPlayerInfo()
    }
    sendEmptyTable(player) {
        logger.log("sendEmptyTable")
        let handState = {
            tableSize : this.tableSize,
            sb : this.sb,
            bb : this.bb,
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
            name: player.name,
            avatar: player.avatar,
            tableID: player.tableID,
            stackSize: player.stackSize.toNumber(),
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
    countPlayers(){
        let count = 0
        for (let i = 0; i < this.playerIDByPositionIndex.length; i++) {
            if (!this.playerIDByPositionIndex[i]) continue
            count++
        } 
        return count
    }
    findNextPlayer(start){
        if (start >= this.playerIDByPositionIndex.length) start -= this.playerIDByPositionIndex.length
        for (let i = start+1; i <= start + this.playerIDByPositionIndex.length; i++) {
            let index = i
            if (index >= this.playerIDByPositionIndex.length) index -= this.playerIDByPositionIndex.length
            logger.log(index)
            if (!this.playerIDByPositionIndex[index]) continue
            logger.log("returning: " + index)
            logger.log("playerID: " + this.playerIDByPositionIndex[index])
            return index
            if (i === this.countPlayers()) i - this.countPlayers()
            if (!this.playerIDByPositionIndex[i]) continue
            return i
        } 
    }
    validateAction(playerFromClient, action) {
        logger.log(`validateAction(playerFromClient, action)`)
        logger.log(playerFromClient.name)
        logger.log(action)
        logger.log(this.id)
        if (!action) return logger.log("action is undefined")
        if (!action.type) return logger.log("action.type is undefined")
        if (typeof(action.amount) != "number") return logger.log("action.amount is not a number")
        action.amount = parseFloat(action.amount.toString().replaceAll(",", "."))
        action.amount = new Decimal(action.amount)
        if (action.amount.isNaN()) return logger.log("action not allowed")
        
        //validate if player can make that action
        //update gamestate and broadcast or reply invalid
        // logger.log(this.currentHand.actionSequence)
        // logger.log(action)
        // logger.log(player.possibleActions)
        logger.log("validateAction 1")
        const playerSocket = this.socketsByUserID[playerFromClient.userID]
        let player = this.players[playerFromClient.id]
        if (!player) return logger.log("player undefined, something went wrong!")
        if (!playerSocket) return logger.log("player socket undefined, something went wrong!")
        if (playerFromClient.tableID != this.id) return logger.log("playerFromClient.tableID is not from this table, something went wrong!")
        if (player.tableID != this.id) return logger.log("player.tableID is not from this table, something went wrong!")
        // player.isSitout = playerFromClient.isSitout
        // logger.log(player)
        //
        if (!this.currentHand.handIsBeingPlayed) return logger.log("hand is over")
        const currentPlayer = this.players[this.playerIDByPositionIndex[this.currentHand.positionActing]]
        if (currentPlayer.id != player.id) return logger.log("wrong player")
        if (player.askedToFold && player.hasFolded) return logger.log("player already asked to fold")
        if (player.hasFolded) return logger.log("player has already folded, something went wrong")
        logger.log("validateAction 2")
        // if (player.isSitout) return "player is sitout"
        // logger.log(player.possibleActions.includes(action))
        // logger.log(player.possibleActions[1] === action)
        // logger.log(action.type != "raise")
        let actionAllowed = false;
        if (player.possibleActions.length === 0) logger.log("possibleActions is empty")
        logger.log(player.possibleActions)
        for (let i = 0; i<player.possibleActions.length; i++) {
            if (actionAllowed) continue
            const actionAtIndex = player.possibleActions[i]
            if (action.type === actionAtIndex.type) {
                logger.log(`(${action.type} === "raise" || ${action.type} === "bet") && ${action.amount} >= ${actionAtIndex.amount} : ${(action.type === "raise" || action.type === "bet") && action.amount.greaterThanOrEqualTo(actionAtIndex.amount)}`)
                // if (action.amount.greaterThanOrEqualTo(actionAtIndex.amount))
                if ((action.type === "call" || action.type === "fold" || action.type === "check") && action.amount.equals(actionAtIndex.amount)) actionAllowed = true;
                // if ((action.type === "call") && action.amount.equals(player.betSize.plus(player.stackSize))) actionAllowed = true;
                if ((action.type === "raise" || action.type === "bet") && action.amount.lessThan(this.currentHand.minBet)) return this.validateAction(player, {type: "raise", amount: this.currentHand.minBet.toNumber()});
                if ((action.type === "raise" || action.type === "bet") && action.amount.greaterThanOrEqualTo(this.currentHand.minBet)) actionAllowed = true;
            }
        }
        logger.log("validateAction 3")
        logger.log(`actionAllowed: ${actionAllowed}`)
        if (!actionAllowed) return logger.log("action not allowed")
        clearTimeout(this.timeLimitCounter) //validou a acao
        player.lastAction = action.type
        logger.log("validateAction 4")
        // if (action.amount < this.currentHand.biggestBet && action.amount < player.stackSize) return "amount is not allowed"
        //action valid
        // logger.log(`${action.amount} > ${player.stackSize} + ${player.betSize}: ${action.amount > player.stackSize + player.betSize}`)
        if (action.amount.greaterThan(player.stackSize.plus(player.betSize))) action.amount = player.stackSize.plus(player.betSize)
        if (action.type === "fold") {
            logger.log("player folded")
            player.hasFolded = true;
            this.currentHand.playersFolded++
            // player.tableID = undefined
            // logger.log(`player.isSitout: ${player.isSitout}`)
            // // player.cards = [];
            // playerSocket.leave(`table:${this.id}`);
            // delete this.socketsByUserID[player.userID]
            // if (!player.askedToFold) {
            //     logger.log(player.name + " reentering pool when not fast folded")
            //     const playerCopy = JSON.parse(JSON.stringify(player))
            //     playerCopy.stackSize = new Decimal(playerCopy.stackSize)
            //     playerCopy.betSize = new Decimal(playerCopy.betSize)
            //     this.tableManager.playerPoolManager.reEnterPool(playerCopy)
            // }
            // const playerCopy = JSON.parse(JSON.stringify(player))
            // this.players[player.id] = playerCopy
            // if (!player.askedToFold) this.tableManager.playerPoolManager.reEnterPool(player)
            // player = playerCopy
            // player.stackSize = new Decimal(player.stackSize)
            // player.betSize = new Decimal(player.betSize)
        }
        logger.log("validateAction 5")
        if (action.type === "check" && this.currentHand.biggestBet.greaterThan(player.betSize)) return this.validateAction(player, player.possibleActions[0])
        logger.log("validateAction 6")
        if (action.type === "raise" || action.type === "bet") {
            if (action.amount.lessThan(this.currentHand.minBet) && this.currentHand.minBet.lessThan(player.stackSize)) action.amount = this.currentHand.minBet
            if (action.amount.lessThan(this.currentHand.minBet) && this.currentHand.minBet.greaterThan(player.stackSize.plus(player.betSize))) action.amount = player.stackSize.plus(player.betSize)
            if (action.amount.lessThanOrEqualTo(this.currentHand.biggestBet)) return this.validateAction(player, player.possibleActions[1])
            const secondBiggestBet = this.currentHand.biggestBet
            this.currentHand.biggestBet = action.amount
            this.currentHand.minBet = this.currentHand.biggestBet.plus(this.currentHand.biggestBet).minus(secondBiggestBet)
            this.setAllPlayerActedSinceLastRaiseToFalse()
        }
        logger.log("validateAction 7")
        if (action.type != "fold" && action.type != "check")  {
            player.stackSize = player.stackSize.minus(action.amount.minus(player.betSize))
            player.betSize = action.amount
        }
        if (action.amount.greaterThanOrEqualTo(player.stackSize.plus(player.betSize))) this.currentHand.playersAllin++
        action.playerName = player.name
        this.currentHand.actionSequence.push(action)
        player.actedSinceLastRaise = true;
        player.possibleActions = []
        logger.log("validateAction 8")
        this.prepareNextPlayerTurn()
        if (playerSocket) playerSocket.emit("actionResponse", {message: `action : {action.type:${action.type}, action.amount:${action.amount}} accepted`, status:200})
        return true
    }
    evaluateHand() {
        logger.log("evaluateHand()")
        
        // const board = [this.deck[0], this.deck[1], this.deck[2], this.deck[3], this.deck[4]]
        for (let potIndex = 0; potIndex < this.currentHand.pots.length; potIndex ++) {
            let winnerRank = 999999
            let winners = []
            let winnerNames = []
            let playersContestingThisPot = 0
            if (this.currentHand.pots[potIndex].equals(0)) {
                logger.log("pot is empty")
                continue
            }
            for (let i = 0; i < this.playerIDByPositionIndex.length; i++) {
                const player = this.players[this.playerIDByPositionIndex[i]]
                if (!player) continue
                if (player.hasFolded || !player.contestingPots.includes(potIndex)) continue
                playersContestingThisPot++
                // player.finalHandRank = {rank: -1}
                // logger.log(this.currentHand.boardCards, [player.cards])
                if (this.currentHand.boardCards.length > 0 && player.finalHandRank.rank === -1) player.finalHandRank = rankHands(this.pokerVariant, this.currentHand.boardCards, [player.cards])[0]
                if (player.finalHandRank.rank < winnerRank) {
                    winnerRank = player.finalHandRank.rank
                    winners = []
                }
                if (player.finalHandRank.rank === winnerRank) winners.push(player)
                // player.finalHandRank = rankHands(gameType, board, player.cards)
            }
            for (let i = 0; i< winners.length; i++){
                // logger.log(winners)
                // logger.log(this.currentHand.pots)
                // logger.log(potIndex)
                winners[i].stackSize = winners[i].stackSize.plus(this.currentHand.pots[potIndex].dividedBy(winners.length))
                if (playersContestingThisPot > 1) winners[i].showCards = true
                winners[i].isWinner = true
                winnerNames.push(JSON.stringify(winners[i].name).replaceAll("\"", ""))
            }
            logger.log("creating array to remove players")
            let playersToRemoveFromTournament = []
            for (let i = 0; i < this.playerIDByPositionIndex.length; i++) {
                const player = this.players[this.playerIDByPositionIndex[i]]
                if (!player) continue
                logger.log(`checking player ${player.name}`)
                logger.log(playersToRemoveFromTournament)
                if (player.hasFolded || !player.contestingPots.includes(potIndex)) continue
                if (player.stackSize.greaterThan(0)) continue //player still on the tournament
                if (player.contestingPots[player.contestingPots.length-1] != potIndex) continue //player can still win another pot
                if (player.leftPosition) continue //player already left
                let arrayTemp = []
                for (let x = 0; x < playersToRemoveFromTournament.length; x++) {
                    const playerToCompare = playersToRemoveFromTournament[x]
                    arrayTemp = playersToRemoveFromTournament.slice(0, x+1)
                    if (player.finalHandRank.rank > playerToCompare.finalHandRank.rank) continue
                    logger.log(`adding player ${player.name}`)
                    arrayTemp.push(player)
                    playersToRemoveFromTournament.slice(x+1).forEach(playerLeft => {
                        arrayTemp.push(playerLeft)
                    })
                    // break
                    // if (player.finalHandRank.rank < playerToCompare.finalHandRank.rank) {
                    //     playersToRemoveFromTournament.splice(x, 0, playerToCompare)
                    //     break
                    // } else {
                    //     logger.log(`adding player ${player.name}`)
                    //     playersToRemoveFromTournament.splice(x, 0, player)
                    //     break
                    // }
                }
                if (playersToRemoveFromTournament.length === 0) arrayTemp.push(player) //add the player here, because will not enter the for loop
                playersToRemoveFromTournament = arrayTemp
            }
            for (let i = 0; i < playersToRemoveFromTournament.length; i++) {
                const player = playersToRemoveFromTournament[i]
                logger.log(`removing player ${player.name} with hand rank ${player.finalHandRank.rank}`)
                this.tableManager.playerPoolManager.leaveTournament(player, this.tournamentID)
            }
            
            if (winners.length > 0) this.currentHand.actionSequence.push({pot: potIndex, potSize: this.currentHand.pots[potIndex], winners: winnerNames})
            this.currentHand.pots[potIndex] = new Decimal(0)
        }
        // const playerCards1 = [this.deck[5], this.deck[6]]
        // const playerCards2 = [this.deck[7], this.deck[8]]
        // const playerCards3 = [this.deck[9], this.deck[10]]
        // const result = rankHands(gameType, board, [playerCards1, playerCards2, playerCards3])
        // logger.log(playerCards1, playerCards2, playerCards3, board)
        this.currentHand.handIsBeingPlayed = false;
        this.currentHand.isShowdown = true;
        // logger.log(this.currentHand.players)
        logger.log("evaluateHand() 1")
        this.broadcastHandState()
        // setTimeout(() => {this.startNewHand()}, 5000)
        logger.log("evaluateHand() 2")
        setTimeout(() => {this.closeHand()}, 3000)

        // return winners
        // return this.distributeWinnings()
    }
    startNewRoundAtShowdown() {
        this.currentHand.isShowdown = true
        for (let i = 0; i < this.playerIDByPositionIndex.length; i++) {
            const player = this.players[this.playerIDByPositionIndex[i]]
            if (!player) continue
            if (!player.hasFolded) player.showCards = true
        }
        this.currentHand.positionActing = -1 //sending this only for showing the moment when the player acts before showing the new round
        this.broadcastHandState() //sending this only for showing the moment when the player acts before showing the new round
        this.startNewRound(1000)
    }
    prepareNextPlayerTurn(){
        logger.log("prepareNextPlayerTurn()")
        if (!this.currentHand.handIsBeingPlayed) return logger.log("hand is over")
        
        if (this.currentHand.playersFolded === this.countPlayers() - 1) {
            this.currentHand.positionActing = -1 //sending this only for showing the moment when the player acts before showing the new round
            this.broadcastHandState() //sending this only for showing the moment when the player acts before showing the new round
            return setTimeout(() => {this.startNewRound()}, 500)
        }
        let playersLeftWithChips = 0
        if (this.currentHand.playersFolded + this.currentHand.playersAllin === this.countPlayers()) return this.startNewRoundAtShowdown()
        logger.log("prepareNextPlayerTurn() 1")
        this.currentHand.positionActing = this.findNextPlayer(this.currentHand.positionActing)
        // this.currentHand.positionActing++
        // if (this.currentHand.positionActing > this.playerIDByPositionIndex.length - 1) this.currentHand.positionActing -= this.playerIDByPositionIndex.length
        // logger.log(this.currentHand.positionActing)
        // logger.log(this.playerIDByPositionIndex.length)
        const nextPlayer = this.players[this.playerIDByPositionIndex[this.currentHand.positionActing]]
        nextPlayer.stackSize = new Decimal(nextPlayer.stackSize)
        nextPlayer.betSize = new Decimal(nextPlayer.betSize)
        // logger.log(nextPlayer)
        //check to see if the players left are already allin
        for (let i = 0; i < this.playerIDByPositionIndex.length; i++) {
            // if (playersLeftWithChips > 2) continue
            const player = this.players[this.playerIDByPositionIndex[i]]
            if (!player) continue
            player.stackSize = new Decimal(player.stackSize)
            player.betSize = new Decimal(player.betSize)
            if (!player.hasFolded && nextPlayer.betSize.lessThan(player.stackSize.plus(player.betSize))) playersLeftWithChips++ //old way
            // if (player.betSize.lessThan(this.currentHand.biggestBet) && !player.stackSize.equals(0) && !player.hasFolded && !player.askedToFold) player.possibleActions = [{type: "⚡Fold", amount: 0}] //activate fastfold for everyone that needs to call a bet
            // if (!player.hasFolded && player.stackSize.greaterThan(0)) playersLeftWithChips++ //teste (NAO FUNCIONOU DIREITO, QUANDO O JOGADOR VAI ALLIN ELE FICA COM STACK 0, DAI BUGA)
        }
        if (playersLeftWithChips < 2) return this.startNewRoundAtShowdown()

        if (nextPlayer.actedSinceLastRaise && this.currentHand.boardRound != 4) {
            this.currentHand.positionActing = -1 //sending this only for showing the moment when the player acts before showing the new round
            this.broadcastHandState() //sending this only for showing the moment when the player acts before showing the new round
            return setTimeout(() => {this.startNewRound()}, 500)
        }
        logger.log("prepareNextPlayerTurn() 2")
        // if (nextPlayer.stackSize === 0) {
        //     nextPlayer.actedSinceLastRaise = true
        //     return this.prepareNextPlayerTurn()
        // } 
        if (nextPlayer.hasFolded || nextPlayer.stackSize.equals(0)) return this.prepareNextPlayerTurn()
         
        logger.log("prepareNextPlayerTurn() 3")
        if (this.currentHand.minBet.lessThanOrEqualTo(this.bb)) this.currentHand.minBet = new Decimal(this.bb)
        nextPlayer.possibleActions = [{type: "fold", amount: 0}]
        if (this.currentHand.biggestBet.equals(nextPlayer.betSize)) nextPlayer.possibleActions.push({type: "check", amount: 0})
        logger.log("prepareNextPlayerTurn() 4")
        logger.log("nextPlayer: " + nextPlayer.name)
        // if (nextPlayer.isSitout) return this.validateAction(nextPlayer, nextPlayer.possibleActions[nextPlayer.possibleActions.length -1])
        if (this.currentHand.biggestBet.greaterThan(nextPlayer.betSize)) {
            if (nextPlayer.stackSize.plus(nextPlayer.betSize).greaterThan(this.currentHand.biggestBet)) {
                nextPlayer.possibleActions.push({type: "call", amount: this.currentHand.biggestBet.toNumber()})
            } else {
                nextPlayer.possibleActions.push({type: "call", amount: nextPlayer.stackSize.plus(nextPlayer.betSize).toNumber()})
            }
        } 
        if (this.currentHand.biggestBet.equals(0)) nextPlayer.possibleActions.push({type: "bet", amount: this.bb})
        if (this.currentHand.biggestBet.greaterThan(0)) nextPlayer.possibleActions.push({type: "raise", amount: this.currentHand.minBet.toNumber()}) 
        logger.log("prepareNextPlayerTurn() 5")
        if (nextPlayer.askedToFold) {
            logger.log("folding player that has ⚡Fold")
            return this.validateAction(nextPlayer, nextPlayer.possibleActions[0])
        }
        if (nextPlayer.tableClosed) {
            logger.log("folding player that has closed the table on the client")
            return this.validateAction(nextPlayer, nextPlayer.possibleActions[0])
        }
        this.currentHand.timeLimitToAct = new Date().getTime() + this.timeBank //timestamp + 20sec
        clearTimeout(this.timeLimitCounter)
        logger.log("setting timeout for player " + nextPlayer.name + " at table " + this.id)
        this.timeLimitCounter = setTimeout(()=> {
            logger.log("time is over, folding player")
            logger.log(this.id)
            logger.log(nextPlayer.name)
            logger.log(nextPlayer.tableID)
            logger.log(nextPlayer.possibleActions)
            if (!nextPlayer) {
                logger.log("exiting application because player doesnt exist")
                return process.exit()
            }
            nextPlayer.isSitout = true;
            const socket = this.socketsByUserID[nextPlayer.userID]
            if (socket) socket.emit("sitoutUpdate", {playerID : nextPlayer.id, isSitout: nextPlayer.isSitout})
            if (this.id != nextPlayer.tableID) {
                logger.log("exiting application because tableID from player is not matching with this tableID")
                return process.exit()
            }
            // if (nextPlayer.possibleActions.length === 0) return logger.log("nextPlayer.possibleActions.length === 0")//server protection case for when something went wrong.
            if (nextPlayer.possibleActions.length === 0) {
                logger.log("exiting application because its trying to fold a player that has no actions.")
                return process.exit() //server protection case for when something went wrong.
            }
            let timeoutAction = nextPlayer.possibleActions[0]
            if (nextPlayer.possibleActions[1].type === "check") timeoutAction = nextPlayer.possibleActions[1]
            //send sitout
            // const socket = this.socketsByPlayerID[nextPlayer.socketID]
            // if (socket) socket.emit("sitoutUpdate", {playerID: nextPlayer.id, isSitout: true})
            //
            this.validateAction(nextPlayer, timeoutAction)
            logger.log("time is over, folding player 2")
        }, this.currentHand.timeLimitToAct - new Date().getTime())
        
        logger.log("prepareNextPlayerTurn() 5")
        this.broadcastHandState()
    }

    setAllPlayerActedSinceLastRaiseToFalse() {
        logger.log("setAllPlayerActedSinceLastRaiseToFalse()")
        for (let i = 0; i<this.playerIDByPositionIndex.length;i++) {
            const player = this.players[this.playerIDByPositionIndex[i]]
            if (!player) continue
            player.actedSinceLastRaise = false;
        }
    }
    putBetsIntoPot() {
        logger.log("putBetsIntoPot()")
        let highestBet = new Decimal(0)
        let highestBetPlayer
        let secondHighestBet = new Decimal(0)
        let qtdHighestBet = 0
        let smallestAllin = new Decimal(99999)
        let playersAllinOnThisRound = 0
        const lastPot = this.currentHand.pots.length - 1
        logger.log("putBetsIntoPot() 1")
        for (let i = 0; i<this.playerIDByPositionIndex.length;i++) {
            logger.log("putBetsIntoPot() 2")
            const player = this.players[this.playerIDByPositionIndex[i]]
            // logger.log(smallestAllin)
            if (!player) continue
            player.stackSize = new Decimal(player.stackSize) //player here may be copied when he folds and the value doesnt come as Decimal
            player.betSize = new Decimal(player.betSize) //player here may be copied when he folds and the value doesnt come as Decimal
            player.lastAction = ""; //reset the lastAction
            if (player.stackSize.equals(0) && player.betSize.greaterThan(0)) {
                if (player.betSize.lessThanOrEqualTo(smallestAllin)) smallestAllin = player.betSize
            }
            // logger.log(smallestAllin)
            // logger.log(highestBet)
            // logger.log(secondHighestBet)
            if (player.betSize.greaterThan(highestBet)) {
                secondHighestBet = highestBet
                highestBet = player.betSize
                highestBetPlayer = player
                qtdHighestBet = 0
            } else if (player.betSize.greaterThan(secondHighestBet)) {
                secondHighestBet = player.betSize
            }
            // logger.log(highestBet)
            // logger.log(secondHighestBet)
            if (player.betSize.equals(highestBet)) qtdHighestBet++
        }
        // logger.log(qtdHighestBet)
        // if (lastPot > 6) process.exit()
        logger.log("putBetsIntoPot() 3")
        // logger.log(smallestAllin)
        // logger.log(highestBet)
        // logger.log(secondHighestBet)
        // logger.log(qtdHighestBet)
        if (qtdHighestBet === 1) {
            highestBetPlayer.stackSize = highestBetPlayer.stackSize.plus(highestBetPlayer.betSize.minus(secondHighestBet))
            highestBetPlayer.betSize = secondHighestBet
            // logger.log(this.currentHand.pots)
            // process.exit(1)
            return this.putBetsIntoPot()
        }
        // if (this.currentHand.playersFolded + this.currentHand.playersAllin === this.playerIDByPositionIndex.length) return this.startNewRound()
        // let smallestAllin = highestBetPlayer
        // logger.log(smallestAllin)
        // }
        // logger.log(smallestAllin)
        logger.log("putBetsIntoPot() 4")
        for (let i = 0; i<this.playerIDByPositionIndex.length;i++) {
            const player = this.players[this.playerIDByPositionIndex[i]]
            if (!player) continue
            if (player.stackSize.equals(0) && player.betSize.greaterThan(0)) playersAllinOnThisRound++
            if (player.betSize.equals(0)) continue
            if (player.betSize.greaterThanOrEqualTo(smallestAllin)) {
                this.currentHand.pots[lastPot] = this.currentHand.pots[lastPot].plus(smallestAllin)
                player.betSize = player.betSize.minus(smallestAllin)
            } else {
                this.currentHand.pots[lastPot] = this.currentHand.pots[lastPot].plus(player.betSize)
                player.betSize = player.betSize.minus(player.betSize)
            }
            if (!player.contestingPots.includes(lastPot)) player.contestingPots.push(lastPot)
            // player.actedSinceLastRaise = false;
        }
        logger.log("putBetsIntoPot() 5")
        // logger.log(playersAllinOnThisRound)
        if (playersAllinOnThisRound > 0) {
        // if (qtdHighestBet != this.playerIDByPositionIndex.length - this.currentHand.playersFolded - (this.currentHand.playersAllin - playersAllinOnThisRound)) {
            this.currentHand.pots.push(new Decimal(0))
            // logger.log(this.currentHand.pots)
            return this.putBetsIntoPot()
        }
        logger.log("putBetsIntoPot() 6")
        // logger.log(this.currentHand.pots)
    }
    startNewRound(timeout = 500) {
        logger.log("startNewRound()")
        this.putBetsIntoPot()
        if (this.currentHand.playersFolded === this.countPlayers() - 1) return this.evaluateHand()
        // for (let i = 0; i<this.currentHand.playersToRemoveThisRound.length; i++) {
        //     const index = this.currentHand.playersToRemoveThisRound[i]
        //     this.playerIDByPositionIndex.splice(index, 1)
        // }
        this.currentHand.boardRound++
        if (this.currentHand.boardRound === 1) this.currentHand.boardCards = [this.deck.getCard(), this.deck.getCard(), this.deck.getCard()]
        if (this.currentHand.boardRound === 2) this.currentHand.boardCards.push(this.deck.getCard())
        if (this.currentHand.boardRound === 3) this.currentHand.boardCards.push(this.deck.getCard())
        if (this.currentHand.boardRound === 4) return logger.log(this.evaluateHand())
        let sumOfPots = new Decimal(0)
        this.currentHand.pots.forEach((pot) => {
            sumOfPots = sumOfPots.add(pot)
        })
        this.currentHand.actionSequence.push({round: this.currentHand.boardRound, boardCards : JSON.stringify(this.currentHand.boardCards), potSize: sumOfPots})
        this.currentHand.minBet = new Decimal(this.bb)
        this.currentHand.biggestBet = new Decimal(0)
        logger.log(this.currentHand.actionSequence)
        // logger.log(this.currentHand)
        // exit()
        // let playersLeftWithChips = 0
        // for (let i = 0; i < this.playerIDByPositionIndex.length; i++) {
        //     if (playersLeftWithChips > 2) continue
        //     const player = this.players[this.playerIDByPositionIndex[i]]
        //     if (player.stackSize > 0) playersLeftWithChips ++
        // }
        // if (playersLeftWithChips < 2) return this.startNewRound()
        this.setAllPlayerActedSinceLastRaiseToFalse()
        this.broadcastHandState()
        this.currentHand.positionActing = this.currentHand.dealerPos //its going to the next player
        setTimeout(() => {this.prepareNextPlayerTurn()}, timeout)
    }
    async closeHand() {
        logger.log("closeHand()")
        await this.saveHandHistoryToDB()
        const tournament = this.tableManager.playerPoolManager.tournaments[this.tournamentID]
        this.tableManager.playerPoolManager.rankPlayers(this.tournamentID)
        this.waitingForPlayers = true;
        this.currentHand.handIsBeingPlayed = false;
        this.currentHand.pots = [new Decimal(0)];
        this.currentHand.actionSequence = [];
        this.currentHand.boardCards = [];
        this.currentHand.boardRound = 0;
        this.currentHand.minBet = new Decimal(0);
        this.currentHand.maxBet = new Decimal(9999999999);
        this.currentHand.biggestBet = new Decimal(0);
        this.currentHand.positionActing = -1;
        this.currentHand.playersAllin = 0;
        this.currentHand.playersFolded = 0;
        this.currentHand.handHistory = "";
        for (let i = 0; i<this.playerIDByPositionIndex.length; i++) {
            const player = this.players[this.playerIDByPositionIndex[i]]
            if (!player) continue
            if (player.stackSize.equals(0)) {
                this.tableManager.playerPoolManager.sendEmptyTable(player)
                this.removePlayer(player) //remove player if stack === 0
                continue
            }
            if (player.nextTableID && player.nextTableID!=this.id) {
                this.removePlayer(player) //remove player because he has been sent to another table
                this.tableManager.placePlayerIntoTable(player, player.nextTableID)
            }
            player.cards = []
            player.actedSinceLastRaise = false
            player.possibleActions = []
            player.hasFolded = true
            player.isButton = false
            player.contestingPots = [0]
            player.showCards = false
            player.isWinner = false
            player.finalHandRank = {rank: -1, combination: ""}
            player.lastAction = ""
            if (tournament) player.tournamentPosition = tournament.playersList.indexOf(player)+1
        } //now im resetting these info when the player sits in
        this.broadcastHandState()
        return this.startHandRoutine()
        logger.log("closeHand() 2")
        // this.tableManager.socketManager.socketsLeave(`table:${this.id}`)
        this.tableManager.deleteTable(this.poolID, this.id)
        logger.log("closeHand() 1")
        // this.broadcastHandState() //talvez nao precise fazer isso aqui
        for (let i = 0; i<this.playerIDByPositionIndex.length; i++) {
            logger.log("closeHand() loop index:" + i)
            const player = this.players[this.playerIDByPositionIndex[i]]
            if (!player) continue
            logger.log(this.id)
            logger.log(player.name)
            logger.log(player.tableID)
            logger.log(player.hasFolded)
            logger.log(player.isSitout)
            if(this.id != player.tableID) {
                logger.log("tableID is not matching, player is already in another table.")
                continue
            }
            if (player.isSitout && player.hasFolded) continue //player already reentered the pool
            // if (player.isSitout) this.sendEmptyTable(player)
            if (!player.hasFolded || player.isSitout) this.tableManager.playerPoolManager.reEnterPool(player) //if player folded, it had already reentered the pool

            // this.removePlayer(player)
        }
        // logger.log(this.tableManager)
        // logger.log(this.tableManager.tables[this.poolID][this.id])
        // logger.log(this.tables)
        // logger.log(this.poolID)
        // logger.log(this.id)
        
        // logger.log(this.tableManager.tables[this.poolID][this.id])

    }

    removePlayer(player) {
        logger.log("removePlayer()")
        if (!player) return
        logger.log(player.name)
        // if (!player.tableClosed) this.tableManager.playerPoolManager.sendEmptyTable(player)
        player.tableID = undefined
        const playerIndex = this.playerIDByPositionIndex.indexOf(player.id)
        logger.log("playerIndex " + playerIndex)
        const playerKey = this.playerIDByPositionIndex[playerIndex]
        logger.log("playerKey " + playerKey)
        const playerSocket = this.socketsByUserID[player.userID]
        if (playerSocket) playerSocket.leave(`table:${this.id}`)
        delete this.players[playerKey]
        delete this.socketsByUserID[player.userID]
        this.playerIDByPositionIndex[playerIndex] = null
        this.broadcastHandState()
        if (!this.currentHand.handIsBeingPlayed) this.startHandRoutine()
    }
    startNewHand() {
        logger.log("startNewHand()")
        logger.log(this.id)
        if (this.currentHand.handIsBeingPlayed) return logger.log("hand is already being played, something went wrong.")
        if (this.currentHand.dealerPos === -1) {
            const randomStart = Math.floor(Math.random() * this.countPlayers())
            this.currentHand.dealerPos = this.findNextPlayer(randomStart)
        } else {
            this.currentHand.dealerPos = this.findNextPlayer(this.currentHand.dealerPos)
        }
        const tournament = this.tableManager.playerPoolManager.tournaments[this.tournamentID]
        if (!tournament) return logger.log("tournament is undefined, something went wrong.")
        this.sb = new Decimal(tournament.sb);
        this.bb = new Decimal(tournament.bb);
        this.ante = new Decimal(tournament.ante) || new Decimal(0);
        this.currentHand.sb = new Decimal(tournament.sb);
        this.currentHand.bb = new Decimal(tournament.bb);
        this.currentHand.ante = new Decimal(tournament.ante) || new Decimal(0);
        this.waitingForPlayers = false;
        this.currentHand.handIsBeingPlayed = true;
        this.currentHand.isShowdown = false;
        this.currentHand.pots = [new Decimal(0)];
        this.currentHand.actionSequence = [];
        this.currentHand.boardCards = [];
        this.currentHand.boardRound = 0;
        this.currentHand.minBet = new Decimal(0);
        this.currentHand.maxBet = new Decimal(9999999999);
        this.currentHand.biggestBet = new Decimal(0);
        this.currentHand.positionActing = -1;
        this.currentHand.playersAllin = 0;
        this.currentHand.playersFolded = 0;
        this.currentHand.handHistory = `OriginalPoker ${this.title} ${this.tableSize}-max ${this.sb}/${this.bb} Button:${this.currentHand.dealerPos} - ${new Date().toUTCString()}\n`
        this.deck = new Deck()
        for (let i = 0; i<this.playerIDByPositionIndex.length; i++) {
            const player = this.players[this.playerIDByPositionIndex[i]]
            if (!player) continue
            // if (player.stackSize === 0 || player.isSitout) {
            //     const socket = this.socketsByPlayerID[player.socketID]
            //     if (socket) this.tableManager.playerPoolManager.reEnterPool(player) //create a copy of player
            //     const playerKey = this.playerIDByPositionIndex.splice(i, 1)
            //     delete this.players[playerKey]
            //     i--
            // }
            player.cards = [this.deck.getCard(), this.deck.getCard()]
            player.actedSinceLastRaise = false
            player.possibleActions = []
            player.hasFolded = false
            player.askedToFold = false
            player.isButton = false
            player.contestingPots = [0]
            this.currentHand.handHistory += `Seat ${i+1}: ${player.name} ($${player.stackSize}) - cards:${JSON.stringify(player.cards).replaceAll("\"", "")}\n`
        }
        if (this.countPlayers() < 2) {
            this.waitingForPlayers = true;
            this.currentHand.handIsBeingPlayed = false;
            return logger.log("exiting because we have less than 2 players")
        }
        this.determinePlayerPositions()
    }
    async saveHandHistoryToDB() {
        logger.log("saveHandHistoryToDB()")
        // let playerIndex = 1
        // Object.values(this.players).forEach(player => {
        //     if (!player) return
        //     this.currentHand.handHistory += `Seat ${playerIndex}: ${player.name} ($${player.stackSize}) - cards:${player.cards}\n`
        //     playerIndex++
        // })
        this.currentHand.actionSequence.forEach(action => {
            logger.log(action)
            if (action.round) {
                this.currentHand.handHistory += `\n${roundStr[action.round]}: ${action.boardCards.replaceAll("\"", "")} Pot: ${action.potSize}\n`
            }
            else if (action.playerName) {
                if (action.amount.equals(0)) this.currentHand.handHistory += `${action.playerName}: ${action.type}\n`
                if (action.amount.greaterThan(0)) this.currentHand.handHistory += `${action.playerName}: ${action.type} ${action.amount}\n`   
            }
            else if (action.pot != undefined) {
                if (action.winners.length > 1) this.currentHand.handHistory += `\nPot ${action.pot} - Amount: ${action.potSize} Winners: ${action.winners}\n`
                if (action.winners.length === 1) this.currentHand.handHistory += `\nPot ${action.pot} - Amount: ${action.potSize} Winner: ${action.winners}\n`
            }
        })
        const { rows } = await this.tableManager.fastify.pg.query(`INSERT INTO hands(handHistory) VALUES ('${this.currentHand.handHistory}') RETURNING handid, created_on`);
        const handID = rows[0].handid
        const created_on = rows[0].created_on
        let insertQuery = ""
        logger.log("updating player hand history arrays and saving on DB")
        for (let i = 0; i < this.playerIDByPositionIndex.length; i++) {
            if (this.playerIDByPositionIndex[i] === null) continue
            const player = this.players[this.playerIDByPositionIndex[i]]
            // const player = this.tableManager.playerPoolManager.tournaments[this.tournamentID].players[this.playerIDByPositionIndex[i]]
            if (!player) logger.log("player not found")
            if (!player) continue
            insertQuery += `INSERT INTO handsByUser(userid, handid, created_on) VALUES (${player.userID}, ${handID}, '${new Date(created_on).toISOString()}');`
            logger.log(`sending hand history to ${player.name}`)
            const socket = this.tableManager.playerPoolManager.socketsByUserID[player.userID]
            if (!socket) {
                logger.log("socket is undefined")
                continue
            }
            if (socket) socket.emit("updateHandHistory", {player: player, handHistory: this.currentHand.handHistory})
        }
        this.tableManager.fastify.pg.query(insertQuery);

        // this.tableManager.fastify.pg.connect().then(async (client) => {
        //     logger.log("saving hand history")
        //     try {
        //         const result = await client.query(`INSERT INTO hands(handHistory) VALUES ('${this.currentHand.handHistory}')`);
        //         logger.log(result)
        //     } catch (error) {
        //         logger.log(error)
                
        //     }
        //     client.release();
        // });
    }
    determinePlayerPositions(){
        logger.log("determinePlayerPositions()")
        //bb, sb, button, etc
        //set initial playerTurn
        // const randomStart = Math.floor(Math.random() * this.countPlayers()) //changed to startNewHand
        // logger.log(randomStart) //changed to startNewHand
        // this.currentHand.dealerPos = this.findNextPlayer(randomStart) //changed to startNewHand
        // logger.log(this.currentHand.dealerPos) //changed to startNewHand


        // if (this.currentHand.dealerPos >= this.playerIDByPositionIndex.length) this.currentHand.dealerPos -= this.playerIDByPositionIndex.length
        const dealerPlayer = this.players[this.playerIDByPositionIndex[this.currentHand.dealerPos]]
        logger.log(this.playerIDByPositionIndex)
        logger.log(dealerPlayer)
        dealerPlayer.isButton = true;
        this.currentHand.sbPos = this.findNextPlayer(this.currentHand.dealerPos)
        if (this.countPlayers() === 2) this.currentHand.sbPos = this.currentHand.dealerPos
        // if (this.currentHand.sbPos >= this.playerIDByPositionIndex.length) this.currentHand.sbPos -= this.playerIDByPositionIndex.length
        this.currentHand.bbPos = this.findNextPlayer(this.currentHand.sbPos)
        // if (this.currentHand.bbPos >= this.playerIDByPositionIndex.length) this.currentHand.bbPos -= this.playerIDByPositionIndex.length
        const sbPlayer = this.players[this.playerIDByPositionIndex[this.currentHand.sbPos]]
        const bbPlayer = this.players[this.playerIDByPositionIndex[this.currentHand.bbPos]]
        sbPlayer.betSize = new Decimal(this.sb)
        bbPlayer.betSize = new Decimal(this.bb)
        if (sbPlayer.stackSize.lessThan(this.sb)) sbPlayer.betSize = sbPlayer.stackSize
        if (bbPlayer.stackSize.lessThan(this.bb)) bbPlayer.betSize = bbPlayer.stackSize
        sbPlayer.stackSize = sbPlayer.stackSize.minus(sbPlayer.betSize)
        bbPlayer.stackSize = bbPlayer.stackSize.minus(bbPlayer.betSize)
        this.currentHand.actionSequence.push({playerName: sbPlayer.name, type: "sb", amount: sbPlayer.betSize})
        this.currentHand.actionSequence.push({playerName: bbPlayer.name, type: "bb", amount: bbPlayer.betSize})
        this.currentHand.positionActing = this.currentHand.bbPos
        this.currentHand.biggestBet = new Decimal(this.bb)
        this.currentHand.minBet = new Decimal(this.bb * 2)
        this.prepareNextPlayerTurn()
        // const nextPlayer = this.players[this.playerIDByPositionIndex[this.currentHand.positionActing]]
        // nextPlayer.possibleActions = [{type: "fold", amount: 0}, {type: "call", amount: this.bb}, {type: "raise", amount: this.bb*2}]
    }
}
module.exports = Table
// table = new Table()
// table.startNewHand()
// logger.log(table.evaluateHand())