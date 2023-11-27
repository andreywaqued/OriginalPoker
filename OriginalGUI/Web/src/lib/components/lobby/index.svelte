<script>
	import userStore from '$lib/stores/userStore';
	import gamesAvailableStore from '$lib/stores/gamesAvailableStore';
	import socket from '$lib/services/socket';
	import navSelectedItemStore from '$lib/stores/navSelectedItemStore';
	import { handleSwipe } from '$lib/utils/Swiper';
	import PreloadImages from './PreloadImages.svelte';

	socket.on('updatePools', (p) => {
		console.log('updatePools');
		let gamesAvailable = $gamesAvailableStore;
		Object.keys(p).forEach((key) => {
			const pool = p[key];
			const gamePool = gamesAvailable[key];
			gamePool.gameTitle = pool.gameTitle;
			gamePool.blinds = `$${pool.sb.toFixed(2)} / $${pool.bb.toFixed(2)}`;
			gamePool.minBuyIn = pool.minBuyIn;
			gamePool.maxBuyIn = pool.maxBuyIn;
			gamePool.players = pool.currentPlayers;
			if (gamePool.buyInAmount === -1) gamePool.buyInAmount = pool.maxBuyIn;
		});
		console.log(gamesAvailable);
		gamesAvailableStore.set(gamesAvailable);
	});

	socket.on('enterPoolResponse', (response) => {
		console.log('enterPoolResponse');
		console.log(response);
		if (response.status === 200) {
			const playerID = response.player.id;
			if (!playerID) throw new Error("Can't get player ID");
			userStore.update((user) => {
				// safe type check
				if (user === null) throw new Error("User doesn't exist");
				// append new player to object players
				user['players'] = { ...user['players'], [playerID]: response.player };
				console.log(user);
				return user;
			});
			navSelectedItemStore.set(playerID);
			// table.player = response.player;
			// console.log('chamando send message 1');
			// if (table) table.addMessage('updateUserSettings', user.settings);
			// if (table) table.addMessage('updatePlayer', table.player);

			// // ipcMain.emit("updatePlayer", {})
			// socket.emit("parseAction", {player: response.player, action: {type: "raise", amount: 200}})
			// socket.emit("leavePool", response.player)
		}
	});

	/**
	 * @param {('lightning1'|'lightning2'|'lightning3'|'lightning4')} poolID
	 */
	function openNewTable(poolID) {
		console.log('openNewTable');
		let stackSize = parseFloat($gamesAvailableStore[poolID].buyInAmount.toString());
		stackSize = Math.round(stackSize * 100) / 100;
		const balance = $userStore?.balance || 0;
		console.log(stackSize);
		console.log(balance);
		console.log($gamesAvailableStore[poolID].minBuyIn);
		console.log($gamesAvailableStore[poolID].maxBuyIn);
		console.log(
			balance < $gamesAvailableStore[poolID].buyInAmount ||
				$gamesAvailableStore[poolID].buyInAmount < $gamesAvailableStore[poolID].minBuyIn ||
				$gamesAvailableStore[poolID].buyInAmount > $gamesAvailableStore[poolID].maxBuyIn
		);
		// if (stackSize < gamesAvailable[poolID].minBuyIn ) stackSize = gamesAvailable[poolID].minBuyIn
		// if (stackSize > gamesAvailable[poolID].maxBuyIn ) stackSize = gamesAvailable[poolID].maxBuyIn
		if (stackSize > 0 && Object.keys($userStore?.players).length < 4)
			socket.emit('enterPool', { poolID: poolID, stackSize: stackSize });

		return null;
	}
</script>

<!-- SET IMAGES PRELOAD HEAD -->
<PreloadImages />

<section
	class="h-full w-full"
	class:hidden={$navSelectedItemStore !== 'lobby'}
	on:touchstart|self={(event) => handleSwipe(event, 'lobby')}
	on:touchmove|self={(event) => handleSwipe(event, 'lobby')}
>
	<h2 class="pb-2 pl-6 pt-4 text-lg font-bold uppercase tracking-widest text-white">
		Lightning Cash
	</h2>
	<div class="grid max-w-fit grid-flow-col gap-x-2 overflow-x-auto px-3">
		{#each Object.entries($gamesAvailableStore) as [key, game]}
			<div
				class="w-36 space-y-2 rounded-lg border-2 border-[rgb(69,69,69)] bg-[rgb(49,49,49)] p-2 text-white"
			>
				<h3 class="text-center text-2xl font-extrabold">{game.gameTitle}</h3>
				<div class="space-y-4 border-y-2 border-zinc-600 py-2 text-center">
					<div>
						<p class="description">Blinds</p>
						<p class="title">{game.blinds}</p>
					</div>
					<div>
						<p class="description">Players</p>
						<p class="title">{game.players}</p>
					</div>

					<div class="flex justify-around">
						<div>
							<p class="description">Min</p>
							<p class="title">
								${game.minBuyIn}
							</p>
						</div>
						<div>
							<p class="description">Max</p>
							<p class="title">
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
