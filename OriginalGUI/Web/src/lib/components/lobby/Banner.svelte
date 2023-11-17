<script>
	import navSelectedItemStore from '$lib/stores/navSelectedItemStore';

	$: isSelected = 'lobby' === $navSelectedItemStore;

	let now = new Date();
	setInterval(() => {
		now = new Date();
	}, 1000 * 1); // seconds
</script>

<div class="flex items-center justify-between p-2 text-white" class:hidden={!isSelected}>
	<img class="h-12 ml-2" src="/logos/OriginalLogoWhite.png" />
	<div class="grid gap-y-2 text-center">
		<p>{now.toLocaleTimeString()}</p>
		<button class="rounded-md bg-zinc-700 px-2 py-0.5">CASHIER</button>
	</div>
</div>
