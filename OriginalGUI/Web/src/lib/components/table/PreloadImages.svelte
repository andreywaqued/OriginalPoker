<script>
	const decks = ['boardDeck', 'playerDeck'];
	const cards = [
		'AS',
		'AH',
		'AC',
		'AD',
		'KS',
		'KH',
		'KC',
		'KD',
		'QS',
		'QH',
		'QC',
		'QD',
		'JS',
		'JH',
		'JC',
		'JD',
		'TS',
		'TH',
		'TC',
		'TD',
		'9S',
		'9H',
		'9C',
		'9D',
		'8S',
		'8H',
		'8C',
		'8D',
		'7S',
		'7H',
		'7C',
		'7D',
		'6S',
		'6H',
		'6C',
		'6D',
		'5S',
		'5H',
		'5C',
		'5D',
		'4S',
		'4H',
		'4C',
		'4D',
		'3S',
		'3H',
		'3C',
		'3D',
		'2S',
		'2H',
		'2C',
		'2D'
	];

	/** @type Array<*> */
	let preloadCardsUrls = [];
	for (const deck of decks) {
		for (let card of cards) {
			// convert last letter to lowercase (playerCards works like that)
			if (deck === 'playerDeck') {
				const lastLetterLowerCase = card.slice(-1).toLowerCase();
				card = card.slice(0, -1) + lastLetterLowerCase; 
			}
			preloadCardsUrls = [...preloadCardsUrls, `baralho/${deck}/${card}.png`];
		}
	}
</script>

<svelte:head>
	{#each preloadCardsUrls as href}
		<link rel="preload" as="image" {href} />
	{/each}
</svelte:head>
