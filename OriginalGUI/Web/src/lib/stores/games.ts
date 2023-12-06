import { writable } from 'svelte/store';
import type { Lightning, Tournaments } from '$lib/types/Games';

export const lightningAvailable = writable<Lightning>({
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

export const tournamentsAvailable = writable<Tournaments>([
	{
		title: '$10 super especial tournament',
		state: 'Registering',
		buyIn: 10,
		tableSize: 9,
		pokerVariant: 'texas',
		playersLeft: 2,
		totalEntries: 5,
		startingChips: 5000,
		prizeStructure: [50],
		startAt: 'Running',
		playersList: [
			{ name: 'joao', stackSize: 15000 },
			{ name: 'jose', stackSize: 10000 }
		],
		blindStructure: [
			{ sb: 10, bb: 20, ante: 0 },
			{ sb: 15, bb: 30, ante: 0 },
			{ sb: 20, bb: 40, ante: 0 },
			{ sb: 30, bb: 60, ante: 0 },
			{ sb: 40, bb: 80, ante: 0 },
			{ sb: 50, bb: 100, ante: 0 },
			{ sb: 60, bb: 120, ante: 0 },
			{ sb: 80, bb: 160, ante: 0 },
			{ sb: 100, bb: 200, ante: 0 },
			{ sb: 125, bb: 250, ante: 0 },
			{ sb: 150, bb: 300, ante: 0 },
			{ sb: 200, bb: 400, ante: 0 },
			{ sb: 250, bb: 500, ante: 0 },
			{ sb: 300, bb: 600, ante: 0 },
			{ sb: 400, bb: 800, ante: 0 },
			{ sb: 500, bb: 1000, ante: 0 }
		],
		blindLevel: 1,
		blindLevelUpTime: 180000
	}
]);
