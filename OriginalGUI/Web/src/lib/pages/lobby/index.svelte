<script lang="ts">
	import { user } from '$lib/stores/user';
	import { lightningsAvailable, tournamentsAvailable } from '$lib/stores/games';
	import socket from '$lib/services/socket';
	import { activeSlot, activeLobbyTab } from '$lib/stores/tabs';
	import { handleSwipe } from '$lib/utils/Swiper';
	import Modal from '$lib/components/Modal.svelte';
	import PreloadImages from './PreloadImages.svelte';
	import type { Cash, Tournament } from '$lib/types/Games';
	import TournamentInfo from './TournamentInfo.svelte';

	// MODALS VARIABLES

	const GAMES_TABS = ['lightning cash', 'vortex sng', 'instant tourneys'];

	let selectedLightningModal = {
		visibility: false,
		id: ''
	};

	let selectedTournamentModal = {
		visibility: false,
		id: ''
	};

	// SOCKET HANDLERS

	socket.on('updatePools', (pool) => {
		console.log('updatePools');
		lightningsAvailable.update((outdatedLightningsAvailable) => {
			const updatedLightningsAvailable = outdatedLightningsAvailable;
			Object.entries(pool).forEach(
				([id, { gameTitle, sb, bb, minBuyIn, maxBuyIn, currentPlayers }]) => {
					updatedLightningsAvailable[id].gameTitle = gameTitle;
					updatedLightningsAvailable[id].blinds = `$${sb.toFixed(2)} / $${bb.toFixed(2)}`;
					updatedLightningsAvailable[id].minBuyIn = minBuyIn;
					updatedLightningsAvailable[id].maxBuyIn = maxBuyIn;
					updatedLightningsAvailable[id].players = currentPlayers;
					updatedLightningsAvailable[id].buyInAmount = minBuyIn;
				}
			);
			return updatedLightningsAvailable;
		});
	});
	socket.on('enterPoolResponse', (response) => {
		console.log('enterPoolResponse');
		console.log(response);
		if (response.status === 200) {
			const playerID = response.player.id;
			if (!playerID) throw new Error("Can't get player ID");
			user.update((oudatedUser) => {
				// safe type check
				if (oudatedUser === null) throw new Error("User doesn't exist");
				// append new player to object players
				oudatedUser['players'] = { ...oudatedUser['players'], [playerID]: response.player };
				console.log(oudatedUser);
				return oudatedUser;
			});
			activeSlot.set(playerID);
			// table.player = response.player;
			// console.log('chamando send message 1');
			// if (table) table.addMessage('updateUserSettings', user.settings);
			// if (table) table.addMessage('updatePlayer', table.player);

			// // ipcMain.emit("updatePlayer", {})
			// socket.emit("parseAction", {player: response.player, action: {type: "raise", amount: 200}})
			// socket.emit("leavePool", response.player)
		}
	});
	socket.on('updateTournamentList', (newTournamentsList) => {
		console.log('updateTournamentList');
		console.log(newTournamentsList);
		tournamentsAvailable.set(newTournamentsList);
	});

	// FUNCTIONS

	function handleOpenLightningModal(key: string) {
		selectedLightningModal = { id: key, visibility: true };
		return null;
	}

	function handleOpenTournamentModal(index: string) {
		selectedTournamentModal = { id: index, visibility: true };
		return null;
	}

	function enterPool(key: string, game: Cash) {
		console.log('enterPool');
		selectedLightningModal.visibility = false;
		let stackSize = parseFloat(game.buyInAmount.toString());
		stackSize = Math.round(stackSize * 100) / 100;
		const balance = $user?.balance || 0;
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
		if (stackSize > 0 && Object.keys($user?.players).length < 4)
			socket.emit('enterPool', { poolID: key, stackSize: stackSize });

		return null;
	}
	function handleSelectTab(id: string) {
		activeLobbyTab.set(id);
		return null;
	}

	activeLobbyTab.set(GAMES_TABS[2]);
</script>

<!-- SET IMAGES PRELOAD HEAD -->
<PreloadImages />

<!-- MODALS -->

