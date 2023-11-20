<script>
	import userStore from '$lib/stores/userStore';
	import navSelectedItemStore from '$lib/stores/navSelectedItemStore';
	import gamesAvailable from '$lib/stores/gamesAvailableStore';

	/**
	 * @param {import('$lib/stores/navSelectedItemStore').ID} id
	 */
	function handleSelected(id) {
		navSelectedItemStore.set(id);
	}
</script>

<div
	class="flex h-14 w-full items-center gap-x-2 overflow-x-auto bg-slate-700 px-2"
>
	{#each Object.entries({ lobby: null, ...$userStore.players }) as [id, player] (id)}
		<button
			on:click={() => handleSelected(id)}
			class:border-amber-300={$navSelectedItemStore === id}
			class="rounded border-2 border-amber-300 bg-black px-2 py-1 text-sm font-bold uppercase text-emerald-400"
		>
			<p class="whitespace-nowrap">
				{#if id === 'lobby'}
					Lobby
				{:else}
					{$gamesAvailable[player.poolID].gameTitle}
				{/if}
			</p>
		</button>
	{/each}
</div>
