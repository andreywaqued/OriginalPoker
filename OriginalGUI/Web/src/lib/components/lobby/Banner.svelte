<script>
	import navSelectedItemStore from '$lib/stores/navSelectedItemStore';
	import userStore from '$lib/stores/userStore';

	$: isSelected = 'lobby' === $navSelectedItemStore;

	let now = new Date();
	setInterval(() => {
		now = new Date();
	}, 1000 * 1); // seconds
</script>

<div class="flex items-center w-full justify-between px-2 py-5 text-white bg-gray-darkest bg-gradient-to-b from-gray" class:hidden={!isSelected}>
	<div class="ml-2 h-12">
		<img class="w-full h-full" src="/logos/OriginalLogoWhite.png" />
	</div>
	<div class="grid text-center w-32">
		<p class="text-2xl">{now.toLocaleTimeString(undefined, {hour: "2-digit", minute: "2-digit"})}</p>
		<!--<button class="rounded-md bg-zinc-700 px-2 py-0.5">CASHIER</button>-->
		<div class="bg-gray-light px-2 text-sm rounded-full relative shadow font-bold tracking-wider">
			<p class="text-right">{$userStore?.balance.toFixed(2)}</p>
			<img class="absolute h-7 w-7 top-1/2 -left-1 -translate-y-1/2" src="/ficha.png" />
		</div>
	</div>
</div>