<Modal class="w-1/3 max-w-xs bg-white" showModal={selectedLightningModal.visibility}>
	{#if $lightningsAvailable[selectedLightningModal.id]}
		<div class="flex w-full flex-col rounded py-4">
			<p class="text-center">⚡{$lightningsAvailable[selectedLightningModal.id].gameTitle}</p>
			<input
				class="mx-auto mb-2 mt-1 w-2/3 text-black"
				type="range"
				step="0.01"
				min={$lightningsAvailable[selectedLightningModal.id].minBuyIn}
				max={$lightningsAvailable[selectedLightningModal.id].maxBuyIn}
				bind:value={$lightningsAvailable[selectedLightningModal.id].buyInAmount}
			/>
			<button
				on:click={enterPool(
					selectedLightningModal.id,
					$lightningsAvailable[selectedLightningModal.id]
				)}
				class="mx-auto flex w-2/3 justify-between rounded-lg bg-blue-400 px-2 py-1 text-center text-sm font-extrabold uppercase active:scale-95"
			>
				<p>
					${$lightningsAvailable[selectedLightningModal.id].buyInAmount}
				</p>
				<svg class="rounded" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
					><path
						d="M0 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v6h8V5l5 5-5 5v-3z"
					/></svg
				>
			</button>
		</div>
	{/if}
</Modal>
<Modal class="w-11/12 max-w-xl bg-gray" showModal={selectedTournamentModal.visibility}>
	{#if $tournamentsAvailable[selectedTournamentModal.id]}
		<TournamentInfo {...$tournamentsAvailable[selectedTournamentModal.id]} userID={$user?.id} />
	{/if}
</Modal>

<section
	class="flex h-full w-full flex-col"
	class:hidden={$activeSlot !== 'lobby'}
	on:touchstart|self|passive={(event) => handleSwipe(event, 'lobby')}
	on:touchmove|self|passive={(event) => handleSwipe(event, 'lobby')}
	on:touchend|self|passive={(event) => handleSwipe(event, 'lobby')}
>
	<div class="mb-4 mt-2 grid w-full auto-cols-fr grid-flow-col gap-x-1 px-2">
		{#each GAMES_TABS as tab}
			<button
				class="text-sm font-bold uppercase leading-5 text-white max-w-fit m-auto border-transparent border-b-2 transition-all duration-75 h-fit"
				class:!border-sky-600={tab === $activeLobbyTab}
				on:click={() => handleSelectTab(tab)}>{tab}</button
			>
		{/each}
	</div>
	{#if $activeLobbyTab === 'lightning cash'}
		<div class="grid w-full grid-cols-2 gap-2 overflow-y-auto px-3 md:grid-cols-3 lg:grid-cols-4">
			{#each Object.entries($lightningsAvailable) as [key, game] (key)}
				<div
					class="grid h-fit w-full grid-cols-6 items-center gap-y-1.5 rounded-lg border-2 border-[rgb(69,69,69)] bg-[rgb(49,49,49)] p-2 text-white shadow"
				>
					<h3 class="col-span-3 text-center text-lg font-extrabold md:text-2xl">
						{game.gameTitle}
					</h3>
					<div class="col-span-3">
						<p class="description">Blinds</p>
						<p class="item">{game.blinds}</p>
					</div>
					<div class="col-span-2">
						<p class="description">Players</p>
						<p class="item !text-base font-bold md:!text-xl">{game.players}</p>
					</div>
					<div class="col-span-2">
						<p class="description">Min</p>
						<p class="item">
							${game.minBuyIn}
						</p>
					</div>
					<div class="col-span-2">
						<p class="description">Max</p>
						<p class="item">
							${game.maxBuyIn}
						</p>
					</div>
					<!--<div class="space-y-4 border-y-2 border-zinc-600 py-2 text-center">

						<div class="flex justify-around">
						</div>
					</div>-->
					<div class="col-span-6 w-full border-t-2 border-gray py-2">
						<button
							on:click={() => handleOpenLightningModal(key)}
							disabled={$user?.balance < game.minBuyIn}
							class="mx-auto w-full rounded-lg bg-blue-400 py-1 text-center text-sm font-extrabold uppercase active:scale-95 disabled:opacity-75"
						>
							Join now
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	{#if $activeLobbyTab === 'vortex sng'}
		<p class="text-center text-white">SOON</p>
	{/if}
	{#if $activeLobbyTab === 'instant tourneys'}
		<div class="flex w-full justify-center">
			<table class="w-5/6 table-auto border-collapse bg-gray px-4 text-xs text-white">
				<thead>
					<tr class="bg-gray-dark">
						<th class="whitespace-no-wrap p-1 text-center">Start/State</th>
						<th class="whitespace-no-wrap p-1 text-center">Name</th>
						<th class="whitespace-no-wrap p-1 text-center">Prize</th>
						<th class="whitespace-no-wrap p-1 text-center">Players</th>
					</tr>
				</thead>
				<tbody>
					{#each $tournamentsAvailable as tournament, index}
						<tr
							class="h-10 cursor-pointer transition-all hover:backdrop-brightness-110"
							on:click={() => handleOpenTournamentModal(index.toString())}
						>
							<td class="whitespace-no-wrap p-1 text-center">
								{tournament.state}
							</td>
							<td class="whitespace-no-wrap p-1 text-center">
								{tournament.title}
							</td>
							<td class="whitespace-no-wrap p-1 text-center">
								${tournament.totalEntries * tournament.buyIn}
							</td>
							<td class="whitespace-no-wrap p-1 text-center">
								{tournament.playersLeft}/{tournament.totalEntries}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</section>
