export interface User {
	id: string;
	name: string;
	balance: number;
	avatar: number;
	email: string;
	settings: {
		sounds: boolean;
		preferredSeats: {
			'3max': number;
			'6max': number;
			'9max': number;
		};
		showValuesInBB: boolean;
		adjustBetByBB: boolean;
		presetButtons: {
			preflop: {
				type: string;
				value: number;
				display: string;
			}[];
			posflop: {
				type: string;
				value: number;
				display: string;
			}[];
		};
	};
	transactions?: {}[];
	players: {};
}
