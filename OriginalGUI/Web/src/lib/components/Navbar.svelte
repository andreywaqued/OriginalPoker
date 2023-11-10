<script>
	import navItems from '$lib/stores/navItems';
	import navSelectedItem from '$lib/stores/navSelectedItem';
</script>

<div class="flex h-10 w-full items-center gap-x-2 overflow-auto bg-slate-700 px-2 border-y-2 border-[rgb(69,69,69)]">
	{#each $navItems as item}
		<div
			class:border-amber-300={$navSelectedItem === item}
			class="h-fit rounded border-2 border-amber-300 bg-black px-2 py-1 text-sm font-bold uppercase text-emerald-400"
		>
			<p>
				{item}
			</p>
		</div>
	{/each}
</div>
