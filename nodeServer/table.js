const { rankHands } = require('@xpressit/winning-poker-hand-rank');
const { v4: uuidv4 } = require('uuid');
const Decimal = require('decimal.js');

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
        // console.log(this.cards)
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
    constructor(TableManager, pool, poolID) {
        this.tableManager = TableManager;
        this.id = uuidv4();
        this.title = pool.title || "Table X";
        this.betType = pool.betType || "NL";
        this.gameType = pool.gameType || "cash";
        this.pokerVariant = pool.pokerVariant || "texas";
        this.tableSize = pool.tableSize || 6;
        this.sb = new Decimal(pool.sb);
        this.bb = new Decimal(pool.bb);
        this.ante = pool.ante || new Decimal(0);
        this.poolID = poolID || "";
        this.timeBank = 20000
        this.timeLimitCounter = undefined
        this.socketManager = TableManager.socketManager;
        this.playerIDByPositionIndex = new Array(this.tableSize).fill(null);
        this.players = {};
        this.sockets = {};
        this.waitingForPlayers = true;
        this.startHandTimer = undefined
        this.currentHand = {
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
            sbPos: 0,
            bbPos: 0,
            handHistory: "",
        }
    }

    sitPlayer(player) {
        console.log(`sitPlayer(player)`)
        console.log(player.name)
        // if (this.playerIDByPositionIndex.length === 0) player.stackSize = 50 //so pra testar a criacao dos pots
        if (!this.tableManager.playerPoolManager.sockets[player.socketID]) {
            console.log("socket nao encontrado")
            console.log(player.socketID)
            console.log(Object.keys(this.tableManager.playerPoolManager.sockets))
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
            console.log("failed to find a seat")
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
        this.sockets[player.socketID] = this.tableManager.playerPoolManager.sockets[player.socketID];
        this.sendHandTrasition(player)
        this.sockets[player.socketID].join(`table:${this.id}`);
        // console.log(this.players)
        // console.log(this.playerIDByPositionIndex)
        // console.log(this.sockets)
        this.startHandRoutine()
        
        if (!this.currentHand.handIsBeingPlayed) this.broadcastHandState()
        // this.socketManager.to(`table:${this.id}`).emit("updateGameState", this.currentHand);
        
    }
    startHandRoutine(){
        console.log("startHandRoutine()")
        clearTimeout(this.startHandTimer)
        const countPlayers = this.countPlayers()
        console.log("countPlayers " + countPlayers)
        if (countPlayers === 0) return this.tableManager.deleteTable(this.poolID, this.id)
        if (countPlayers < this.tableSize) this.waitingForPlayers = true
        if (countPlayers === this.tableSize) {
            this.waitingForPlayers = false
            // clearTimeout(this.startHandTimer)
            this.startHandTimer = setTimeout(() => this.startNewHand(), 500)
            // this.startNewHand()
        } else if (countPlayers >= 2) {
            // clearTimeout(this.startHandTimer)
            this.startHandTimer = setTimeout(() => this.startNewHand(), 5000)
        }
    }
    sendHandTrasition(player) {
        console.log(`sendHandTrasition()`)
        //send hand transition when player folds or the hand is over
        if (player.socketID in this.sockets && this.sockets[player.socketID]) this.sockets[player.socketID].emit("handTransition", player)
    }
    broadCastIndividualPlayerInfo(playerID = undefined) {
        console.log(`broadCastIndividualPlayerInfo()`)
        //send cardback to all players except the player holding its cards
        if (playerID) {
            const player = this.players[playerID]
            if (!player) return console.log("player is undefined")
            if (player.askedToFold) return console.log("player asked to fold")
            // if (!player.tableID) continue
            // if (player.hasFolded) continue
            console.log(`id: ${player.id}, name: ${player.name}, stack: ${player.stackSize}, cards: ${player.cards}, tableID: ${player.tableID}`)//this gave an error recently,
            if (this.currentHand.boardCards.length>=3 && !player.hasFolded && !player.askedToFold && player.cards.length>0) player.finalHandRank = rankHands(this.pokerVariant, this.currentHand.boardCards, [player.cards])[0]
            // trying to verify what it is sending to see if can filter to avoid sending too much information
            if (player.socketID in this.sockets && this.sockets[player.socketID]) this.sockets[player.socketID].emit("updatePlayerInfo", player)
            return
        }
        for (let i = 0; i < this.playerIDByPositionIndex.length; i++) {
            const playerID = this.playerIDByPositionIndex[i]
            const player = this.players[playerID]
            if (!player) continue
            if (player.askedToFold) continue
            // if (!player.tableID) continue
            // if (player.hasFolded) continue
            console.log(`id: ${player.id}, name: ${player.name}, stack: ${player.stackSize}, cards: ${player.cards}, tableID: ${player.tableID}`)//this gave an error recently,
            if (this.currentHand.boardCards.length>=3 && !player.hasFolded && !player.askedToFold && player.cards.length>0) player.finalHandRank = rankHands(this.pokerVariant, this.currentHand.boardCards, [player.cards])[0]
            // trying to verify what it is sending to see if can filter to avoid sending too much information
            if (player.socketID in this.sockets && this.sockets[player.socketID]) this.sockets[player.socketID].emit("updatePlayerInfo", player)
        }
    }
    broadcastHandState(playerID = undefined) {
        console.log("broadcasting handState for table: " + this.id)
        let handState = JSON.parse(JSON.stringify(this.currentHand)) // copies the current hand
        handState.players = {}
        delete handState.handHistory
        for (let i = 0; i < this.playerIDByPositionIndex.length; i++) {
            console.log("entrou no player " + this.playerIDByPositionIndex[i])
            const playerID = this.playerIDByPositionIndex[i]
            const player = this.players[playerID]
            if (!player) continue
            handState.players[playerID] = {
                id : player.id,
                name: player.name,
                avatar: player.avatar,
                tableID: player.tableID,
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

            // console.log(this.sockets[player.socketID])
            // this.sockets[player.socketID].emit("updateGameState", handState)
        }
        // console.log("asd")
        console.log(handState)

        if (!playerID) {
            this.socketManager.to(`table:${this.id}`).emit("updateGameState", handState);
            this.broadCastIndividualPlayerInfo()
        }
        if (playerID) {
            player = this.players[playerID]
            if (player) {
                if (player.askedToFold) return false
                const socket = this.tableManager.socketManager.sockets[player.socketID]
                if (!socket) return false
                this.sockets[player.socketID] = socket
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
        console.log("sendEmptyTable")
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
        const socket = this.sockets[player.socketID]
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
            console.log(index)
            if (!this.playerIDByPositionIndex[index]) continue
            console.log("returning: " + index)
            console.log("playerID: " + this.playerIDByPositionIndex[index])
            return index
            if (i === this.countPlayers()) i - this.countPlayers()
            if (!this.playerIDByPositionIndex[i]) continue
            return i
        } 
    }
    validateAction(playerFromClient, action) {
        console.log(`validateAction(playerFromClient, action)`)
        console.log(playerFromClient.name)
        console.log(action)
        console.log(this.id)
        if (!action) return console.log("action is undefined")
        if (!action.type) return console.log("action.type is undefined")
        if (typeof(action.amount) != "number") return console.log("action.amount is not a number")
        action.amount = parseFloat(action.amount.toString().replaceAll(",", "."))
        action.amount = new Decimal(action.amount)
        if (action.amount.isNaN()) return console.log("action not allowed")
        
        //validate if player can make that action
        //update gamestate and broadcast or reply invalid
        // console.log(this.currentHand.actionSequence)
        // console.log(action)
        // console.log(player.possibleActions)
        console.log("validateAction 1")
        const playerSocket = this.sockets[playerFromClient.socketID]
        let player = this.players[playerFromClient.id]
        if (!player) return console.log("player undefined, something went wrong!")
        if (!playerSocket) return console.log("player socket undefined, something went wrong!")
        if (playerFromClient.tableID != this.id) return console.log("playerFromClient.tableID is not from this table, something went wrong!")
        if (player.tableID != this.id) return console.log("player.tableID is not from this table, something went wrong!")
        // player.isSitout = playerFromClient.isSitout
        // console.log(player)
        //treat fast fold
        if (player.possibleActions.length === 1) {
            console.log("⚡Fold")
            if (player.possibleActions[0].type === action.type && action.type === "⚡Fold") {
                console.log("player fast folded")
                player.askedToFold = true;
                playerSocket.leave(`table:${this.id}`);
                // if (player.socketID in this.sockets) {
                //     console.log("player fast folded with socket")
                //     // this.sendEmptyTable(player)//send empty table
                //     // delete this.sockets[player.socketID]
                // }
                const playerCopy = JSON.parse(JSON.stringify(player))
                playerCopy.stackSize = new Decimal(playerCopy.stackSize)
                playerCopy.betSize = new Decimal(playerCopy.betSize)
                this.tableManager.playerPoolManager.reEnterPool(playerCopy)
                return console.log("player fast folded final")
            }
        } 
        //
        if (!this.currentHand.handIsBeingPlayed) return console.log("hand is over")
        const currentPlayer = this.players[this.playerIDByPositionIndex[this.currentHand.positionActing]]
        if (currentPlayer.id != player.id) return console.log("wrong player")
        if (player.askedToFold && player.hasFolded) return console.log("player already asked to fold")
        if (player.hasFolded) return console.log("player has already folded, something went wrong")
        console.log("validateAction 2")
        // if (player.isSitout) return "player is sitout"
        // console.log(player.possibleActions.includes(action))
        // console.log(player.possibleActions[1] === action)
        // console.log(action.type != "raise")
        let actionAllowed = false;
        if (player.possibleActions.length === 0) console.log("possibleActions is empty")
        console.log(player.possibleActions)
        for (let i = 0; i<player.possibleActions.length; i++) {
            if (actionAllowed) continue
            const actionAtIndex = player.possibleActions[i]
            if (action.type === actionAtIndex.type) {
                console.log(`(${action.type} === "raise" || ${action.type} === "bet") && ${action.amount} >= ${actionAtIndex.amount} : ${(action.type === "raise" || action.type === "bet") && action.amount.greaterThanOrEqualTo(actionAtIndex.amount)}`)
                // if (action.amount.greaterThanOrEqualTo(actionAtIndex.amount))
                if ((action.type === "call" || action.type === "fold" || action.type === "check") && action.amount.equals(actionAtIndex.amount)) actionAllowed = true;
                if ((action.type === "raise" || action.type === "bet") && action.amount.lessThan(this.currentHand.minBet)) return this.validateAction(player, {type: "raise", amount: this.currentHand.minBet.toNumber()});
                if ((action.type === "raise" || action.type === "bet") && action.amount.greaterThanOrEqualTo(this.currentHand.minBet)) actionAllowed = true;
            }
        }
        console.log("validateAction 3")
        console.log(`actionAllowed: ${actionAllowed}`)
        if (!actionAllowed) return console.log("action not allowed")
        clearTimeout(this.timeLimitCounter) //validou a acao
        player.lastAction = action.type
        console.log("validateAction 4")
        // if (action.amount < this.currentHand.biggestBet && action.amount < player.stackSize) return "amount is not allowed"
        //action valid
        // console.log(`${action.amount} > ${player.stackSize} + ${player.betSize}: ${action.amount > player.stackSize + player.betSize}`)
        if (action.amount.greaterThan(player.stackSize.plus(player.betSize))) action.amount = player.stackSize.plus(player.betSize)
        if (action.type === "fold") {
            console.log("player folded")
            player.hasFolded = true;
            player.tableID = undefined
            console.log(`player.isSitout: ${player.isSitout}`)
            // player.cards = [];
            this.currentHand.playersFolded++
            playerSocket.leave(`table:${this.id}`);
            if (player.socketID in this.sockets) delete this.sockets[player.socketID]
            if (!player.askedToFold) {
                console.log(player.name + " reentering pool when not fast folded")
                const playerCopy = JSON.parse(JSON.stringify(player))
                playerCopy.stackSize = new Decimal(playerCopy.stackSize)
                playerCopy.betSize = new Decimal(playerCopy.betSize)
                this.tableManager.playerPoolManager.reEnterPool(playerCopy)
            }
            // const playerCopy = JSON.parse(JSON.stringify(player))
            // this.players[player.id] = playerCopy
            // if (!player.askedToFold) this.tableManager.playerPoolManager.reEnterPool(player)
            // player = playerCopy
            // player.stackSize = new Decimal(player.stackSize)
            // player.betSize = new Decimal(player.betSize)
        }
        console.log("validateAction 5")
        if (action.type === "check" && this.currentHand.biggestBet.greaterThan(player.betSize)) return this.validateAction(player, player.possibleActions[0])
        console.log("validateAction 6")
        if (action.type === "raise" || action.type === "bet") {
            if (action.amount.lessThan(this.currentHand.minBet) && this.currentHand.minBet.lessThan(player.stackSize)) action.amount = this.currentHand.minBet
            if (action.amount.lessThan(this.currentHand.minBet) && this.currentHand.minBet.greaterThan(player.stackSize.plus(player.betSize))) action.amount = player.stackSize.plus(player.betSize)
            if (action.amount.lessThanOrEqualTo(this.currentHand.biggestBet)) return this.validateAction(player, player.possibleActions[1])
            const secondBiggestBet = this.currentHand.biggestBet
            this.currentHand.biggestBet = action.amount
            this.currentHand.minBet = this.currentHand.biggestBet.plus(this.currentHand.biggestBet).minus(secondBiggestBet)
            this.setAllPlayerActedSinceLastRaiseToFalse()
        }
        console.log("validateAction 7")
        if (action.type != "fold" && action.type != "check")  {
            player.stackSize = player.stackSize.minus(action.amount.minus(player.betSize))
            player.betSize = action.amount
        }
        if (action.amount.greaterThanOrEqualTo(player.stackSize.plus(player.betSize))) this.currentHand.playersAllin++
        action.playerName = player.name
        this.currentHand.actionSequence.push(action)
        player.actedSinceLastRaise = true;
        player.possibleActions = []
        console.log("validateAction 8")
        this.prepareNextPlayerTurn()
        if (playerSocket) playerSocket.emit("actionResponse", {message: `action : {action.type:${action.type}, action.amount:${action.amount}} accepted`, status:200})
    }
    evaluateHand() {
        console.log("evaluateHand()")
        
        // const board = [this.deck[0], this.deck[1], this.deck[2], this.deck[3], this.deck[4]]
        for (let potIndex = 0; potIndex < this.currentHand.pots.length; potIndex ++) {
            let winnerRank = 999999
            let winners = []
            let winnerNames = []
            let playersContestingThisPot = 0
            for (let i = 0; i < this.playerIDByPositionIndex.length; i++) {
                const player = this.players[this.playerIDByPositionIndex[i]]
                if (!player) continue
                if (player.hasFolded || !player.contestingPots.includes(potIndex)) continue
                playersContestingThisPot++
                // player.finalHandRank = {rank: -1}
                // console.log(this.currentHand.boardCards, [player.cards])
                if (this.currentHand.boardCards.length > 0 && player.finalHandRank.rank === -1) player.finalHandRank = rankHands(this.pokerVariant, this.currentHand.boardCards, [player.cards])[0]
                if (player.finalHandRank.rank < winnerRank) {
                    winnerRank = player.finalHandRank.rank
                    winners = []
                }
                if (player.finalHandRank.rank === winnerRank) winners.push(player)
                // player.finalHandRank = rankHands(gameType, board, player.cards)
            }
            for (let i = 0; i< winners.length; i++){
                // console.log(winners)
                // console.log(this.currentHand.pots)
                // console.log(potIndex)
                winners[i].stackSize = winners[i].stackSize.plus(this.currentHand.pots[potIndex].dividedBy(winners.length))
                if (playersContestingThisPot > 1) winners[i].showCards = true
                winners[i].isWinner = true
                winnerNames.push(JSON.stringify(winners[i].name).replaceAll("\"", ""))
            }
            if (winners.length > 0) this.currentHand.actionSequence.push({pot: potIndex, potSize: this.currentHand.pots[potIndex], winners: winnerNames})
            this.currentHand.pots[potIndex] = new Decimal(0)
        }
        // const playerCards1 = [this.deck[5], this.deck[6]]
        // const playerCards2 = [this.deck[7], this.deck[8]]
        // const playerCards3 = [this.deck[9], this.deck[10]]
        // const result = rankHands(gameType, board, [playerCards1, playerCards2, playerCards3])
        // console.log(playerCards1, playerCards2, playerCards3, board)
        this.currentHand.handIsBeingPlayed = false;
        this.currentHand.isShowdown = true;
        // console.log(this.currentHand.players)
        console.log("evaluateHand() 1")
        this.broadcastHandState()
        // setTimeout(() => {this.startNewHand()}, 5000)
        console.log("evaluateHand() 2")
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
        console.log("prepareNextPlayerTurn()")
        if (!this.currentHand.handIsBeingPlayed) return console.log("hand is over")
        
        if (this.currentHand.playersFolded === this.countPlayers() - 1) {
            this.currentHand.positionActing = -1 //sending this only for showing the moment when the player acts before showing the new round
            this.broadcastHandState() //sending this only for showing the moment when the player acts before showing the new round
            return setTimeout(() => {this.startNewRound()}, 500)
        }
        let playersLeftWithChips = 0
        if (this.currentHand.playersFolded + this.currentHand.playersAllin === this.countPlayers()) return this.startNewRoundAtShowdown()
        console.log("prepareNextPlayerTurn() 1")
        this.currentHand.positionActing = this.findNextPlayer(this.currentHand.positionActing)
        // this.currentHand.positionActing++
        // if (this.currentHand.positionActing > this.playerIDByPositionIndex.length - 1) this.currentHand.positionActing -= this.playerIDByPositionIndex.length
        // console.log(this.currentHand.positionActing)
        // console.log(this.playerIDByPositionIndex.length)
        const nextPlayer = this.players[this.playerIDByPositionIndex[this.currentHand.positionActing]]
        nextPlayer.stackSize = new Decimal(nextPlayer.stackSize)
        nextPlayer.betSize = new Decimal(nextPlayer.betSize)
        // console.log(nextPlayer)
        //check to see if the players left are already allin
        for (let i = 0; i < this.playerIDByPositionIndex.length; i++) {
            // if (playersLeftWithChips > 2) continue
            const player = this.players[this.playerIDByPositionIndex[i]]
            if (!player) continue
            player.stackSize = new Decimal(player.stackSize)
            player.betSize = new Decimal(player.betSize)
            if (!player.hasFolded && nextPlayer.betSize.lessThan(player.stackSize.plus(player.betSize))) playersLeftWithChips++ //old way
            if (player.betSize.lessThan(this.currentHand.biggestBet) && !player.stackSize.equals(0) && !player.hasFolded && !player.askedToFold) player.possibleActions = [{type: "⚡Fold", amount: 0}] //activate fastfold for everyone that needs to call a bet
            // if (!player.hasFolded && player.stackSize.greaterThan(0)) playersLeftWithChips++ //teste (NAO FUNCIONOU DIREITO, QUANDO O JOGADOR VAI ALLIN ELE FICA COM STACK 0, DAI BUGA)
        }
        if (playersLeftWithChips < 2) return this.startNewRoundAtShowdown()

        if (nextPlayer.actedSinceLastRaise && this.currentHand.boardRound != 4) {
            this.currentHand.positionActing = -1 //sending this only for showing the moment when the player acts before showing the new round
            this.broadcastHandState() //sending this only for showing the moment when the player acts before showing the new round
            return setTimeout(() => {this.startNewRound()}, 500)
        }
        console.log("prepareNextPlayerTurn() 2")
        // if (nextPlayer.stackSize === 0) {
        //     nextPlayer.actedSinceLastRaise = true
        //     return this.prepareNextPlayerTurn()
        // } 
        if (nextPlayer.hasFolded || nextPlayer.stackSize.equals(0)) return this.prepareNextPlayerTurn()
         
        console.log("prepareNextPlayerTurn() 3")
        if (this.currentHand.minBet.lessThanOrEqualTo(this.bb)) this.currentHand.minBet = new Decimal(this.bb)
        nextPlayer.possibleActions = [{type: "fold", amount: 0}]
        if (this.currentHand.biggestBet.equals(nextPlayer.betSize)) nextPlayer.possibleActions.push({type: "check", amount: 0})
        console.log("prepareNextPlayerTurn() 4")
        console.log("nextPlayer: " + nextPlayer.name)
        // if (nextPlayer.isSitout) return this.validateAction(nextPlayer, nextPlayer.possibleActions[nextPlayer.possibleActions.length -1])
        if (!this.currentHand.biggestBet.equals(nextPlayer.betSize)) nextPlayer.possibleActions.push({type: "call", amount: this.currentHand.biggestBet.toNumber()})
        if (this.currentHand.biggestBet.equals(0)) nextPlayer.possibleActions.push({type: "bet", amount: this.bb})
        if (this.currentHand.biggestBet.greaterThan(0)) nextPlayer.possibleActions.push({type: "raise", amount: this.currentHand.minBet.toNumber()}) 
        console.log("prepareNextPlayerTurn() 5")
        if (nextPlayer.askedToFold) {
            console.log("folding player that has ⚡Fold")
            return this.validateAction(nextPlayer, nextPlayer.possibleActions[0])
        }
        this.currentHand.timeLimitToAct = new Date().getTime() + this.timeBank //timestamp + 20sec
        clearTimeout(this.timeLimitCounter)
        console.log("setting timeout for player " + nextPlayer.name + " at table " + this.id)
        this.timeLimitCounter = setTimeout(()=> {
            console.log("time is over, folding player")
            console.log(this.id)
            console.log(nextPlayer.name)
            console.log(nextPlayer.tableID)
            console.log(nextPlayer.possibleActions)
            if (!nextPlayer) {
                console.log("exiting application because player doesnt exist")
                return process.exit()
            }
            nextPlayer.isSitout = true;
            if (this.id != nextPlayer.tableID) {
                console.log("exiting application because tableID from player is not matching with this tableID")
                return process.exit()
            }
            // if (nextPlayer.possibleActions.length === 0) return console.log("nextPlayer.possibleActions.length === 0")//server protection case for when something went wrong.
            if (nextPlayer.possibleActions.length === 0) {
                console.log("exiting application because its trying to fold a player that has no actions.")
                return process.exit() //server protection case for when something went wrong.
            }
            let timeoutAction = nextPlayer.possibleActions[0]
            if (nextPlayer.possibleActions[1].type === "check") timeoutAction = nextPlayer.possibleActions[1]
            //send sitout
            // const socket = this.sockets[nextPlayer.socketID]
            // if (socket) socket.emit("sitoutUpdate", {playerID: nextPlayer.id, isSitout: true})
            //
            this.validateAction(nextPlayer, timeoutAction)
            console.log("time is over, folding player 2")
        }, this.currentHand.timeLimitToAct - new Date().getTime())
        
        console.log("prepareNextPlayerTurn() 5")
        this.broadcastHandState()
    }

    setAllPlayerActedSinceLastRaiseToFalse() {
        console.log("setAllPlayerActedSinceLastRaiseToFalse()")
        for (let i = 0; i<this.playerIDByPositionIndex.length;i++) {
            const player = this.players[this.playerIDByPositionIndex[i]]
            if (!player) continue
            player.actedSinceLastRaise = false;
        }
    }
    putBetsIntoPot() {
        console.log("putBetsIntoPot()")
        let highestBet = new Decimal(0)
        let highestBetPlayer
        let secondHighestBet = new Decimal(0)
        let qtdHighestBet = 0
        let smallestAllin = new Decimal(99999)
        let playersAllinOnThisRound = 0
        const lastPot = this.currentHand.pots.length - 1
        console.log("putBetsIntoPot() 1")
        for (let i = 0; i<this.playerIDByPositionIndex.length;i++) {
            console.log("putBetsIntoPot() 2")
            const player = this.players[this.playerIDByPositionIndex[i]]
            // console.log(smallestAllin)
            if (!player) continue
            player.stackSize = new Decimal(player.stackSize) //player here may be copied when he folds and the value doesnt come as Decimal
            player.betSize = new Decimal(player.betSize) //player here may be copied when he folds and the value doesnt come as Decimal
            player.lastAction = ""; //reset the lastAction
            if (player.stackSize.equals(0) && player.betSize.greaterThan(0)) {
                if (player.betSize.lessThanOrEqualTo(smallestAllin)) smallestAllin = player.betSize
            }
            // console.log(smallestAllin)
            // console.log(highestBet)
            // console.log(secondHighestBet)
            if (player.betSize.greaterThan(highestBet)) {
                secondHighestBet = highestBet
                highestBet = player.betSize
                highestBetPlayer = player
                qtdHighestBet = 0
            } else if (player.betSize.greaterThan(secondHighestBet)) {
                secondHighestBet = player.betSize
            }
            // console.log(highestBet)
            // console.log(secondHighestBet)
            if (player.betSize.equals(highestBet)) qtdHighestBet++
        }
        // console.log(qtdHighestBet)
        // if (lastPot > 6) process.exit()
        console.log("putBetsIntoPot() 3")
        // console.log(smallestAllin)
        // console.log(highestBet)
        // console.log(secondHighestBet)
        // console.log(qtdHighestBet)
        if (qtdHighestBet === 1) {
            highestBetPlayer.stackSize = highestBetPlayer.stackSize.plus(highestBetPlayer.betSize.minus(secondHighestBet))
            highestBetPlayer.betSize = secondHighestBet
            // console.log(this.currentHand.pots)
            // process.exit(1)
            return this.putBetsIntoPot()
        }
        // if (this.currentHand.playersFolded + this.currentHand.playersAllin === this.playerIDByPositionIndex.length) return this.startNewRound()
        // let smallestAllin = highestBetPlayer
        // console.log(smallestAllin)
        // }
        // console.log(smallestAllin)
        console.log("putBetsIntoPot() 4")
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
        console.log("putBetsIntoPot() 5")
        // console.log(playersAllinOnThisRound)
        if (playersAllinOnThisRound > 0) {
        // if (qtdHighestBet != this.playerIDByPositionIndex.length - this.currentHand.playersFolded - (this.currentHand.playersAllin - playersAllinOnThisRound)) {
            this.currentHand.pots.push(new Decimal(0))
            // console.log(this.currentHand.pots)
            return this.putBetsIntoPot()
        }
        console.log("putBetsIntoPot() 6")
        // console.log(this.currentHand.pots)
    }
    startNewRound(timeout = 500) {
        console.log("startNewRound()")
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
        if (this.currentHand.boardRound === 4) return console.log(this.evaluateHand())
        let sumOfPots = new Decimal(0)
        this.currentHand.pots.forEach((pot) => {
            sumOfPots = sumOfPots.add(pot)
        })
        this.currentHand.actionSequence.push({round: this.currentHand.boardRound, boardCards : JSON.stringify(this.currentHand.boardCards), potSize: sumOfPots})
        this.currentHand.minBet = new Decimal(this.bb)
        this.currentHand.biggestBet = new Decimal(0)
        console.log(this.currentHand.actionSequence)
        // console.log(this.currentHand)
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
    closeHand() {
        console.log("closeHand()")
        this.saveHandHistoryToDB()
        // this.currentHand.handIsBeingPlayed = false;
        // this.currentHand.pots = [0];
        // this.currentHand.actionSequence = [];
        // this.currentHand.boardCards = [];
        // this.currentHand.boardRound = 0;
        // this.currentHand.minBet = 0;
        // this.currentHand.maxBet = 9999999999;
        // this.currentHand.biggestBet = 0;
        // this.currentHand.positionActing = 0;
        // this.currentHand.playersAllin = 0;
        // this.currentHand.playersFolded = 0;
        // for (let i = 0; i<this.playerIDByPositionIndex.length; i++) {
        //     const player = this.players[this.playerIDByPositionIndex[i]]
        //     player.cards = []
        //     player.actedSinceLastRaise = false
        //     player.possibleActions = []
        //     player.hasFolded = false
        //     player.isButton = false
        //     player.contestingPots = [0]
        // } now im resetting these info when the player sits in
        console.log("closeHand() 2")
        // this.tableManager.socketManager.socketsLeave(`table:${this.id}`)
        this.tableManager.deleteTable(this.poolID, this.id)
        console.log("closeHand() 1")
        // this.broadcastHandState() //talvez nao precise fazer isso aqui
        for (let i = 0; i<this.playerIDByPositionIndex.length; i++) {
            console.log("closeHand() loop index:" + i)
            const player = this.players[this.playerIDByPositionIndex[i]]
            if (!player) continue
            console.log(this.id)
            console.log(player.name)
            console.log(player.tableID)
            console.log(player.hasFolded)
            console.log(player.isSitout)
            const socket = this.sockets[player.socketID]
            if(this.id != player.tableID) {
                console.log("tableID is not matching, player is already in another table.")
                continue
            }
            if (player.isSitout && player.hasFolded) continue //player already reentered the pool
            // if (player.isSitout) this.sendEmptyTable(player)
            if (!player.hasFolded || player.isSitout) this.tableManager.playerPoolManager.reEnterPool(player) //if player folded, it had already reentered the pool

            // this.removePlayer(player)
        }
        // console.log(this.tableManager)
        // console.log(this.tableManager.tables[this.poolID][this.id])
        // console.log(this.tables)
        // console.log(this.poolID)
        // console.log(this.id)
        
        // console.log(this.tableManager.tables[this.poolID][this.id])

    }

    removePlayer(player) {
        console.log("removePlayer()")
        if (!player) return
        console.log(player.name)
        // this.sendEmptyTable(player)
        player.tableID = undefined
        const playerIndex = this.playerIDByPositionIndex.indexOf(player.id)
        console.log("playerIndex " + playerIndex)
        const playerKey = this.playerIDByPositionIndex[playerIndex]
        console.log("playerKey " + playerKey)
        const playerSocket = this.sockets[player.socketID]
        if (playerSocket) playerSocket.leave(`table:${this.id}`)
        delete this.players[playerKey]
        delete this.sockets[player.socketID]
        this.playerIDByPositionIndex[playerIndex] = null
        this.startHandRoutine()
        this.broadcastHandState()
    }
    startNewHand() {
        console.log("startNewHand()")
        console.log(this.id)
        if (this.currentHand.handIsBeingPlayed) return console.log("hand is already being played, something went wrong.")
        const randomStart = Math.floor(Math.random() * this.countPlayers())
        this.currentHand.dealerPos = this.findNextPlayer(randomStart)
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
            //     const socket = this.sockets[player.socketID]
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
            return console.log("exiting because we have less than 2 players")
        }
        this.determinePlayerPositions()
    }
    saveHandHistoryToDB() {
        console.log("saveHandHistoryToDB()")
        // let playerIndex = 1
        // Object.values(this.players).forEach(player => {
        //     if (!player) return
        //     this.currentHand.handHistory += `Seat ${playerIndex}: ${player.name} ($${player.stackSize}) - cards:${player.cards}\n`
        //     playerIndex++
        // })
        this.currentHand.actionSequence.forEach(action => {
            console.log(action)
            if (action.round) {
                this.currentHand.handHistory += `\n${roundStr[action.round]}: ${action.boardCards.replaceAll("\"", "")} Pot: ${action.potSize}\n`
            }
            else if (action.playerName) {
                if (action.amount.equals(0)) this.currentHand.handHistory += `${action.playerName}: ${action.type}\n`
                if (action.amount.greaterThan(0)) this.currentHand.handHistory += `${action.playerName}: ${action.type} ${action.amount}\n`   
            }
            else if (action.pot != undefined) {
                this.currentHand.handHistory += `\nPotIndex ${action.pot} - PotSize: ${action.potSize} WINNERS: ${action.winners}\n`
            }
        })
        console.log("updating player hand history arrays")
        for (let i = 0; i < this.playerIDByPositionIndex.length; i++) {
            if (this.playerIDByPositionIndex[i] === null) continue
            const player = this.tableManager.playerPoolManager.playersByPool[this.poolID][this.playerIDByPositionIndex[i]]
            if (!player) continue
            console.log(`sending hand history to ${player.name}`)
            const socket = this.tableManager.playerPoolManager.sockets[player.socketID]
            if (!socket) {
                console.log("socket is undefined")
                continue
            }
            if (socket) socket.emit("updateHandHistory", {player: player, handHistory: this.currentHand.handHistory})
        }
        this.tableManager.fastify.pg.query(`INSERT INTO hands(handHistory) VALUES ('${this.currentHand.handHistory}')`);
        // this.tableManager.fastify.pg.connect().then(async (client) => {
        //     console.log("saving hand history")
        //     try {
        //         const result = await client.query(`INSERT INTO hands(handHistory) VALUES ('${this.currentHand.handHistory}')`);
        //         console.log(result)
        //     } catch (error) {
        //         console.log(error)
                
        //     }
        //     client.release();
        // });
    }
    determinePlayerPositions(){
        console.log("determinePlayerPositions()")
        //bb, sb, button, etc
        //set initial playerTurn
        // const randomStart = Math.floor(Math.random() * this.countPlayers()) //changed to startNewHand
        // console.log(randomStart) //changed to startNewHand
        // this.currentHand.dealerPos = this.findNextPlayer(randomStart) //changed to startNewHand
        // console.log(this.currentHand.dealerPos) //changed to startNewHand


        // if (this.currentHand.dealerPos >= this.playerIDByPositionIndex.length) this.currentHand.dealerPos -= this.playerIDByPositionIndex.length
        const dealerPlayer = this.players[this.playerIDByPositionIndex[this.currentHand.dealerPos]]
        console.log(this.playerIDByPositionIndex)
        console.log(dealerPlayer)
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
// console.log(table.evaluateHand())