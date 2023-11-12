<script>
	import { onMount } from 'svelte';
	import userStore from '$lib/stores/userStore';
	import navItemsStore from '$lib/stores/navItemsStore';
	import navSelectedItemStore from '$lib/stores/navSelectedItemStore';
	import socketStore from '$lib/stores/socketStore';
	import Wrapper from '$lib/components/Wrapper.svelte';
	import Auth from '$lib/components/auth/index.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Lobby from '$lib/components/lobby/index.svelte';
	import Banner from '$lib/components/lobby/Banner.svelte';
	import Table from '$lib/components/table/index.svelte';

	onMount(() => {
		//
	});
</script>

<Wrapper>
	{#if !$userStore}
		<Auth />
	{:else}
		<Banner />
		<Navbar />
		{#each $navItemsStore as { id, name, data }}
			{#if id === $navSelectedItemStore}
				{#if name === 'lobby'}
					<Lobby />
				{:else}
					<Table />
				{/if}
			{/if}
		{/each}
	{/if}
</Wrapper>
