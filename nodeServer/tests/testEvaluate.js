const { rankHands } = require('@xpressit/winning-poker-hand-rank');
gameType = "texas"
cards = ["AS", "KS"]
boardCards = ["QS", "TC", "JD"]
console.log(rankHands(gameType, boardCards, [cards])[0].combination)