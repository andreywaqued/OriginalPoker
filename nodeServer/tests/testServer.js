const io = require('socket.io-client');
const socket = io('http://127.0.0.1:3000'); // Replace with your server's address
let user
socket.on('connect', () => {
    console.log(`Connected to the server with id: ${socket.id}`);
    socket.emit("signIn", {user: "asd", password: "asd"})
});
socket.on("signInResponse", response => {
    console.log(response)
    if (response.status === 200) {
        user = response.user
        socket.emit("enterPool", {poolID : "lightning4", stackSize: 100})
        socket.emit("enterPool", {poolID : "lightning4", stackSize: 100})
    }
})
socket.on("enterPoolResponse", response => {
    console.log(response)
    if (response.status === 200) {
        socket.emit("parseAction", {player: response.player, action: {type: "raise", amount: 200}})
        // socket.emit("leavePool", response.player)
    }

})
socket.on("updateGameState", response => {
    console.log(response)
})
socket.on("leavePoolResponse", response => {
    console.log(response)
})
socket.on("parseActionResponse", response => {
    console.log(response)
})
socket.on("poolUpdate", (pools) => {
    console.log(pools)
})