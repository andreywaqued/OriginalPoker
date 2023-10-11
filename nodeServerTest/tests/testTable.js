const Player = require("../player");
const Table = require("../table");
const pool = {title: "Lightning NL 200", gameType: "cash", pokerVariant : "texas", betType : "NL", maxPlayers : 6, sb:1, bb: 2, minBuyIn: 40, maxBuyIn: 200, currentPlayers:0}

const table = new Table(undefined, pool)
const player1 = new Player({user : {name: "Player1", avatar: 0, balance: 1000, id: 0}}, 40)
const player2 = new Player({user : {name: "Player2", avatar: 1, balance: 1000, id: 1}}, 50)
const player3 = new Player({user : {name: "Player3", avatar: 2, balance: 1000, id: 2}}, 60)
const player4 = new Player({user : {name: "Player4", avatar: 3, balance: 1000, id: 3}}, 70)
const player5 = new Player({user : {name: "Player5", avatar: 4, balance: 1000, id: 4}}, 80)
const player6 = new Player({user : {name: "Player6", avatar: 5, balance: 1000, id: 5}}, 100)
table.sitPlayer(player1)
table.sitPlayer(player2)
table.sitPlayer(player3)
table.sitPlayer(player4)
table.sitPlayer(player5)
table.sitPlayer(player6)
let players = []
players.push(player1)
players.push(player2)
players.push(player3)
players.push(player4)
players.push(player5)
players.push(player6)
table.startNewHand()
console.log(table)
// for (let i = 0; i<100 ; i++) {
while (table.currentHand.handIsBeingPlayed) {
    const currentPlayer = players[table.currentHand.playerTurn]
    const randomAction = Math.floor(Math.random() * currentPlayer.possibleActions.length);
    // const action = currentPlayer.possibleActions[randomAction]
    // const action = currentPlayer.possibleActions[0]
    const action = {type : "raise", amount: 1500}
    // console.log(action)
    console.log(table.validateAction(currentPlayer, action))
    // console.log(table.actionSequence)
}
// }
console.log(table)


