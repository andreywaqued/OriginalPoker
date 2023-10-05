let playerIDByPositionIndex = new Array(6).fill(null)
let player = {
    asd: 123,
    asdsa: 12312
}
console.log(player[null])
console.log(playerIDByPositionIndex)
for (let i = 0; i < playerIDByPositionIndex.length; i++) {
    if (!playerIDByPositionIndex[i]) {
        playerIDByPositionIndex[i] = 123;
        break
    }
}
console.log(playerIDByPositionIndex)
for (let i = 0; i < playerIDByPositionIndex.length; i++) {
    if (!playerIDByPositionIndex[i]) {
        playerIDByPositionIndex[i] = 123;
        break
    }
}
console.log(playerIDByPositionIndex)
console.log(findNextPlayer(-1))
console.log(findNextPlayer(5))
playerIDByPositionIndex[0] = null
console.log(findNextPlayer(0))
console.log(playerIDByPositionIndex)




function countPlayers(){
    let count = 0
    for (let i = 0; i < playerIDByPositionIndex.length; i++) {
        if (!playerIDByPositionIndex[i]) continue
        count++
    } 
    return count
}
function findNextPlayer(start){
    if (start >= playerIDByPositionIndex.length) start -= playerIDByPositionIndex.length
    for (let i = start+1; i <= start + playerIDByPositionIndex.length; i++) {
        console.log(i)
        console.log(playerIDByPositionIndex.length)
        if (i >= playerIDByPositionIndex.length) i -= playerIDByPositionIndex.length
        if (!playerIDByPositionIndex[i]) continue
        return i
    } 
}