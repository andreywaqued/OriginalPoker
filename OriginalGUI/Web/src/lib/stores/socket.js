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
