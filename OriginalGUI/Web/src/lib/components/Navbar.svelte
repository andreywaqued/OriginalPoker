<script>
	import userStore from '$lib/stores/userStore';
	import navSelectedItemStore from '$lib/stores/navSelectedItemStore';
	import gamesAvailable from '$lib/stores/gamesAvailableStore';
	import Card from '$lib/components/table/Card.svelte';

	/**
	 * @param {import('$lib/stores/navSelectedItemStore').ID} id
	 */
	function handleSelected(id) {
		navSelectedItemStore.set(id);
	}
</script>

<div class="flex h-14 w-full items-center gap-x-2 overflow-x-auto bg-gray-darkest px-2">
	{#each Object.entries({ lobby: {}, ...$userStore?.players }) as [id, player] (id)}
		<button
			on:click={() => handleSelected(id)}
			class:!bg-gray={$navSelectedItemStore === id}
			class="relative rounded bg-gray-dark px-2 py-1 text-sm font-bold uppercase text-white flex"
		>
			{#if id === 'lobby'}
				<p class="whitespace-nowrap">Lobby</p>
			{:else}
				{#if player.possibleActions.length > 0 && id !== $navSelectedItemStore }
					<div class="rounded-full border-2 border-amber-700 bg-amber-600 px-1.5 text-xs mr-1">!</div>
				{/if}
				{#if player.cards.length > 0 && id !== $navSelectedItemStore}
					<div class="grid aspect-video h-5 grid-cols-2 mr-1">
						{#each player.cards as card}
							<Card cardString={card} deck={'boardDeck'} />
						{/each}
					</div>
        {/if}
				<p class="whitespace-nowrap">
					{$gamesAvailable[player.poolID].gameTitle}
				</p>
			{/if}
		</button>
	{/each}
</div>
