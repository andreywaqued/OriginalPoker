<script>
	import { socket, user } from '$lib/stores';

	socket.subscribe((s) => {
		// socket.emit("updateUserInfo", {user: userRecovered, status: 200})
		// socket.emit("updatePools", playerPoolManager.pools)
		s?.on('updateUser', (u) => {
			user.set({
				name: u.name,
				balance: Math.round(u.balance * 100) / 100,
				avatar: u.avatar,
				email: u.email,
				settings: u.settings
			});
		});
		s?.on('updatePools', (p) => {
			console.log('updatePools');
			let newGamesAvailable = { ...gamesAvailable };
			Object.keys(p).forEach((key) => {
				const pool = p[key];
				const gamePool = newGamesAvailable[key];
				gamePool.gameTitle = pool.gameTitle;
				gamePool.blinds = `$${pool.sb.toFixed(2)} / $${pool.bb.toFixed(2)}`;
				gamePool.minBuyIn = pool.minBuyIn;
				gamePool.maxBuyIn = pool.maxBuyIn;
				gamePool.players = pool.currentPlayers;
				if (gamePool.buyInAmount === -1) gamePool.buyInAmount = pool.maxBuyIn;
			});
			gamesAvailable = newGamesAvailable;
		});
	});

	let gamesAvailable = {
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
	};
	/**
	 * @param {('lightning1'|'lightning2'|'lightning3'|'lightning1')} poolID
	 */
	function openNewTable(poolID) {
		console.log("openNewTable")
		let stackSize = parseFloat(gamesAvailable[poolID].buyInAmount.toString());
		stackSize = Math.round(stackSize * 100) / 100;
		const balance = $user?.balance || 0;
		console.log(stackSize);
		console.log(balance);
		console.log(gamesAvailable[poolID].minBuyIn);
		console.log(gamesAvailable[poolID].maxBuyIn);
		console.log(
			balance < gamesAvailable[poolID].buyInAmount ||
				gamesAvailable[poolID].buyInAmount < gamesAvailable[poolID].minBuyIn ||
				gamesAvailable[poolID].buyInAmount > gamesAvailable[poolID].maxBuyIn
		);
		// if (stackSize < gamesAvailable[poolID].minBuyIn ) stackSize = gamesAvailable[poolID].minBuyIn
		// if (stackSize > gamesAvailable[poolID].maxBuyIn ) stackSize = gamesAvailable[poolID].maxBuyIn
		if (stackSize > 0) $socket?.emit('enterPool', { poolID: poolID, stackSize: stackSize });

		return null;
	}
</script>

<div>
	<section>
		<h2 class="pb-2 pl-6 pt-4 text-lg font-bold uppercase tracking-widest text-white">
			Lightning Cash
		</h2>
		<div class="grid max-w-fit grid-flow-col gap-x-2 overflow-x-auto px-3">
			{#each Object.entries(gamesAvailable) as [key, game]}
				<div
					class="w-36 space-y-2 rounded-lg border-2 border-[rgb(69,69,69)] bg-[rgb(49,49,49)] p-2 text-white"
				>
					<h3 class="text-center text-2xl font-extrabold">{game.gameTitle}</h3>
					<div class="space-y-4 border-y-2 border-zinc-600 py-2 text-center">
						<div>
							<p class="w-full text-xs font-bold uppercase leading-3 tracking-wider text-zinc-500">
								Blinds
							</p>
							<p class="text-xl leading-6">{game.blinds}</p>
						</div>
						<div>
							<p class="w-full text-xs font-bold uppercase leading-3 tracking-wider text-zinc-500">
								Players
							</p>
							<p class="text-xl leading-6">{game.players}</p>
						</div>

						<div class="flex justify-around">
							<div>
								<p
									class="w-full text-xs font-bold uppercase leading-3 tracking-wider text-zinc-500"
								>
									Min
								</p>
								<p class="text-xl leading-6">
									${game.minBuyIn}
								</p>
							</div>
							<div>
								<p
									class="w-full text-xs font-bold uppercase leading-3 tracking-wider text-zinc-500"
								>
									Max
								</p>
								<p class="text-xl leading-6">
									${game.maxBuyIn}
								</p>
							</div>
						</div>
					</div>
					<button
						on:click={openNewTable(key)}
						class="mx-auto !mb-2 !mt-4 w-full rounded-lg bg-blue-400 py-1 text-center text-sm font-extrabold uppercase"
					>
						Join now
					</button>
				</div>
			{/each}
		</div>
	</section>
</div>
