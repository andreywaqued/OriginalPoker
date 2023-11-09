<script>
	import navItems from '$lib/stores/navItems';
</script>

<div class="flex h-10 w-full items-center gap-x-2 overflow-auto bg-slate-600 px-2">
	{#each $navItems as item}
		<div class="h-fit rounded-md bg-black px-2 py-1 text-sm font-bold uppercase text-blue-300">
			<p>
				{item}
			</p>
			<p />
		</div>
	{/each}
</div>
