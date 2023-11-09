<script>
    import { onMount } from 'svelte';
    let api
    let iframe
    onMount(() => {
        if (window.api) {
            api = window.api
        }
    });
    function openExternalUrl() {
        api.send("openExternalUrl", currentAdUrl)
    }
    export let adsIndex = 0
    export const changeAds = () => {
        console.log("changeAds")
        // iframe.src = "https://www.youtube.com/embed/C8kSrkz8Hz8"
        iframe.src = "https://acceptable.a-ads.com/2275881"
        // adsIndex = Math.floor(Math.random() * urls.length)
    }
    const images = [
        "onfire proporção.png",
        "jbl wave.png",
        "monitor gamer.png",
        "moob cadeira.png",
        "SUITS.png",
    ]
    const urls = [
        "https://wa.me/5567999755676",
        "https://www.amazon.com.br/Fones-ouvido-JBL-Wave-Buds/dp/B0BHDRW1DJ/ref=sr_1_30?crid=17T8BQGWFZ1TZ&keywords=fone+de+ouvido+bluetooth&qid=1696690494&sprefix=fone+de+ouvido%2Caps%2C224&sr=8-30&ufe=app_do%3Aamzn1.fos.db68964d-7c0e-4bb2-a95c-e5cb9e32eb12",
        "https://www.amazon.com.br/Monitor-Gamer-AOC-SPEED-75Hz/dp/B08TMTQH9H/ref=sr_1_11?__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=7I89CUXI7OED&keywords=monitor&qid=1696691981&sprefix=monitor%2Caps%2C224&sr=8-11&ufe=app_do%3Aamzn1.fos.25548f35-0de7-44b3-b28e-0f56f3f96147",
        "https://www.amazon.com.br/Cadeira-Gamer-Gt-Racer-Preto/dp/B083M7KDYX/ref=sr_1_11?__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=3BPR5G6TES3T1&keywords=cadeira%2Bgamer&qid=1696691991&sprefix=cadeira%2Bgame%2Caps%2C277&sr=8-11&ufe=app_do%3Aamzn1.fos.25548f35-0de7-44b3-b28e-0f56f3f96147&th=1",
        "https://www.suitspokerteam.com.br",
    ]
    $: currentAdUrl = urls[adsIndex]
    $: currentAdImageUrl = images[adsIndex]
    $: adsImageUrl = `--ads-image-url:url('../../../anunciantes/${currentAdImageUrl}');`;
</script>

<div class="adsDiv">
    
    <!-- <div class="adsImage" style={adsImageUrl} on:click={openExternalUrl}> -->
    <div class="adsImage">
        <iframe bind:this={iframe} data-aa='2275881' src='https://acceptable.a-ads.com/2275881' style='border:0px; padding:0; width:100%; height:100%; overflow:hidden; background-color: transparent;'></iframe>
        <!-- <iframe data-aa='2275881' src='https://ad.a-ads.com/2275881?size=320x100' style='width:100%; height:100%; border:0px; padding:0; overflow:hidden; background-color: transparent;'></iframe> -->
    </div>
</div>
<style>
    .adsDiv {
        width: 100%;
        height: 100%;
        /* z-index: 100; */
        border-radius: 5px;
        /* border: 1px solid black; */
        /* padding: 1%; */
        /* background-color: rgba(255,255,255, 0.5); */
        background-color: black;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .adsImage {
        /* background-image: var(--ads-image-url); */
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 5px;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }
</style>