<script>
	// preload avatars
	const MAX_AVATAR_COUNT = 32
	$: preloadAvatarsUrl = [...Array(MAX_AVATAR_COUNT)].map((_, i) => {
		return `avatar/${i}.png`
	})	
</script>

<svelte:head>
	<link rel="preload" as="image" href='mesa.png' />
	<link rel="preload" as="image" href='fundo.png' />
	<link rel="preload" as="image" href='transitionBackground.png' />
	{#each preloadAvatarsUrl as href}
		<link rel="preload" as="image" {href} />
  {/each}
</svelte:head>
