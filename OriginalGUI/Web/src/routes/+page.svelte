<script>
	import user from '$lib/stores/user';
	import navItems from '$lib/stores/navItems';
	import navSelectedItem from '$lib/stores/navSelectedItem';
	import Wrapper from '$lib/components/Wrapper.svelte';
	import Auth from '$lib/components/auth/index.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Lobby from '$lib/components/lobby/index.svelte';
	import Banner from '$lib/components/lobby/Banner.svelte';
	import socket from '$lib/stores/socket';
	import { onMount } from 'svelte';

	onMount(() => {
		//
	});
</script>

<Wrapper>
	{#if !$user}
		<Auth />
	{:else}
		{#if $navSelectedItem === 'lobby'}
			<Banner />
			<Navbar />
			<Lobby />
		{/if}
		{#if $navSelectedItem === 'table'}
			<Navbar />
		{/if}
	{/if}
</Wrapper>
