const { rankHands } = require('@xpressit/winning-poker-hand-rank');
const { v4: uuidv4 } = require('uuid');

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

class Table {
    constructor(TableManager, pool, poolID) {
        this.tableManager = TableManager;
        this.id = uuidv4();
        this.title = pool.title || "Table X";
        this.betType = pool.betType || "NL";
        this.gameType = pool.gameType || "cash";
        this.pokerVariant = pool.pokerVariant || "texas";
        this.tableSize = pool.tableSize || 6;
        this.sb = pool.sb || 1;
        this.bb = pool.bb || 2;
        this.ante = pool.ante || 0;
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
            pots : [0],
            actionSequence : [],
            // playersActive : this.playerIDByPositionIndex,
            boardCards : [],
            boardRound : 0,
            minBet : 0,
            maxBet : 9999999999,
            biggestBet : 0,
            positionActing : 0,
            timeLimitToAct: 0,
            playersAllin : 0,
            playersFolded : 0,
            betSizesAllinThisRound : [],
            dealerPos: -1,
            sbPos: 0,
            bbPos: 0,
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
        if (player.position === -1) return console.log("failed to find a seat")
        player.cards = []
        player.actedSinceLastRaise = false
        player.possibleActions = []
        player.hasFolded = false
        player.isButton = false
        player.showCards = false
        player.isWinner = false
        player.betSize = 0
        player.contestingPots = [0]
        player.finalHandRank = {rank: -1}
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

        if (this.countPlayers() >= 2) {
            clearTimeout(this.startHandTimer)
            this.startHandTimer = setTimeout(() => this.startNewHand(), 5000)
        }
        // if (this.playerIDByPositionIndex.length === this.tableSize) this.startHandTimer = setTimeout(() => this.startNewHand(), 0)
        if (this.countPlayers() === this.tableSize) {
            clearTimeout(this.startHandTimer)
            this.startNewHand()
        }
        if (!this.currentHand.handIsBeingPlayed) this.broadcastHandState()
        // this.socketManager.to(`table:${this.id}`).emit("updateGameState", this.currentHand);
        
    }
    sendHandTrasition(player) {
        console.log(`sendHandTrasition()`)
        //send hand transition when player folds or the hand is over
        if (player.socketID in this.sockets && this.sockets[player.socketID]) this.sockets[player.socketID].emit("handTransition", player)
    }
    broadcastPlayerCards() {
        console.log(`broadcastPlayerCards()`)
        //send cardback to all players except the player holding its cards
        for (let i = 0; i < this.playerIDByPositionIndex.length; i++) {
            const playerID = this.playerIDByPositionIndex[i]
            const player = this.players[playerID]
            if (!player) continue
            console.log(player)//this gave an error recently,
            // trying to verify what it is sending to see if can filter to avoid sending too much information
            if (player.socketID in this.sockets && this.sockets[player.socketID]) this.sockets[player.socketID].emit("updatePlayerInfo", player)
        }
    }
    broadcastHandState() {
        console.log("broadcasting handState")
        let handState = JSON.parse(JSON.stringify(this.currentHand)) // copies the current hand
        handState.players = {}
        console.log(this.playerIDByPositionIndex)
        console.log(this.id)
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
                stackSize: player.stackSize,
                hasFolded: player.hasFolded,
                isSitout: player.isSitout,
                betSize: player.betSize,
                cards: [],
                possibleActions: player.possibleActions,
                isButton : player.isButton,
                position : player.position,
                showCards : player.showCards,
                isWinner : player.isWinner
            }
            if (player.cards.length > 0) handState.players[playerID].cards = ["cb", "cb"]
            if (handState.isShowdown && player.showCards) handState.players[playerID].cards = player.cards
            // if (handState.handIsBeingPlayed && handState.isShowdown) handState.players[playerID].cards = ["cb", "cb"]

