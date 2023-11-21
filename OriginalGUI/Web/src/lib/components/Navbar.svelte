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
	class="flex h-14 w-full items-center gap-x-2 overflow-x-auto bg-gray-darkest px-2"
>
	{#each Object.entries({ lobby: null, ...$userStore.players }) as [id, player] (id)}
		<button
			on:click={() => handleSelected(id)}
			class:!bg-gray={$navSelectedItemStore === id}
			class="rounded bg-gray-dark px-2 py-1 text-sm font-bold uppercase text-white"
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
