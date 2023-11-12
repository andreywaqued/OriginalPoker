<script>
	import navItemsStore from '$lib/stores/navItemsStore';
	import navSelectedItemStore from '$lib/stores/navSelectedItemStore';

	/**
	 * @param {import('$lib/stores/navSelectedItemStore').ID} id
	 */
	function handleSelected(id) {
		navSelectedItemStore.set(id);
	}
</script>

<div
	class="flex h-10 w-full items-center gap-x-2 overflow-auto border-y-2 border-[rgb(69,69,69)] bg-slate-700 px-2"
>
	{#each $navItemsStore as { id, name, data }}
		<button
			on:click={() => handleSelected(id)}
			class:border-amber-300={$navSelectedItemStore === id}
			class="h-fit rounded border-2 border-amber-300 bg-black px-2 py-1 text-sm font-bold uppercase text-emerald-400"
		>
			<p class="whitespace-nowrap">
				{name}
			</p>
		</button>
	{/each}
</div>
