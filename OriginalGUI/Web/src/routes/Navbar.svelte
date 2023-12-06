<script lang="ts">
	import { user } from '$lib/stores/user';
	import { activeSlot } from '$lib/stores/tabs';
	import { lightningAvailable } from '$lib/stores/games';
	import Card from '$lib/pages/table/Card.svelte';

	function handleSelectSlot(id: string) {
		activeSlot.set(id);
	}
</script>

<div class="flex h-14 w-full items-center gap-x-2 overflow-x-auto bg-gray-darkest px-2">
	{#each Object.entries({ lobby: {}, ...$user?.players }) as [id, player] (id)}
		<button
			on:click={() => handleSelectSlot(id)}
			class:!bg-gray={$activeSlot === id}
			class="relative flex rounded bg-gray-dark px-2 py-1 text-sm font-bold uppercase text-white"
		>
			{#if id === 'lobby'}
				<p class="whitespace-nowrap">Lobby</p>
			{:else}
				<p class="whitespace-nowrap">
					{$lightningAvailable[player.poolID].gameTitle}
				</p>
				{#if id !== $activeSlot}
					{#if player.cards.length > 0}
						<div class="ml-1 grid aspect-video h-5 grid-cols-2">
							{#each player.cards as card}
								<Card cardString={card} deck={'boardDeck'} />
							{/each}
						</div>
					{/if}
					{#if player.possibleActions.length > 0}
						<div class="ml-1 rounded-full border-2 border-amber-700 bg-amber-600 px-1.5 text-xs">
							!
						</div>
					{/if}
				{/if}
			{/if}
		</button>
	{/each}
</div>
