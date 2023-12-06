export interface Cash {
	gameTitle: string;
	blinds: string;
	players: number;
	minBuyIn: number;
	maxBuyIn: number;
	buyInAmount: number;
}

export interface Lightning {
	lightning1: Cash;
	lightning2: Cash;
	lightning3: Cash;
	lightning4: Cash;
}

export interface Tournament {
	title: string;
	state: string;
	buyIn: number;
	tableSize: number;
	pokerVariant: string;
	playersLeft: number;
	totalEntries: number;
	startingChips: number;
	prizeStructure: number[];
	startAt: string;
	playersList: {
		name: string;
		stackSize: number;
	}[];
	blindStructure: {
		sb: number;
		bb: number;
		ante: number;
	}[];
	blindLevel: number;
	blindLevelUpTime: number;
}

export type Tournaments = Tournament[];