            // console.log(this.sockets[player.socketID])
            // this.sockets[player.socketID].emit("updateGameState", handState)
        }
        // console.log("asd")
        // console.log(handState)

        this.socketManager.to(`table:${this.id}`).emit("updateGameState", handState);
        if (this.currentHand.handIsBeingPlayed) this.broadcastPlayerCards()
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
            positionActing : 0,
            timeLimitToAct: 0,
            playersAllin : 0,
            playersFolded : 0,
            betSizesAllinThisRound : [],
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
            stackSize: player.stackSize,
            hasFolded: true,
            cards: [],
            isSitout: player.isSitout,
            betSize: 0,
            possibleActions: [],
            isButton : false,
            position : player.position,
            showCards : false
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
        action.amount = action.amount.replace(",", ".")
        action.amount = Math.round(parseFloat(action.amount) * 100) / 100
        
        if (action.amount === NaN) return playerSocket.emit("actionResponse", {message: "action not allowed", status:401})
        //validate if player can make that action
        //update gamestate and broadcast or reply invalid
        // console.log(this.currentHand.actionSequence)
        // console.log(action)
        // console.log(player.possibleActions)
        console.log("validateAction 1")
        const playerSocket = this.sockets[playerFromClient.socketID]
        const player = this.players[playerFromClient.id]
        // player.isSitout = playerFromClient.isSitout
        // console.log(player)
        if (!this.currentHand.handIsBeingPlayed && playerSocket) return console.log(playerSocket.emit("actionResponse", {message: "hand is over", status:401}), "hand is over")
        const currentPlayer = this.players[this.playerIDByPositionIndex[this.currentHand.positionActing]]
        if (currentPlayer.id != player.id && playerSocket) return playerSocket.emit("actionResponse", {message: "wrong player", status:401})
        if (player.hasFolded && playerSocket) return playerSocket.emit("actionResponse", {message: "player already folded", status:401})
        console.log("validateAction 2")
        // if (player.isSitout) return "player is sitout"
        // console.log(player.possibleActions.includes(action))
        // console.log(player.possibleActions[1] === action)
        // console.log(action.type != "raise")
        let actionAllowed = false;
        console.log(player.possibleActions)
        for (let i = 0; i<player.possibleActions.length; i++) {
            if (actionAllowed) continue
            const actionAtIndex = player.possibleActions[i]
            if (action.type === actionAtIndex.type) {
                console.log(`(${action.type} === "raise" || ${action.type} === "bet") && ${action.amount} >= ${actionAtIndex.amount} : ${(action.type === "raise" || action.type === "bet") && action.amount >= actionAtIndex.amount}`)
                if (action.amount >= actionAtIndex.amount)
                if ((action.type === "call" || action.type === "fold" || action.type === "check") && action.amount === actionAtIndex.amount) actionAllowed = true;
                if ((action.type === "raise" || action.type === "bet") && action.amount < this.currentHand.minBet) return this.validateAction(player, {type: "raise", amount: this.currentHand.minBet});
                if ((action.type === "raise" || action.type === "bet") && action.amount >= this.currentHand.minBet) actionAllowed = true;
            }
        }
        console.log("validateAction 3")
        console.log(`actionAllowed: ${actionAllowed}`)
        if (!actionAllowed && playerSocket) return playerSocket.emit("actionResponse", {message: "action not allowed", status:401})
        clearTimeout(this.timeLimitCounter) //validou a acao
        console.log("validateAction 4")
        // if (action.amount < this.currentHand.biggestBet && action.amount < player.stackSize) return "amount is not allowed"
        //action valid
        // console.log(`${action.amount} > ${player.stackSize} + ${player.betSize}: ${action.amount > player.stackSize + player.betSize}`)
        if (action.amount > player.stackSize + player.betSize) action.amount = player.stackSize + player.betSize
        if (action.type === "fold") {
            console.log("player folded")
            player.hasFolded = true;
            console.log(`player.isSitout: ${player.isSitout}`)
            // player.cards = [];
            this.currentHand.playersFolded++
            if (player.socketID in this.sockets) {
                console.log("player folded 1")
                this.sendEmptyTable(player)//send empty table
                playerSocket.leave(`table:${this.id}`);
                delete this.sockets[player.socketID]
                const playerCopy = JSON.parse(JSON.stringify(player))
                this.players[player.id] = playerCopy
                this.tableManager.playerPoolManager.reEnterPool(player)
            }
        }
        console.log("validateAction 5")
        if (action.type === "check" && this.currentHand.biggestBet > player.betSize) return this.validateAction(player, player.possibleActions[0])
        console.log("validateAction 6")
        if (action.type === "raise" || action.type === "bet") {
            if (action.amount < this.currentHand.minBet && this.currentHand.minBet < player.stackSize) action.amount = this.currentHand.minBet
            if (action.amount < this.currentHand.minBet && this.currentHand.minBet > player.stackSize + player.betSize) action.amount = player.stackSize + player.betSize
            if (action.amount <= this.currentHand.biggestBet) return this.validateAction(player, player.possibleActions[1])
            const secondBiggestBet = this.currentHand.biggestBet
            this.currentHand.biggestBet = Math.round(action.amount * 100) / 100
            this.currentHand.minBet = Math.round((this.currentHand.biggestBet + this.currentHand.biggestBet - secondBiggestBet) * 100) / 100
            this.setAllPlayerActedSinceLastRaiseToFalse()
        }
        console.log("validateAction 7")
        if (action.type != "fold" && action.type != "check")  {
            player.stackSize -= action.amount - player.betSize 
            player.betSize = action.amount
        }
        if (action.amount >= player.stackSize + player.betSize) this.currentHand.playersAllin++
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
        const gameType = "texas"
        
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
                if (this.currentHand.boardCards.length > 0 && player.finalHandRank.rank === -1) player.finalHandRank = rankHands(gameType, this.currentHand.boardCards, [player.cards])[0]
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
                winners[i].stackSize += this.currentHand.pots[potIndex]/winners.length
                if (playersContestingThisPot > 1) winners[i].showCards = true
                winners[i].isWinner = true
                winnerNames.push(winners[i].name)
            }
            if (winners.length > 0) this.currentHand.actionSequence.push({pot: potIndex, potSize: this.currentHand.pots[potIndex], winners: winnerNames})
            this.currentHand.pots[potIndex] = 0
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
        this.startNewRound(1000)
    }
    prepareNextPlayerTurn(){
        console.log("prepareNextPlayerTurn()")
        if (!this.currentHand.handIsBeingPlayed) return console.log("hand is over")
        
        if (this.currentHand.playersFolded === this.countPlayers() - 1) return this.startNewRound()
        let playersLeftWithChips = 0
        if (this.currentHand.playersFolded + this.currentHand.playersAllin === this.countPlayers()) return this.startNewRoundAtShowdown()
        console.log("prepareNextPlayerTurn() 1")
        this.currentHand.positionActing = this.findNextPlayer(this.currentHand.positionActing)
        // this.currentHand.positionActing++
        // if (this.currentHand.positionActing > this.playerIDByPositionIndex.length - 1) this.currentHand.positionActing -= this.playerIDByPositionIndex.length
        // console.log(this.currentHand.positionActing)
        // console.log(this.playerIDByPositionIndex.length)
        const nextPlayer = this.players[this.playerIDByPositionIndex[this.currentHand.positionActing]]
        // console.log(nextPlayer)
        //check to see if the players left are already allin
        for (let i = 0; i < this.playerIDByPositionIndex.length; i++) {
            if (playersLeftWithChips > 2) continue
            const player = this.players[this.playerIDByPositionIndex[i]]
            if (!player) continue
            if (!player.hasFolded && player.stackSize + player.betSize > nextPlayer.betSize) playersLeftWithChips++
        }
        if (playersLeftWithChips < 2) return this.startNewRoundAtShowdown()

        if (nextPlayer.actedSinceLastRaise && this.currentHand.boardRound != 4) return this.startNewRound()
        console.log("prepareNextPlayerTurn() 2")
        // if (nextPlayer.stackSize === 0) {
        //     nextPlayer.actedSinceLastRaise = true
        //     return this.prepareNextPlayerTurn()
        // } 
        if (nextPlayer.hasFolded || nextPlayer.stackSize === 0) return this.prepareNextPlayerTurn()
        console.log("prepareNextPlayerTurn() 3")
        if (this.currentHand.minBet <= this.bb) this.currentHand.minBet = this.bb
        nextPlayer.possibleActions = [{type: "fold", amount: 0}]
        if (this.currentHand.biggestBet === nextPlayer.betSize) nextPlayer.possibleActions.push({type: "check", amount: 0})
        console.log("prepareNextPlayerTurn() 4")
        console.log(nextPlayer)
        // if (nextPlayer.isSitout) return this.validateAction(nextPlayer, nextPlayer.possibleActions[nextPlayer.possibleActions.length -1])
        if (this.currentHand.biggestBet != nextPlayer.betSize) nextPlayer.possibleActions.push({type: "call", amount: this.currentHand.biggestBet})
        if (this.currentHand.biggestBet === 0) nextPlayer.possibleActions.push({type: "bet", amount: this.bb})
        if (this.currentHand.biggestBet > 0) nextPlayer.possibleActions.push({type: "raise", amount: this.currentHand.minBet}) 

        this.currentHand.timeLimitToAct = new Date().getTime() + this.timeBank //timestamp + 20sec
        this.timeLimitCounter = setTimeout(()=> {
            console.log("time is over, folding player")
            console.log(nextPlayer)
            nextPlayer.isSitout = true;
            if (nextPlayer.possibleActions.length === 0) return console.log("nextPlayer.possibleActions.length === 0")//server protection case for when something went wrong.
            let timeoutAction = nextPlayer.possibleActions[0]
            if (nextPlayer.possibleActions[1].type === "check") timeoutAction = nextPlayer.possibleActions[1]
            //send sitout
            const socket = this.sockets[nextPlayer.socketID]
            if (socket) socket.emit("sitoutUpdate", {playerID: nextPlayer.id, isSitout: true})
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
        let highestBet = 0
        let highestBetPlayer
        let secondHighestBet = 0
        let qtdHighestBet = 0
        let smallestAllin = 99999
        let playersAllinOnThisRound = 0
        const lastPot = this.currentHand.pots.length - 1
        console.log("putBetsIntoPot() 1")
        for (let i = 0; i<this.playerIDByPositionIndex.length;i++) {
            console.log("putBetsIntoPot() 2")
            const player = this.players[this.playerIDByPositionIndex[i]]
            // console.log(smallestAllin)
            if (!player) continue
            if (player.stackSize === 0 && player.betSize > 0) {
                if (player.betSize <= smallestAllin) smallestAllin = player.betSize
            }
            // console.log(smallestAllin)
            // console.log(highestBet)
            // console.log(secondHighestBet)
            if (player.betSize > highestBet) {
                secondHighestBet = highestBet
                highestBet = player.betSize
                highestBetPlayer = player
                qtdHighestBet = 0
            } else if (player.betSize > secondHighestBet) {
                secondHighestBet = player.betSize
            }
            // console.log(highestBet)
            // console.log(secondHighestBet)
            if (player.betSize === highestBet) qtdHighestBet++
        }
        // console.log(qtdHighestBet)
        // if (lastPot > 6) process.exit()
        console.log("putBetsIntoPot() 3")
        // console.log(smallestAllin)
        // console.log(highestBet)
        // console.log(secondHighestBet)
        // console.log(qtdHighestBet)
        if (qtdHighestBet === 1) {
            highestBetPlayer.stackSize += highestBetPlayer.betSize - secondHighestBet
            highestBetPlayer.betSize = secondHighestBet
            // console.log(this.currentHand.pots)
            // process.exit(1)
            return this.putBetsIntoPot()
        }
        // if (this.currentHand.playersFolded + this.currentHand.playersAllin === this.playerIDByPositionIndex.length) return this.startNewRound()
        // let smallestAllin = highestBetPlayer
        // console.log(smallestAllin)
        // console.log(this.currentHand.betSizesAllinThisRound)
        // if (this.currentHand.betSizesAllinThisRound.length > 0) {
        //     console.log(this.currentHand.betSizesAllinThisRound)
        //     smallestAllin = this.currentHand.betSizesAllinThisRound.shift()
        //     console.log(this.currentHand.betSizesAllinThisRound)
        // }
        // console.log(smallestAllin)
        console.log("putBetsIntoPot() 4")
        for (let i = 0; i<this.playerIDByPositionIndex.length;i++) {
            const player = this.players[this.playerIDByPositionIndex[i]]
            if (!player) continue
            if (player.stackSize === 0 && player.betSize > 0) playersAllinOnThisRound++
            if (player.betSize === 0) continue
            if (player.betSize >= smallestAllin) {
                this.currentHand.pots[lastPot] += smallestAllin
                player.betSize -= smallestAllin
            } else {
                this.currentHand.pots[lastPot] += player.betSize
                player.betSize -= player.betSize
            }
            if (!player.contestingPots.includes(lastPot)) player.contestingPots.push(lastPot)
            // player.actedSinceLastRaise = false;
        }
        console.log("putBetsIntoPot() 5")
        // console.log(playersAllinOnThisRound)
        if (playersAllinOnThisRound > 0) {
        // if (qtdHighestBet != this.playerIDByPositionIndex.length - this.currentHand.playersFolded - (this.currentHand.playersAllin - playersAllinOnThisRound)) {
            this.currentHand.pots.push(0)
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
        this.currentHand.actionSequence.push({round: this.currentHand.boardRound, boardCards : this.currentHand.boardCards})
        this.currentHand.positionActing = this.currentHand.dealerPos //its going to the next player
        this.currentHand.minBet = this.bb
        this.currentHand.biggestBet = 0
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
        setTimeout(() => {this.prepareNextPlayerTurn()}, timeout)
    }
    closeHand() {
        console.log("closeHand()")
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
        // this.currentHand.betSizesAllinThisRound = [];
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
        this.tableManager.socketManager.socketsLeave(`table:${this.id}`)
        delete this.tableManager.tables[this.poolID][this.id]
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

            if (!player.hasFolded || player.isSitout) this.tableManager.playerPoolManager.reEnterPool(player) //if player folded, it had already reentered the pool

            // this.removePlayer(player)
        }
        this.saveHandHistoryToDB()
        // console.log(this.tableManager)
        // console.log(this.tableManager.tables[this.poolID][this.id])
        // console.log(this.tables)
        // console.log(this.poolID)
        // console.log(this.id)
        
        // console.log(this.tableManager.tables[this.poolID][this.id])

    }

    removePlayer(player) {
        console.log("removePlayer()")
        console.log(player.name)
        const playerIndex = this.playerIDByPositionIndex.indexOf(player.id)
        const playerKey = this.playerIDByPositionIndex[playerIndex]
        delete this.players[playerKey]
        delete this.sockets[player.socketID]
        this.playerIDByPositionIndex[playerIndex] = null
        this.broadcastHandState()
    }
    startNewHand() {
        console.log("startNewHand()")
        this.waitingForPlayers = false;
        this.currentHand.handIsBeingPlayed = true;
        this.currentHand.isShowdown = false;
        this.currentHand.pots = [0];
        this.currentHand.actionSequence = [];
        this.currentHand.boardCards = [];
        this.currentHand.boardRound = 0;
        this.currentHand.minBet = 0;
        this.currentHand.maxBet = 9999999999;
        this.currentHand.biggestBet = 0;
        this.currentHand.positionActing = 0;
        this.currentHand.playersAllin = 0;
        this.currentHand.playersFolded = 0;
        this.currentHand.betSizesAllinThisRound = [];
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
            player.isButton = false
            player.contestingPots = [0]
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
        let handHistory = `OriginalPoker ${this.title} ${this.tableSize}-max ${this.sb}/${this.bb} Button:${this.currentHand.dealerPos} - ${new Date().toUTCString()}\n`
        let playerIndex = 1
        Object.values(this.players).forEach(player => {
            if (!player) return
            handHistory += `Seat ${playerIndex}: ${player.name} ($${player.stackSize}) - cards:${player.cards}\n`
            playerIndex++
        })
        this.currentHand.actionSequence.forEach(action => {
            if (action.round) {
                handHistory += `${action.round}: ${action.boardCards}\n`
            }
            else if (action.playerName) {
                if (action.amount === 0) handHistory += `${action.playerName}: ${action.type}\n`
                if (action.amount > 0) handHistory += `${action.playerName}: ${action.type} ${action.amount}\n`   
            }
            else if (action.pot) {
                handHistory += `${action.pot} - ${action.potSize} WINNERS: ${action.winnerNames}\n`
            }
        })
        this.tableManager.fastify.pg.connect().then(async (client) => {
            console.log("saving hand history")
            try {
                const result = await client.query(`INSERT INTO hands(handHistory) VALUES ('${handHistory}')`);
                console.log(result)
            } catch (error) {
                console.log(error)
                
            }
            client.release();
        });
    }
    determinePlayerPositions(){
        console.log("determinePlayerPositions()")
        //bb, sb, button, etc
        //set initial playerTurn
        const randomStart = Math.floor(Math.random() * this.countPlayers())
        console.log(randomStart)
        this.currentHand.dealerPos = this.findNextPlayer(randomStart)
        console.log(this.currentHand.dealerPos)
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
        sbPlayer.betSize = this.sb
        bbPlayer.betSize = this.bb
        if (sbPlayer.stackSize < this.sb) sbPlayer.betSize = sbPlayer.stackSize
        if (bbPlayer.stackSize < this.bb) bbPlayer.betSize = bbPlayer.stackSize
        sbPlayer.stackSize -= sbPlayer.betSize
        bbPlayer.stackSize -= bbPlayer.betSize
        this.currentHand.actionSequence.push({playerName: sbPlayer.name, type: "sb", amount: sbPlayer.betSize})
        this.currentHand.actionSequence.push({playerName: bbPlayer.name, type: "bb", amount: bbPlayer.betSize})
        this.currentHand.positionActing = this.currentHand.bbPos
        this.currentHand.biggestBet = this.bb
        this.currentHand.minBet = this.bb * 2
        this.prepareNextPlayerTurn()
        // const nextPlayer = this.players[this.playerIDByPositionIndex[this.currentHand.positionActing]]
        // nextPlayer.possibleActions = [{type: "fold", amount: 0}, {type: "call", amount: this.bb}, {type: "raise", amount: this.bb*2}]
    }
}
module.exports = Table
// table = new Table()
// table.startNewHand()
// console.log(table.evaluateHand())