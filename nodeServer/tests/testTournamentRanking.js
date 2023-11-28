const {mergeSort} = require("../mergeAlg")
 
// var arr = [ 12, 11, 13, 5, 6, 7 ];
// var arr_size = arr.length;

// console.log(  "Given array is ");
// printArray(arr, arr_size);

// mergeSort(arr, 0, arr_size - 1);

// console.log( "Sorted array is ");
// printArray(arr, arr_size);
 
// This code is contributed by SoumikMondal








let players = [
    {name: "asd", stackSize: 123},
    {name: "asd1", stackSize: 1321},
    {name: "asd2", stackSize: 121},
    {name: "asd3", stackSize: 165},
    {name: "asd4", stackSize: 100},
    {name: "asd5", stackSize: 189},
    {name: "asd6", stackSize: 125},
    {name: "asd7", stackSize: 195},
    {name: "asd8", stackSize: 125},
    {name: "asd9", stackSize: 10},
    {name: "asd10", stackSize: 159},
    {name: "asd11", stackSize: 135},
]
// players.forEach(player => {
//     for (let i = 0; i<10000; i++) {
//         const newPlayer = JSON.parse(JSON.stringify(player))
//         newPlayer.name += i
//         players.push(newPlayer)
//     }
// })
let playerToRemove = players[1000]
let playersRanked = []
let evalCount = 0
function testSort(){
    for (let i = 0; i<players.length; i++) {
        let arrayTemp = []
        for (let x = 0; x<playersRanked.length; x++) {
            evalCount++
            if (players[i] < playersRanked[x]) continue
            arrayTemp = playersRanked.slice(0, x+1)
            arrayTemp.push(players[i])
            playersRanked.slice(x+1).forEach(player => {
                arrayTemp.push(player)
            })
            // break
        }
        if (playersRanked.length === 0) arrayTemp.push(players[i])
        playersRanked = arrayTemp
    }
}

// let startingTime = new Date()
// console.log(players)
let playersFilter = players.filter((player)=>player.name==="asd123")[0]
console.log(playersFilter)
// let endTime = new Date()
// console.log(playersFilter)
// console.log(endTime - startingTime)

// startingTime = new Date()
// console.log(players)
// players.splice(players.indexOf(playerToRemove), 1)
// endTime = new Date()
// console.log(players)
// console.log(endTime - startingTime)

// let newplayers = players.concat(players)
// console.log(newplayers)
// console.log(players)
// console.log("test")
// let startingTime = new Date()
// testSort()
// let endTime = new Date()
// console.log(endTime - startingTime)
// console.log(playersRanked)

// console.log("merge")
// startingTime = new Date()
// mergeSort(players, 0, players.length-1)
// endTime = new Date()
// console.log(players)
// console.log(endTime - startingTime)
// console.log(players.length)