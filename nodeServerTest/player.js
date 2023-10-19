//the player class, its used by the playerPoolManager and TableManager
//this is an object that acts as an individual player for a specific table or pool
//a single user can have many players
const Decimal = require('decimal.js');
const { v4: uuidv4 } = require('uuid');
class Player {
    constructor(socket, stackSize) {
        this.id = uuidv4();
        this.userid = socket.user.id
        this.name = socket.user.name;
        this.avatar = socket.user.avatar;
        this.stackSize = stackSize;
        this.hasFolded = false;
        this.isSitout = false;
        this.cards = [];
        this.betSize = new Decimal(0);
        this.socketID = socket.id;
        this.possibleActions = [];
        this.actedSinceLastRaise = false;
        this.contestingPots = [0];
        this.position = 0;
        this.isButton = false;
        this.showCards = false;
        this.handHistoryArray = [],
        this.askingRebuy = false,
        this.rebuyAmount = new Decimal(0)
    }
}
module.exports = Player;