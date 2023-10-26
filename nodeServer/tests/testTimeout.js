const { createClient } = require("redis");

const client = createClient({
    url: 'rediss://red-cksjdg6nfb1c73c8tgpg:eEjoQXin0xOlVfhsOu26xy3BpIjjdgul@oregon-redis.render.com:6379'
  });
  

client.on('error', err => console.log('Redis Client Error', err));

client.connect()
// let a = {asd: 123, adssda: 8123, c: 123}
// console.log(a)
// let b = a.asd
// console.log(b)
// // delete a.asd
// console.log(a)
// console.log(b)
let playerInfo = {
    player1: {name: "asd", value: 1, cards: ["As", "Ks"], timer: {asd: 123}},
    player2: {name: "asd1", value: 5, cards: ["As", "Ks"], timer: {asd: 123}},
    player3: {name: "asd2", value: 10, cards: ["As", "Ks"], timer: {asd: 123}}
}
let tableInfo = {
    tableID: 1,
    lastBet: 123,
    pots: [0, 1, 2],
    players: playerInfo
}
// let tableInfoSerialized = JSON.stringify(tableInfo)


client.hGet("table:5d0581c3-1804-4e1a-aa48-26d3d0d7df65", "tableInfo").then((value)=>{
    const tableInfo = JSON.parse(value)
    console.log(tableInfo)
    // console.log(parseFloat(value.adssda))
})
client.hGet("table:5d0581c3-1804-4e1a-aa48-26d3d0d7df65", "gameState").then((value)=>{
    const gameState = JSON.parse(value)
    console.log(gameState)
    // console.log(parseFloat(value.adssda))
})
client.hGet("table:5d0581c3-1804-4e1a-aa48-26d3d0d7df65", "players").then((value)=>{
    const players = JSON.parse(value)
    console.log(players)
    // console.log(parseFloat(value.adssda))
})
// client.hSet("tableInfo2", "tableInfo", JSON.stringify(tableInfo)).then(()=>{
// })
// client.hSet("tableInfo2", "players", JSON.stringify(playerInfo)).then(()=>{
//     // client.hGetAll("testObj1234").then((value)=>{
//     //     console.log(value)
//     //     // console.log(parseFloat(value.adssda))
//     // })
// })
console.log("asd")
// console.log()
