import { writable } from 'svelte/store';
/**
 * @typedef {Object} Game
 * @property {string} gameTitle
 * @property {string} blinds
 * @property {number} players
 * @property {number} minBuyIn
 * @property {number} maxBuyIn
 * @property {number} buyInAmount
 */
/**
 * @typedef {Object} GamesAvailable
 * @property {Game} lightning1
 * @property {Game} lightning2
 * @property {Game} lightning3
 * @property {Game} lightning4
 */
/**
 * @typedef {import('svelte/store').Writable<GamesAvailable>} GamesAvailableStore
 */
/**
 * @type GamesAvailableStore
 */
const gamesAvailable = writable({
	lightning1: {
		gameTitle: 'NL 10',
		blinds: '$0.05 / $0.10',
		players: 0,
		minBuyIn: 2,
		maxBuyIn: 10,
		buyInAmount: -1
	},
	lightning2: {
		gameTitle: 'NL 50',
		blinds: '$0.25 / $0.50',
		players: 0,
		minBuyIn: 10,
		maxBuyIn: 50,
		buyInAmount: -1
	},
	lightning3: {
		gameTitle: 'NL 100',
		blinds: '$0.50 / $1.00',
		players: 0,
		minBuyIn: 20,
		maxBuyIn: 100,
		buyInAmount: -1
	},
	lightning4: {
		gameTitle: 'NL 200',
		blinds: '$1.00 / $2.00',
		players: 0,
		minBuyIn: 40,
		maxBuyIn: 200,
		buyInAmount: -1
	}
});

export default gamesAvailable;
