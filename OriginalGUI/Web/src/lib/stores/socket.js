import { io } from 'socket.io-client';
import { writable } from 'svelte/store';
import user from '$lib/stores/user';
import gamesAvailableStore from '$lib/stores/gamesAvailable';

const socket = io('http://192.168.237.73:3000'); // Replace with your server's address

socket.on('connect', () => {
	console.log('Connected on socket id' + socket.id);
});

socket.on('signInResponse', ({ response, status, user: u }) => {
	console.log('signinresponse: ' + status + ' ' + response);
	user.set(u);
});

socket.on("enterPoolResponse", response => {
    console.log("enterPoolResponse")
    console.log(response)
    if (response.status === 200) {
    //   if (tables.length < 4) {
    //     const lastIndex = tables.push(createWindow(response.pool.title, "table")) - 1
    //     const table = tables[lastIndex]
    //     console.log(table)
    //     players.push(response.player)
    //     playersID.push(response.player.id)
    //     table.player = response.player
    //     console.log("chamando send message 1")
    //     if (table) table.addMessage("updateUserSettings", user.settings)
    //     if (table) table.addMessage("updatePlayer", table.player)
        
    //     // ipcMain.emit("updatePlayer", {})
    //   }
    //     // socket.emit("parseAction", {player: response.player, action: {type: "raise", amount: 200}})
    //     // socket.emit("leavePool", response.player)
    }
})

socket.on('updateUser', (u) => {
	user.set({
		name: u.name,
		balance: Math.round(u.balance * 100) / 100,
		avatar: u.avatar,
		email: u.email,
		settings: u.settings
	});
});

/**
 * @type {import('$lib/stores/gamesAvailable').GamesAvailable}
 */
let gamesAvailable;
gamesAvailableStore.subscribe((games) => {
	gamesAvailable = games;
});
socket.on('updatePools', (p) => {
	console.log('updatePools');
	let newGamesAvailable = { ...gamesAvailable };
	Object.keys(p).forEach((key) => {
		const pool = p[key];
		const gamePool = newGamesAvailable[key];
		gamePool.gameTitle = pool.title;
		gamePool.blinds = `$${pool.sb.toFixed(2)} / $${pool.bb.toFixed(2)}`;
		gamePool.minBuyIn = pool.minBuyIn;
		gamePool.maxBuyIn = pool.maxBuyIn;
		gamePool.players = pool.currentPlayers;
		if (gamePool.buyInAmount === -1) gamePool.buyInAmount = pool.maxBuyIn;
	});
	console.log(newGamesAvailable);
	gamesAvailableStore.set(newGamesAvailable);
});

/**
 * writable store for handling a socket.io variable.
 * @type {import('svelte/store').Writable<(null | import('socket.io-client').Socket)>}
 */
export const messagesStore = writable(null);

/**
 * @param {*} ev
 * @param {...*} args
 */
function sendMessage(ev, ...args) {
	if (socket.connected) {
		socket.emit(ev, ...args);
	}
}

export default {
	subscribe: messagesStore.subscribe,
	sendMessage
};
