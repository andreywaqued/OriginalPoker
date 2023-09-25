<script>
	import { onMount } from "svelte";

    /**
     * @type {String}
     */
    export let cardString
    /**
     * @type {String}
     */
    export let deck
    // cardString = cardString.replace("cb", "cardback preto")
    $: cardUrl = `url('/baralho/${deck}/${cardString}.png')`
    // onMount(() => {
    //     const setCard = () => {
    //         console.log("settando carta")
    //         document.documentElement.style.setProperty('--card-url', cardUrl);
    //     };
        
    //     // Initial setting
    //     setCard();        
    // });
    $: cssVarStyles = `--card-url:${cardUrl}`
    // console.log(cardUrl)
</script>
<style lang="scss">
    .card {
        background-image: var(--card-url);
        // background-color: green;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        width: 100%;
        height: 100%;
        z-index: 100;
    }
</style>

<div class="card" style="{cssVarStyles}"></div>
