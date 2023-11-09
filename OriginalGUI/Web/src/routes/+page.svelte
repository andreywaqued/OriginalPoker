<script>
	import { onDestroy, onMount } from 'svelte';
	import { socket, user, navItems, navSelectedItem } from '$lib/stores';
	import { connectWebSocket } from '$lib/services/WebSocketService';
	import Main from '$lib/components/Main.svelte';
	import Auth from '$lib/components/auth/index.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Lobby from '$lib/components/lobby/index.svelte';
	import Banner from '$lib/components/lobby/Banner.svelte';

	onMount(() => {
		socket.set(connectWebSocket());
	});
	onDestroy(() => {
		$socket?.disconnect();
	});
</script>

<Main>
	{#if !$user}
		<Auth />
	{:else}
		{#if $navSelectedItem === "lobby"}
			<Banner />
			<Navbar />
			<Lobby />
		{:else}
			<Navbar />
			<!--<Table />-->
    {/if}
	{/if}
</Main>
