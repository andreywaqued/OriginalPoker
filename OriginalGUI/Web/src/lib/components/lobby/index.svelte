<script>
	import userStore from '$lib/stores/userStore';
	import gamesAvailableStore from '$lib/stores/gamesAvailableStore';
	import socket from '$lib/services/socket';
	import navSelectedItemStore from '$lib/stores/navSelectedItemStore';
	import { handleSwipe } from '$lib/utils/Swiper';
	import Modal from '$lib/components/Modal.svelte';
	import PreloadImages from './PreloadImages.svelte';

	// TYPES

	/**
	 * @typedef {import('$lib/stores/gamesAvailableStore').Game} Game
	 *
	 * @typedef {Object} Modal
	 * @property {Boolean} visibility
	 * @property {String} key
	 */

	// VARIABLES

	/**
	 * @type {Game & Modal}
	 */
	let gameModal = {
		blinds: '',
		gameTitle: '',
		players: 0,
		maxBuyIn: 0,
		minBuyIn: 0,
		buyInAmount: 0,
		visibility: false,
		key: ''
	};

	// SOCKET HANDLERS

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

	// FUNCTIONS

	/**
	 * @param {string} key
	 * @param {import('$lib/stores/gamesAvailableStore').Game} game
	 */
	function openAndSetupGameModal(key, game) {
		// standard amount value to enter the game;
		game.buyInAmount = game.minBuyIn;
		gameModal = { ...game, key, visibility: true };
		return null;
	}

	/**
	 * @param {Game & Modal} game
	 */
	function enterPool(game) {
		console.log('enterPool');
		gameModal.visibility = false;
		let stackSize = parseFloat(game.buyInAmount.toString());
		stackSize = Math.round(stackSize * 100) / 100;
		const balance = $userStore?.balance || 0;
		console.log(stackSize);
		console.log(balance);
		console.log(game.minBuyIn);
		console.log(game.maxBuyIn);
		console.log(
			balance < game.buyInAmount ||
				game.buyInAmount < game.minBuyIn ||
				game.buyInAmount > game.maxBuyIn
		);
		// if (stackSize < gamesAvailable[poolID].minBuyIn ) stackSize = gamesAvailable[poolID].minBuyIn
		// if (stackSize > gamesAvailable[poolID].maxBuyIn ) stackSize = gamesAvailable[poolID].maxBuyIn
		if (stackSize > 0 && Object.keys($userStore?.players).length < 4)
			socket.emit('enterPool', { poolID: game.key, stackSize: stackSize });

		return null;
	}
</script>

<!-- SET IMAGES PRELOAD HEAD -->
<PreloadImages />

<!-- MODALS -->
<Modal class="w-1/3 max-w-xs bg-transparent" showModal={gameModal.visibility}>
	<div class="flex w-full flex-col rounded bg-white py-4">
		<p class="text-center">⚡{gameModal.gameTitle}</p>
		<input
			class="mx-auto mb-2 mt-1 w-2/3 text-black"
			type="range"
			step="0.01"
			min={gameModal.minBuyIn}
			max={gameModal.maxBuyIn}
			bind:value={gameModal.buyInAmount}
		/>
		<button
			on:click={enterPool(gameModal)}
			class="mx-auto flex w-2/3 justify-between rounded-lg bg-blue-400 py-1 px-2 text-center text-sm font-extrabold uppercase active:scale-95"
		>
			<p>
				${gameModal.buyInAmount}
			</p>
			<svg class="rounded" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
				><path
					d="M0 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v6h8V5l5 5-5 5v-3z"
				/></svg
			>
		</button>
	</div>
</Modal>

<section
	class="h-full w-full"
	class:hidden={$navSelectedItemStore !== 'lobby'}
	on:touchstart|self|passive={(event) => handleSwipe(event, 'lobby')}
	on:touchmove|self|passive={(event) => handleSwipe(event, 'lobby')}
	on:touchend|self|passive={(event) => handleSwipe(event, 'lobby')}
>
	<h2 class="pb-2 pl-6 pt-4 text-lg font-bold uppercase tracking-widest text-white">
		Lightning Cash
	</h2>
	<div class="grid max-w-fit grid-flow-col gap-x-2 overflow-x-auto px-3">
		{#each Object.entries($gamesAvailableStore) as [key, game] (key)}
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
					on:click={openAndSetupGameModal(key, game)}
					disabled={$userStore?.balance < game.minBuyIn}
					class="mx-auto !mb-2 w-full rounded-lg bg-blue-400 py-1 text-center text-sm font-extrabold uppercase active:scale-95 disabled:opacity-75"
				>
					Join now
				</button>
			</div>
		{/each}
	</div>
</section>
