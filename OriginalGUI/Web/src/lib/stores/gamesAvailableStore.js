import { writable } from 'svelte/store';
/**
 * @typedef {{
 *   gameTitle: string,
 *   blinds: string,
 *   players: number,
 *   minBuyIn: number,
 *   maxBuyIn: number,
 *   buyInAmount: -1,
 * }} Game
 */
/**
 * @typedef {{
 *   lightning1: Game,
 *   lightning2: Game,
 *   lightning3: Game,
 *   lightning4: Game,
 * }} GamesAvailable
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
