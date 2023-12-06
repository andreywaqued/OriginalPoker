<script>
	import socket from '$lib/services/socket';
	import { user } from '$lib/stores/user';
	import { navSelectedItem } from '$lib/stores/tabs';
	import Wrapper from '$lib/components/Wrapper.svelte';
	import Auth from '$lib/components/auth/index.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Lobby from '$lib/components/lobby/index.svelte';
	import Banner from '$lib/components/lobby/Banner.svelte';
	import Table from '$lib/components/table/index.svelte';

	socket.on('updateUserInfo', ({ user: updatedUser, status }) => {
		console.log('updateUserInfo');
		console.log(updatedUser);
		if (status === 200) {
			user.set({
				name: updatedUser.name,
				balance: Math.round(updatedUser.balance * 100) / 100,
				avatar: updatedUser.avatar,
				email: updatedUser.email,
				settings: updatedUser.settings,
				players: updatedUser.players
			});
		}
	});

	navSelectedItem.set('lobby');
</script>

<Wrapper>
	{#if !$user}
		<Auth />
	{:else}
		<Banner />
		<Navbar />
		{#each Object.entries({ lobby: {}, ...$user?.players }) as [id, player] (id)}
			{#if id === 'lobby'}
				<Lobby />
			{:else}
				<Table hero={player} />
			{/if}
		{/each}
	{/if}
</Wrapper>
