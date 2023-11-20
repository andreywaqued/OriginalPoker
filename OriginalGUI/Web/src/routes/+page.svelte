<script>
	import socket from '$lib/services/socket';
	import userStore from '$lib/stores/userStore';
	import navItemsStore from '$lib/stores/navItemsStore';
	import navSelectedItemStore from '$lib/stores/navSelectedItemStore';
	import Wrapper from '$lib/components/Wrapper.svelte';
	import Auth from '$lib/components/auth/index.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Lobby from '$lib/components/lobby/index.svelte';
	import Banner from '$lib/components/lobby/Banner.svelte';
	import Table from '$lib/components/table/index.svelte';

	socket.on('updateUserInfo', ({ user, status }) => {
		console.log('updateUserInfo');
		console.log(user);
		if (status === 200) {
			userStore.set({
				name: user.name,
				balance: Math.round(user.balance * 100) / 100,
				avatar: user.avatar,
				email: user.email,
				settings: user.settings,
				players: user.players
			});
		}
	});

	navSelectedItemStore.set('lobby');
</script>

<Wrapper>
	{#if !$userStore}
		<Auth />
	{:else}
		<Banner />
		<Navbar />
		<Lobby />
		{#each Object.entries($userStore.players) as [id, player] (id)}
			<Table hero={player} />
		{/each}
	{/if}
</Wrapper>
