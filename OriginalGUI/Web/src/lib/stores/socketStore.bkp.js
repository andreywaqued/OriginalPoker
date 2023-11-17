import { io } from 'socket.io-client';
import { writable } from 'svelte/store';
import userStore from '$lib/stores/userStore';
import gamesAvailableStore from '$lib/stores/gamesAvailableStore';
import navItemsStore from '$lib/stores/navItemsStore';
import navSelectedItemStore from '$lib/stores/navSelectedItemStore';

// $SUBSCRIBE to all stores

/**
 * @type {import('$lib/stores/navSelectedItemStore').ID}
 */
let navSelectedItem;
navSelectedItemStore.subscribe((selected) => {
	navSelectedItem = selected;
});
/**
 * @type {import('$lib/stores/navItemsStore').Items}
 */
let navItems;
navItemsStore.subscribe((item) => {
	navItems = item;
});
/**
 * @type {import('$lib/stores/gamesAvailableStore').GamesAvailable}
 */
let gamesAvailable;
gamesAvailableStore.subscribe((games) => {
	gamesAvailable = games;
});

// end of subscribes
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

// const socket = io('http://192.168.237.73:3000'); // Replace with your server's address
// const socket = io('http://192.168.15.13:3000')
const socket = io('http://192.168.1.110:3000')

socket.on('connect', () => {
	console.log('Connected on socket id' + socket.id);
});

// socket.on('signInResponse', ({ response, status, user }) => {
// 	console.log('signInResponse');
// 	if (status === 200) {
// 		const generatedID = crypto.randomUUID();
// 		navItemsStore.set([{ id: generatedID, name: 'lobby' }]);
// 		navSelectedItemStore.set(generatedID);
// 		console.log(user);
// 		userStore.set(user);
// 	}
// });
socket.on('enterPoolResponse', (response) => {
	console.log('enterPoolResponse');
	console.log(response);
	if (response.status === 200) {
		userStore.update((user) => {
			// safe type check
			if (user === null) throw new Error("User doesn't exist");
			const playerID = response.player.id;
			if (!playerID) throw new Error("Can't get player ID");
			let players = user['players'];
			players = { ...players, playerID: response.player };
			console.log(user);
			return user;
		});
		navItemsStore.update((items) => {
			return [...items, { id: response.player.id, name: response.pool.title }];
		});
		// table.player = response.player;
		// console.log('chamando send message 1');
		// if (table) table.addMessage('updateUserSettings', user.settings);
		// if (table) table.addMessage('updatePlayer', table.player);

		// // ipcMain.emit("updatePlayer", {})
		// socket.emit("parseAction", {player: response.player, action: {type: "raise", amount: 200}})
		// socket.emit("leavePool", response.player)
	}
});

// socket.on('updateUserInfo', (user) => {
// 	console.log('updateUserInfo');
// 	userStore.set({
// 		name: user.name,
// 		balance: Math.round(user.balance * 100) / 100,
// 		avatar: user.avatar,
// 		email: user.email,
// 		settings: user.settings,
// 		players: user.players
// 	});
// });
// socket.on('updatePools', (p) => {
// 	console.log('updatePools');
// 	Object.keys(p).forEach((key) => {
// 		const pool = p[key];
// 		const gamePool = gamesAvailable[key];
// 		gamePool.gameTitle = pool.gameTitle;
// 		gamePool.blinds = `$${pool.sb.toFixed(2)} / $${pool.bb.toFixed(2)}`;
// 		gamePool.minBuyIn = pool.minBuyIn;
// 		gamePool.maxBuyIn = pool.maxBuyIn;
// 		gamePool.players = pool.currentPlayers;
// 		if (gamePool.buyInAmount === -1) gamePool.buyInAmount = pool.maxBuyIn;
// 	});
// 	console.log(gamesAvailable);
// 	gamesAvailableStore.set(gamesAvailable);
// });

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
