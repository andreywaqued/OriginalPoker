<script>
	import { activeSlot } from '$lib/stores/tabs';
	import { user } from '$lib/stores/user';

	$: isSelected = 'lobby' === $activeSlot;

	let now = new Date();
	setInterval(() => {
		now = new Date();
	}, 1000 * 1); // seconds
</script>

<div
	class="flex w-full items-center justify-between bg-gray-darkest bg-gradient-to-b from-gray px-2 py-5 text-white"
	class:hidden={!isSelected}
>
	<div class="ml-2 h-12">
		<img class="h-full w-full" src="/logos/OriginalLogoWhite.png" />
	</div>
	<div class="grid w-32 text-center">
		<p class="text-2xl">
			{now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
		</p>
		<!--<button class="rounded-md bg-zinc-700 px-2 py-0.5">CASHIER</button>-->
		<div class="relative rounded-full bg-gray-light px-2 text-sm font-bold tracking-wider shadow">
			<p class="text-right">{$user?.balance.toFixed(2)}</p>
			<img class="absolute -left-1 top-1/2 h-7 w-7 -translate-y-1/2" src="/ficha.png" />
		</div>
	</div>
</div>
