const Decimal = require('decimal.js');
let numPlayers = 12
let tournamentBuyin = new Decimal(1)
let tournamentDistribution = 0.20;
let prizedPlayers = Math.ceil(numPlayers * tournamentDistribution)
console.log("prizedPlayers " + prizedPlayers)
let totalPrize = tournamentBuyin.times(numPlayers)
let initialTotalPrize = tournamentBuyin.times(numPlayers)
let prizeStructure = []
// let minPrize = (1 + Math.sqrt(numPlayers) / Math.sqrt(prizedPlayers) * (1*(Math.sqrt(numPlayers)/100))) * tournamentBuyin
let minPrize = new Decimal((1 + 0.1*(1 / (Math.sqrt(prizedPlayers)/Math.sqrt(numPlayers)))) * tournamentBuyin)
for (let i = 0; i < prizedPlayers; i++) {
    prizeStructure.push(minPrize)
    console.log(minPrize)
    totalPrize = totalPrize.minus(minPrize)
}
for (let i = 0; i < prizedPlayers; i++) {
    let prizeShare = new Decimal((Math.sqrt(numPlayers)/Math.sqrt(prizedPlayers) + prizedPlayers)/(numPlayers) * (prizedPlayers / (prizedPlayers+i)))
    // let prizeShare = new Decimal(numPlayers).squareRoot().dividedBy(new Decimal(prizedPlayers).squareRoot()).plus(prizedPlayers).dividedBy(new Decimal(numPlayers).times(new Decimal(prizedPlayers).dividedBy(new Decimal(prizedPlayers).plus(i))))
    // (Math.sqrt(numPlayers)/Math.sqrt(prizedPlayers) + prizedPlayers)
    // /
    // (numPlayers) * (prizedPlayers / (prizedPlayers+i))
    console.log(`${i} : ${prizeShare.toNumber()}`)
    let playerPrize = prizeShare.times(totalPrize)
    prizeStructure[i] = prizeStructure[i].plus(playerPrize)
    totalPrize = totalPrize.minus(playerPrize)
}
let testPrize = new Decimal(0)
for (let i = 0; i < prizeStructure.length; i++) {
    prizeStructure[i] = prizeStructure[i].plus(totalPrize.dividedBy(prizeStructure.length))
    prizeStructure[i] = prizeStructure[i].toDecimalPlaces(2)
    console.log(`${i} : ${prizeStructure[i]}`)
    testPrize = testPrize.plus(prizeStructure[i])
}
prizeStructure[prizeStructure.length-1] = prizeStructure[prizeStructure.length-1].minus(testPrize.minus(initialTotalPrize))
testPrize = new Decimal(0)
for (let i = 0; i < prizeStructure.length; i++) {
    console.log(`${i} : ${prizeStructure[i]}`)
    testPrize = testPrize.plus(prizeStructure[i])
}
// for (let i = 1; i < prizedPlayers+1; i++) {
//     let remainingPlayers = prizedPlayers - i
//     let prizeToken = minPrize
//     let prizeTokensAmount = Math.floor(totalPrize/minPrize)
//     console.log("remainingPlayers " + remainingPlayers)
//     console.log("prizeToken " + prizeToken)
//     console.log("prizeTokensAmount " + prizeTokensAmount)
//     let playerPrize = prizeToken * Math.ceil(remainingPlayers/i)
//     console.log("playerPrize " + playerPrize)
//     // if (playerPrize < minPrize) continue
//     prizeStructure.push(playerPrize)
//     totalPrize -= playerPrize
// }
// for (let i = 0; i < prizeStructure.length; i++) {
//     prizeStructure[i] += totalPrize/prizeStructure.length
// }
// console.log(prizeStructure)
// console.log(prizeStructure.length)
console.log(`players: ${numPlayers}, prizedPlayers: ${prizedPlayers}`)
prizeStructure.forEach((prize, index) => {
    console.log(`position ${index+1} prize: ${prize}`)
    // if (index===200) exit(0)
})
console.log(testPrize.toNumber())



















