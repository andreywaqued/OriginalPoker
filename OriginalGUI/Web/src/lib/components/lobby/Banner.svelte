<script>
	import navSelectedItemStore from '$lib/stores/navSelectedItemStore';
	import userStore from '$lib/stores/userStore';

	$: isSelected = 'lobby' === $navSelectedItemStore;

	let now = new Date();
	setInterval(() => {
		now = new Date();
	}, 1000 * 1); // seconds
</script>

<div class="flex items-center justify-between p-2 text-white" class:hidden={!isSelected}>
	<img class="ml-2 h-12" src="/logos/OriginalLogoWhite.png" />
	<div class="grid text-center">
		<p>{now.toLocaleTimeString()}</p>
		<!--<button class="rounded-md bg-zinc-700 px-2 py-0.5">CASHIER</button>-->
		<p class="font-bold">{$userStore?.name}</p>
		<p>${$userStore?.balance}</p>
	</div>
</div>
