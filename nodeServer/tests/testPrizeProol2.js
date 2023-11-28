let numPlayers = 2000
let tournamentBuyin = 1
let tournamentDistribution = 0.20;
let prizedPlayers = Math.ceil(numPlayers * tournamentDistribution)
// console.log("prizedPlayers " + prizedPlayers)
let totalPrize = numPlayers * tournamentBuyin
let tableSize = 9
let prizeSegments = [
    {"payout" : 0.50, "players": tableSize},
    {"payout" : 0.25, "players": tableSize + prizedPlayers*0.3},
    {"payout" : 0.25, "players": prizedPlayers}
]
let prizeStructure = []
// let minPrize = (1 + Math.sqrt(numPlayers) / Math.sqrt(prizedPlayers) * (1*(Math.sqrt(numPlayers)/100))) * tournamentBuyin
// let minPrize = (1 + 0.1*(1 / (Math.sqrt(prizedPlayers)/Math.sqrt(numPlayers)))) * tournamentBuyin
// for (let i = 0; i < prizedPlayers; i++) {
//     prizeStructure.push(minPrize)
//     console.log(minPrize)
//     totalPrize -= minPrize
// }
for (let i = 0; i < prizedPlayers; i++) {
    let prizeShare = (Math.sqrt(numPlayers)/Math.sqrt(prizedPlayers) + prizedPlayers)/(numPlayers) * (prizedPlayers / (prizedPlayers+i))
    console.log(prizeShare)
    let playerPrize = totalPrize * prizeShare
    // console.log((prizedPlayers - i) / (prizedPlayers))
    // console.log(totalPrize * 1 / (prizedPlayers-i))
    // console.log(playerPrize)
    // if (playerPrize < minPrize) continue
    prizeStructure[i] += playerPrize
    totalPrize -= playerPrize
}
for (let i = 0; i < prizeStructure.length; i++) {
    prizeStructure[i] += totalPrize/prizeStructure.length
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
    console.log(`position ${index} prize: ${prize}`)
    // if (index===200) exit(0)
})
// console.log(totalPrize)



















