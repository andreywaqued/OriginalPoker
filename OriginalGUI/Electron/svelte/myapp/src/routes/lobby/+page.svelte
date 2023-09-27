<script >
    export const ssr = false;
	import Ads from "$lib/Ads.svelte";
	import Login from "$lib/Login.svelte";
    import TitleBar from "$lib/Title_Bar.svelte";
    import { onMount } from 'svelte';
    let winHeight = 0;
    let displaySize
    let api
    let balanceHidden = false;
    let tabSelected = 0
    let tabSelectionTitles = ["LIGHTNING CASH", "VORTEX SNG", "INSTANT TOURNEYS"]
    let userName, userBalance, userAvatar
    let userLoggedIn = false
   
    let gamesAvaiable = {
        "lightning1" : {gameTitle: "NL 10", blinds: "$0.05 / $0.10", players: 125, minBuyIn: "$2.00", maxBuyIn: "10.00"},
        "lightning2" : {gameTitle: "NL 50", blinds: "$0.25 / $0.50", players: 85, minBuyIn: "$10.00", maxBuyIn: "50.00"},
        "lightning3" : {gameTitle: "NL 100", blinds: "$0.50 / $1.00", players: 35, minBuyIn: "$20.00", maxBuyIn: "100.00"},
        "lightning4" : {gameTitle: "NL 200", blinds: "$1.00 / $2.00", players: 1025, minBuyIn: "$40.00", maxBuyIn: "200.00"}
    }
    let menuIndexSelected = 0
    let menuItens = ["games", "profile", "settings"]
    let svgMenuColorSelected = "#0080ff"
    let svgMenuColor = "white"

    onMount(() => {
        const setHeight = () => {
        document.documentElement.style.setProperty('--window-height', `${window.innerHeight}px`);
        winHeight = window.innerHeight
        };
        
        // Initial setting
        setHeight();
        
        // Update on resize
        window.addEventListener('resize', setHeight);
        // alert("asd")
        if (window.api) {
            // alert("api loaded")
            api = window.api
            console.log(api)
            api.on("updateUser", (user) => {
                console.log("updateUser")
                console.log(user)
                userName = user.name
                userBalance = user.balance
                userAvatar = user.avatar
                userLoggedIn = true
            });
            api.on("updatePools", (pools) => {
                let newGamesAvaiable = {...gamesAvaiable}
                Object.keys(pools).forEach(key => {
                    const pool = pools[key]
                    const gamePool = newGamesAvaiable[key]
                    gamePool.gameTitle = pool.gameTitle
                    gamePool.blinds = `$${pool.sb} / $${pool.bb}`
                    gamePool.minBuyIn = `$${pool.minBuyIn}`
                    gamePool.maxBuyIn = `$${pool.maxBuyIn}`
                    gamePool.blinds = `$${pool.sb} / $${pool.bb}`
                    gamePool.players = pool.currentPlayers
                })
                gamesAvaiable = newGamesAvaiable
            })
            // displaySize = window.api.getDisplaySize()
            api.send("window-ready")
        }
        // alert(window.api.getDisplaySize())
    });

    function toggleBalanceView() {
        balanceHidden = !balanceHidden
    }

    /**
     * 
     * @param {number} index
     */
    function selectTab(index) {
        tabSelected = index
    }
    /**
     * 
     * @param {number} index
     */
    function selectMenu(index) {
        menuIndexSelected = index
    }
    /**
     * 
     * @param {String} tableName
     */
    function openNewTable(poolID) {
        api.send("open-new-table", poolID)
    }
    
    let doordashClass = "doordashDiv hide"
    let doordashDivShow = false;
    function changeDoordashClass(index) {
        // console.log("entrou aqui")
        if (index === 2) doordashDivShow = !doordashDivShow
        // if (doordashClass.includes("hide")) {
        //     doordashClass = "doordashDiv"}
        // else {
        //     doordashClass = "doordashDiv hide"
        // }
        // // if (doordashClass === "doordashDiv hide") 
        // console.log(doordashDivShow)
    }
    $: avatarUrl = `url('../../../avatar/${userAvatar}.png')`
    $: cssVarStyles = `--avatar-url:${avatarUrl};`;
</script>

<style lang="scss">
    :root {
        --top: 20px;
        -webkit-user-select: none;
        --height: var(--window-height);
        --root-font-size: calc(var(--height) * 0.03);
        font-size: var(--root-font-size);
        font-family: 'Roboto', sans-serif;
    }
    main {
        background-color: black;
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        // border-radius: 5px;
    }
    .mainDiv {
        background-color: black;
        box-sizing: border-box;
        color:whitesmoke;
        position: relative;
        width: 100%;
        height: calc(100% - var(--top));
        top: var(--top);
        display: flex;
        flex-direction: column;
        // border: 1px solid blue;
    }
    .playerInfo {
        width: 100%;
        height: 15%;
        display: flex;
        flex-direction: row;
        gap: 1%;
        background: linear-gradient(rgba(255,255,255, 0.2), rgba(255,255,255, 0) 80%);
        background-size: contain;
        background-position: center;
        
        .logo {
            padding: 2%;
            width: 55%;
            // background-color: blue;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
        .player {
            position: relative;
            width: 14%;
            .playerAvatar {
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
                // width: 100%;
                height: 90%;
                margin: 2%;
                aspect-ratio: 1;
                background-image: var(--avatar-url);
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
                background-color: rgba(255,255,255,0.1);
                // z-index: 10;
                border-radius: 50%;
                // border: 1px solid white;
            }
            .playerName {
                position: absolute;
                width: 78%;
                height: 20%;
                bottom: 5%;
                background-color: rgba(35,35,35,1);
                z-index: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 0.5em;
                border-radius: 5px;
                border: 1px solid rgba(65,65,65,1);
            }
        }
        .cashier {
            height: 100%;
            width: 14%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            button {
                background: linear-gradient(rgb(60,60,60) 00%, rgb(40,40,40)50%);
                width: 100%;
                height: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 5px;
            }
            .balance {
                position: relative;
                height: 20%;
                font-size: 0.6em;
                width: 90%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: rgb(30,30,30);
                border-bottom-left-radius: 5px;
                border-bottom-right-radius: 5px;
                .hideBalance {
                    position: absolute;
                    right: 5%;
                }
            }
        }
        .clock {
            height: 100%;
            width: 14%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            font-size: 1.5em;
            .timezone {
                font-size: 0.5em;
                justify-self: flex-end;
                transform: translateY(30%);
                color: rgba(255, 255, 255, 0.5)
            }
        }
        
    }
    .balance:before {
        content: "$";
        font-size: 0.9em;
    }
    .main {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 85%;
        // background-color: yellow;
    }
    .menu {
        display: flex;
        flex-direction: column;
        width: 10%;
        height: 100%;
        gap: 1%;
        .menuItem {
            position: relative;
            display: flex;
            justify-content: center;
            width: 100%;
            height: 10%;
            align-items: center;
            font-size: 0.8em;
        }
    }
    .menuItem.selected {
        color: rgb(79,148,217);
    }
    .menuItem.selected:after {
        content: "";
        position: absolute;
        top: 100%;
        width: 40%;
        height: 1px;
        background-color: rgba(255, 255, 255, 0.5);
        z-index: 100;
    }
    .tabSelection.selected {
        color: white !important;
    }
    .tabSelection.selected:after {
        content: "";
        position: absolute;
        top: 100%;
        left: 40%;
        width: 20%;
        height: 10%;
        background-color: rgb(79,148,217);
        z-index: 100;
    }
    .gameDiv {
        display: flex;
        flex-direction: column;
        width: 90%;
        height: 100%;
        padding: 2% 3%;
        background-color: rgb(24, 24, 24);
        // background-color: blue;
    }
    .gameSelection {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 14%;
        justify-content: center;
        align-items: flex-start;
        // padding-top: 3%;
        gap: 5%;
        .tabSelection {
            position: relative;
            font-size: 0.9em;
            color: rgba(255, 255, 255, 0.15);
            letter-spacing: 0.1em;
        }
    }
    .gamesAvaiable {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 60%;
        gap: 3%;
        // padding: 0 3%;
    }
    .wrapper {
        position: relative;
        width: 100%;
        height: 75%;
        z-index: 1;
    }
    .gameSelector {
        height: 100%;
        width: 100%;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        border: 1px solid rgb(64,64,64);
        box-shadow: 0 2px 4px black ;
        z-index: 10;
        background-color: rgb(49,49,49);
        z-index: 20;
        .gameTitle {
            width: 100%;
            height: 20%;
            font-size: 1.5em;
            font-weight: bold;
            // background-color: yellow;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .gameInfo {
            position: relative;
            width: 100%;
            height: 60%;
            // background-color: green;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            .blinds {
                position: relative;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .players {
                position: relative;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .buyInRow {
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                align-items: center;
                .buyIn {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
        .buttonDiv {
            width: 100%;
            height: 20%;
            // background-color: red;
            display: flex;
            justify-content: center;
            align-items: center;
            button {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 80%;
                height: 60%;
                font-size: 0.6em;
                font-weight: bold;
                background-color: rgb(79,148,217);
                border-radius: 5px;
            }
        }
    }
    .blinds:before {
        position: absolute;
        content: "BLINDS";
        // background-color: blue;
        top: -50%;
        font-size: 0.6em;
        color: rgba(255, 255, 255, 0.3);
        letter-spacing: 0.1em;
    }
    .players:before {
        position: absolute;
        content: "PLAYERS";
        // background-color: blue;
        top: -50%;
        font-size: 0.6em;
        color: rgba(255, 255, 255, 0.3);
        letter-spacing: 0.1em;
    }
    .minBuyIn:before {
        position: absolute;
        content: "MIN";
        // background-color: blue;
        top: -50%;
        font-size: 0.6em;
        color: rgba(255, 255, 255, 0.3);
        letter-spacing: 0.1em;
    }
    .maxBuyIn:before {
        position: absolute;
        content: "MAX";
        // background-color: blue;
        top: -50%;
        font-size: 0.6em;
        color: rgba(255, 255, 255, 0.3);
        letter-spacing: 0.1em;
    }
    .gameInfo:before {
        content: "";
        position: absolute;
        top: 0;
        width: 90%;
        height: 1px;
        background-color: rgba(78, 78, 78);
        z-index: 100;
    }
    .gameInfo:after {
        content: "";
        position: absolute;
        top: 100%;
        width: 90%;
        height: 1px;
        background-color: rgba(78, 78, 78);
        // background-color: rgba(255, 255, 255, 0.5);
        z-index: 100;
    }
    .adsDiv {
        display: flex;
        justify-content: center;
        align-items: center;
        // padding: 3%;
        width: 100%;
        height: 20%;
    }
    button {
        all:unset;
    }
    button:active {
        transform: scale(0.95);
    }
    .avaiableSoonDiv {
        display: flex;
        width: 100%;
        height: 75%;
        justify-content: center;
        align-items: center;
    }
    .doordashDiv {
        position: absolute;
        height: 15%;
        width: 80%;
        background: red;
        margin-left: 10%;
        top: -10%;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        display: flex;
        flex-direction: column;
        // justify-content: center;
        align-items: center;
        // box-shadow: 0 2px 4px black;
        padding-top: 2%;
        z-index: -1;
        transition: top 0.5s;
        // animation-name: goDown;
        // animation-duration: 0.5s;
        .doordashLogo {
            width: 80%;
            height: 50%;
            // margin-top: 1%;
            background: url('/doordash-logo-white.png');
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            // background-color: blue;
        }
        .doordashInfo {
            width: 100%;
            height: 50%;
            // background-color: yellow;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
                font-size: 0.6em;
            }
        }
        // box-shadow: 0 1px blue;
        // background-color: blue;
    }
    .doordashDiv.show {
        top: -16%;
    }
    
</style>

<main>
    <svelte:component this={TitleBar} winTitle="Main Lobby"/>
    
    <div class="mainDiv">
        {#if !userLoggedIn}
            <Login/>
        {:else}
            <div class="playerInfo">
                <div class="logo"><svg xmlns="http://www.w3.org/2000/svg" height="70%" viewBox="0 0 809.523 128.965">
                    <g id="Grupo_438" data-name="Grupo 438" transform="translate(-2649 590.324)">
                    <path id="Forma_834_1" data-name="Forma 834 1" d="M127.134,122.9H81.588a39.015,39.015,0,0,1-9.643-9.771,40.743,40.743,0,0,1-6.466-16.478,26.19,26.19,0,0,0,4.179,2.194,26.605,26.605,0,0,0,10.152,2.194,19.863,19.863,0,0,0,12.547-4.388A14.814,14.814,0,0,0,98.2,84.483c.022-8.724-6.023-18.185-10.4-21.66-3.132-2.49-8.84-8.379-13.882-14.322-2.713-3.2-5.07-6.22-6.816-8.739-2.005-2.893-3.2-5.1-3.558-6.568-.068-.54-.1-.815-.109-.819s0,0,0,0,0,.008,0,.011v0h0c0-.006,0-.01,0-.014a.009.009,0,0,0,0,0s-.02.107-.115.856a23.51,23.51,0,0,1-3.58,6.577c-1.75,2.517-4.11,5.534-6.826,8.727-5.038,5.922-10.745,11.8-13.878,14.288-4.373,3.475-10.419,12.936-10.4,21.66A14.815,14.815,0,0,0,34.48,96.645a19.872,19.872,0,0,0,12.551,4.388A26.62,26.62,0,0,0,57.187,98.84a26.276,26.276,0,0,0,4.18-2.194A40.738,40.738,0,0,1,54.9,113.124a39.023,39.023,0,0,1-9.646,9.772H0L50.105,0H77.159l49.975,122.9Z" transform="translate(3241.107 -587.714)" fill="#fff"/>
                    <path id="Caminho_3" data-name="Caminho 3" d="M-8.712,93.249H76.112V68.432H24.241V-28.8H-8.712Z" transform="translate(3382.411 -558.066)" fill="#fff"/>
                    <path id="Caminho_2" data-name="Caminho 2" d="M-1.983,99.349c37.225,0,67.33-27.054,67.33-64.482S35.242-29.616-1.983-29.616c-37.428,0-67.737,27.054-67.737,64.482S-39.411,99.349-1.983,99.349Zm0-25.834c-20.545,0-32.75-15.256-32.75-38.649s12.2-38.649,32.75-38.649c20.341,0,32.343,15.256,32.343,38.649S18.359,73.515-1.983,73.515Zm166.19,23.8a62.846,62.846,0,0,0,17.7-2.848V74.532a17.533,17.533,0,0,1-7.12,1.22c-7.933,0-12.815-3.255-17.7-12.408L147.73,45.851c15.256-4.679,24.206-17.9,24.206-34.377,0-19.731-12.815-37.632-42.514-37.632H73.891V95.891h32.953V48.9h10.984l9.764,23.393C135.729,91.619,148.544,97.315,164.207,97.315ZM106.844,27.95V-4.393h14.239c12.612,0,18.307,5.7,18.307,16.273,0,10.374-5.7,16.07-18.307,16.07Zm85.027,67.941h32.953V-26.158H191.871Zm108.217,3.458c25.02,0,45.158-8.34,52.278-11.391V29.578H303.343V52.36h18.1V72.5a38.608,38.608,0,0,1-16.273,3.255c-20.748,0-35.394-14.036-35.394-38.852,0-25.834,15.46-39.666,38.039-39.666,17.29,0,29.088,6.1,39.462,14.239V-16.6c-10.171-7.73-27.461-12.2-44.344-12.2-36,0-67.737,24.206-67.737,63.669S264.9,99.349,300.088,99.349Zm62.448-3.458H395.49V-26.158H362.536Zm43.124,0h29.088V25.713l55.329,70.178H515.1V-26.158H486.009V44.02L430.68-26.158H405.66Z" transform="translate(2718.72 -560.708)" fill="#fff"/>
                    </g>
                </svg></div>
                <div class="player">
                    <div class="playerAvatar" style={cssVarStyles}></div>
                    <div class="playerName"><span>{userName}</span></div>
                </div>
                <div class="cashier">
                    <button>CASHIER</button>
                    <div class="balance" on:click={toggleBalanceView}>
                        {#if !balanceHidden}
                            <span>{userBalance}</span>
                            <span class="hideBalance">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="0.8em" viewBox="0 0 45 36">
                                    <path id="Icon_awesome-eye-slash" data-name="Icon awesome-eye-slash" fill="rgb(255,255,255)" d="M22.5,28.125a10.087,10.087,0,0,1-10.048-9.359l-7.376-5.7a23.435,23.435,0,0,0-2.582,3.909,2.275,2.275,0,0,0,0,2.052A22.552,22.552,0,0,0,22.5,31.5a21.84,21.84,0,0,0,5.477-.735l-3.649-2.823a10.134,10.134,0,0,1-1.828.184ZM44.565,32.21,36.792,26.2a23.291,23.291,0,0,0,5.713-7.177,2.275,2.275,0,0,0,0-2.052A22.552,22.552,0,0,0,22.5,4.5,21.667,21.667,0,0,0,12.142,7.151L3.2.237a1.125,1.125,0,0,0-1.579.2L.237,2.211a1.125,1.125,0,0,0,.2,1.579L41.8,35.763a1.125,1.125,0,0,0,1.579-.2l1.381-1.777a1.125,1.125,0,0,0-.2-1.579ZM31.648,22.226,28.884,20.09a6.663,6.663,0,0,0-8.164-8.573,3.35,3.35,0,0,1,.655,1.984,3.279,3.279,0,0,1-.108.7l-5.176-4A10.006,10.006,0,0,1,22.5,7.875,10.119,10.119,0,0,1,32.625,18a9.885,9.885,0,0,1-.977,4.226Z" transform="translate(0 0)"/>
                                </svg>
                            </span>
                            
                        {:else}
                            <span>----------------</span>
                            <span class="hideBalance">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="0.8em" viewBox="0 0 40.5 27">
                                    <path id="Icon_awesome-eye" data-name="Icon awesome-eye" fill="rgb(255,255,255)" d="M40.255,16.973A22.552,22.552,0,0,0,20.25,4.5,22.555,22.555,0,0,0,.245,16.974a2.275,2.275,0,0,0,0,2.052A22.552,22.552,0,0,0,20.25,31.5,22.555,22.555,0,0,0,40.255,19.026,2.275,2.275,0,0,0,40.255,16.973ZM20.25,28.125A10.125,10.125,0,1,1,30.375,18,10.125,10.125,0,0,1,20.25,28.125Zm0-16.875a6.7,6.7,0,0,0-1.78.266,3.364,3.364,0,0,1-4.7,4.7,6.735,6.735,0,1,0,6.484-4.97Z" transform="translate(0 -4.5)"/>
                                </svg>
                            </span>
                        {/if}
                    </div>
                </div>
                <div class="clock">
                    <span>13:32</span>
                    <span class="timezone">ET</span>
                </div>
            </div>
            <div class="main">
                <div class="menu">
                    {#each menuItens as menuItem, index}
                        <button class="menuItem" class:menuItem class:selected={index === menuIndexSelected} on:click={() => selectMenu(index)}>
                            {#if index === 0}
                                {#if index === menuIndexSelected}
                                    <svg id="Componente_5_2" data-name="Componente 5 – 2" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.65em" viewBox="0 0 29.907 32.117">
                                        <g id="Retângulo_60" data-name="Retângulo 60" transform="matrix(0.995, 0.105, -0.105, 0.995, 9.997, 0)" fill="none" stroke={svgMenuColorSelected} stroke-width="2">
                                        <rect width="20.02" height="27.792" rx="4" stroke="none"/>
                                        <rect x="1" y="1" width="18.02" height="25.792" rx="3" fill="none"/>
                                        </g>
                                        <g id="Caminho_14" data-name="Caminho 14" transform="translate(0 5.586) rotate(-8)">
                                        <path d="M 16.01948165893555 25.79173469543457 L 4.000001907348633 25.79173469543457 C 2.345791816711426 25.79173469543457 1.000001788139343 24.44594573974609 1.000001788139343 22.79173469543457 L 1.000001788139343 3.999995470046997 C 1.000001788139343 2.345795392990112 2.345791816711426 1.000005483627319 4.000001907348633 1.000005483627319 L 16.01948165893555 1.000005483627319 C 17.67369270324707 1.000005483627319 19.01948165893555 2.345795392990112 19.01948165893555 3.999995470046997 L 19.01948165893555 22.79173469543457 C 19.01948165893555 24.44594573974609 17.67369270324707 25.79173469543457 16.01948165893555 25.79173469543457 Z" stroke="none"/>
                                        <path d="M 4.000001907348633 1.999996185302734 C 2.897201538085938 1.999996185302734 2.000001907348633 2.897195816040039 2.000001907348633 3.999996185302734 L 2.000001907348633 22.79173469543457 C 2.000001907348633 23.89453506469727 2.897201538085938 24.79172515869141 4.000001907348633 24.79172515869141 L 16.01948165893555 24.79172515869141 C 17.12228202819824 24.79172515869141 18.01948165893555 23.89453506469727 18.01948165893555 22.79173469543457 L 18.01948165893555 3.999996185302734 C 18.01948165893555 2.897195816040039 17.12228202819824 1.999996185302734 16.01948165893555 1.999996185302734 L 4.000001907348633 1.999996185302734 M 4.000001907348633 -3.814697265625e-06 L 16.01948165893555 -3.814697265625e-06 C 18.22862243652344 -3.814697265625e-06 20.01948165893555 1.790864944458008 20.01948165893555 3.999996185302734 L 20.01948165893555 22.79173469543457 C 20.01948165893555 25.0008659362793 18.22862243652344 26.79172515869141 16.01948165893555 26.79172515869141 L 4.000001907348633 26.79172515869141 C 1.790861129760742 26.79172515869141 1.9073486328125e-06 25.0008659362793 1.9073486328125e-06 22.79173469543457 L 1.9073486328125e-06 3.999996185302734 C 1.9073486328125e-06 1.790864944458008 1.790861129760742 -3.814697265625e-06 4.000001907348633 -3.814697265625e-06 Z" stroke="none" fill={svgMenuColorSelected}/>
                                        </g>
                                        <g id="Grupo_88" data-name="Grupo 88" transform="translate(6 13.152) rotate(-8)">
                                        <ellipse id="Elipse_12" data-name="Elipse 12" cx="2.591" cy="2.591" rx="2.591" ry="2.591" transform="translate(2.267 0)" fill={svgMenuColorSelected}/>
                                        <ellipse id="Elipse_13" data-name="Elipse 13" cx="2.591" cy="2.591" rx="2.591" ry="2.591" transform="translate(0 3.886)" fill={svgMenuColorSelected}/>
                                        <ellipse id="Elipse_14" data-name="Elipse 14" cx="2.591" cy="2.591" rx="2.591" ry="2.591" transform="translate(4.533 3.886)" fill={svgMenuColorSelected}/>
                                        <path id="Polígono_1" data-name="Polígono 1" d="M.971,0l.971,3.238H0Z" transform="translate(3.886 6.476)" fill={svgMenuColorSelected}/>
                                        </g>
                                    </svg>
                                {:else}
                                    <svg id="Componente_5_2" data-name="Componente 5 – 2" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.65em" viewBox="0 0 29.907 32.117">
                                        <g id="Retângulo_60" data-name="Retângulo 60" transform="matrix(0.995, 0.105, -0.105, 0.995, 9.997, 0)" fill="none" stroke={svgMenuColor} stroke-width="2">
                                        <rect width="20.02" height="27.792" rx="4" stroke="none"/>
                                        <rect x="1" y="1" width="18.02" height="25.792" rx="3" fill="none"/>
                                        </g>
                                        <g id="Caminho_14" data-name="Caminho 14" transform="translate(0 5.586) rotate(-8)">
                                        <path d="M 16.01948165893555 25.79173469543457 L 4.000001907348633 25.79173469543457 C 2.345791816711426 25.79173469543457 1.000001788139343 24.44594573974609 1.000001788139343 22.79173469543457 L 1.000001788139343 3.999995470046997 C 1.000001788139343 2.345795392990112 2.345791816711426 1.000005483627319 4.000001907348633 1.000005483627319 L 16.01948165893555 1.000005483627319 C 17.67369270324707 1.000005483627319 19.01948165893555 2.345795392990112 19.01948165893555 3.999995470046997 L 19.01948165893555 22.79173469543457 C 19.01948165893555 24.44594573974609 17.67369270324707 25.79173469543457 16.01948165893555 25.79173469543457 Z" stroke="none"/>
                                        <path d="M 4.000001907348633 1.999996185302734 C 2.897201538085938 1.999996185302734 2.000001907348633 2.897195816040039 2.000001907348633 3.999996185302734 L 2.000001907348633 22.79173469543457 C 2.000001907348633 23.89453506469727 2.897201538085938 24.79172515869141 4.000001907348633 24.79172515869141 L 16.01948165893555 24.79172515869141 C 17.12228202819824 24.79172515869141 18.01948165893555 23.89453506469727 18.01948165893555 22.79173469543457 L 18.01948165893555 3.999996185302734 C 18.01948165893555 2.897195816040039 17.12228202819824 1.999996185302734 16.01948165893555 1.999996185302734 L 4.000001907348633 1.999996185302734 M 4.000001907348633 -3.814697265625e-06 L 16.01948165893555 -3.814697265625e-06 C 18.22862243652344 -3.814697265625e-06 20.01948165893555 1.790864944458008 20.01948165893555 3.999996185302734 L 20.01948165893555 22.79173469543457 C 20.01948165893555 25.0008659362793 18.22862243652344 26.79172515869141 16.01948165893555 26.79172515869141 L 4.000001907348633 26.79172515869141 C 1.790861129760742 26.79172515869141 1.9073486328125e-06 25.0008659362793 1.9073486328125e-06 22.79173469543457 L 1.9073486328125e-06 3.999996185302734 C 1.9073486328125e-06 1.790864944458008 1.790861129760742 -3.814697265625e-06 4.000001907348633 -3.814697265625e-06 Z" stroke="none" fill={svgMenuColor}/>
                                        </g>
                                        <g id="Grupo_88" data-name="Grupo 88" transform="translate(6 13.152) rotate(-8)">
                                        <ellipse id="Elipse_12" data-name="Elipse 12" cx="2.591" cy="2.591" rx="2.591" ry="2.591" transform="translate(2.267 0)" fill={svgMenuColor}/>
                                        <ellipse id="Elipse_13" data-name="Elipse 13" cx="2.591" cy="2.591" rx="2.591" ry="2.591" transform="translate(0 3.886)" fill={svgMenuColor}/>
                                        <ellipse id="Elipse_14" data-name="Elipse 14" cx="2.591" cy="2.591" rx="2.591" ry="2.591" transform="translate(4.533 3.886)" fill={svgMenuColor}/>
                                        <path id="Polígono_1" data-name="Polígono 1" d="M.971,0l.971,3.238H0Z" transform="translate(3.886 6.476)" fill={svgMenuColor}/>
                                        </g>
                                    </svg>
                                {/if}
                            {:else if index === 1}
                                {#if index === menuIndexSelected}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 25 25">
                                        <g id="Grupo_108" data-name="Grupo 108" transform="translate(-18 -182)">
                                        <g id="Interseção_1" data-name="Interseção 1" transform="translate(20 196.5)" fill="none">
                                            <path d="M-.231,4.415A13.874,13.874,0,0,1,10.5-.5,13.874,13.874,0,0,1,21.231,4.414,12.494,12.494,0,0,1,10.5,10.5,12.493,12.493,0,0,1-.231,4.415Z" stroke="none"/>
                                            <path d="M 10.50030136108398 1.499600410461426 C 8.65631103515625 1.499600410461426 6.895601272583008 1.886050224304199 5.267101287841797 2.648210525512695 C 4.189315795898438 3.152628898620605 3.196281433105469 3.818375587463379 2.338689804077148 4.606478214263916 C 3.146411895751953 5.602560043334961 4.133296966552734 6.449057579040527 5.24652099609375 7.093870162963867 C 6.834991455078125 8.013959884643555 8.651721000671387 8.500300407409668 10.50030136108398 8.500300407409668 C 12.34860134124756 8.500300407409668 14.16520118713379 8.013940811157227 15.75370121002197 7.093810081481934 C 16.86699676513672 6.448939323425293 17.85395240783691 5.602409362792969 18.66174507141113 4.606301307678223 C 17.80416870117188 3.81821346282959 16.81121635437012 3.152540683746338 15.73345184326172 2.648150444030762 C 14.10500144958496 1.886030197143555 12.34431171417236 1.499600410461426 10.50030136108398 1.499600410461426 M 10.50030136108398 -0.5003995895385742 C 14.87519073486328 -0.5003995895385742 18.76422119140625 1.426959991455078 21.23116111755371 4.414380550384521 C 19.04732131958008 8.059980392456055 15.05862140655518 10.50030040740967 10.50030136108398 10.50030040740967 C 5.941381454467773 10.50030040740967 1.952960968017578 8.060120582580566 -0.2306785583496094 4.414520263671875 C 2.236251831054688 1.42711067199707 6.125411033630371 -0.5003995895385742 10.50030136108398 -0.5003995895385742 Z" stroke="none" fill={svgMenuColorSelected}/>
                                        </g>
                                        <g id="Elipse_17" data-name="Elipse 17" transform="translate(25 187)" fill="none" stroke={svgMenuColorSelected} stroke-width="2">
                                            <circle cx="5.5" cy="5.5" r="5.5" stroke="none"/>
                                            <circle cx="5.5" cy="5.5" r="4.5" fill="none"/>
                                        </g>
                                        <g id="Elipse_18" data-name="Elipse 18" transform="translate(18 182)" fill="none" stroke={svgMenuColorSelected} stroke-width="2">
                                            <circle cx="12.5" cy="12.5" r="12.5" stroke="none"/>
                                            <circle cx="12.5" cy="12.5" r="11.5" fill="none"/>
                                        </g>
                                        </g>
                                    </svg>
                                {:else}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 25 25">
                                        <g id="Grupo_108" data-name="Grupo 108" transform="translate(-18 -182)">
                                        <g id="Interseção_1" data-name="Interseção 1" transform="translate(20 196.5)" fill="none">
                                            <path d="M-.231,4.415A13.874,13.874,0,0,1,10.5-.5,13.874,13.874,0,0,1,21.231,4.414,12.494,12.494,0,0,1,10.5,10.5,12.493,12.493,0,0,1-.231,4.415Z" stroke="none"/>
                                            <path d="M 10.50030136108398 1.499600410461426 C 8.65631103515625 1.499600410461426 6.895601272583008 1.886050224304199 5.267101287841797 2.648210525512695 C 4.189315795898438 3.152628898620605 3.196281433105469 3.818375587463379 2.338689804077148 4.606478214263916 C 3.146411895751953 5.602560043334961 4.133296966552734 6.449057579040527 5.24652099609375 7.093870162963867 C 6.834991455078125 8.013959884643555 8.651721000671387 8.500300407409668 10.50030136108398 8.500300407409668 C 12.34860134124756 8.500300407409668 14.16520118713379 8.013940811157227 15.75370121002197 7.093810081481934 C 16.86699676513672 6.448939323425293 17.85395240783691 5.602409362792969 18.66174507141113 4.606301307678223 C 17.80416870117188 3.81821346282959 16.81121635437012 3.152540683746338 15.73345184326172 2.648150444030762 C 14.10500144958496 1.886030197143555 12.34431171417236 1.499600410461426 10.50030136108398 1.499600410461426 M 10.50030136108398 -0.5003995895385742 C 14.87519073486328 -0.5003995895385742 18.76422119140625 1.426959991455078 21.23116111755371 4.414380550384521 C 19.04732131958008 8.059980392456055 15.05862140655518 10.50030040740967 10.50030136108398 10.50030040740967 C 5.941381454467773 10.50030040740967 1.952960968017578 8.060120582580566 -0.2306785583496094 4.414520263671875 C 2.236251831054688 1.42711067199707 6.125411033630371 -0.5003995895385742 10.50030136108398 -0.5003995895385742 Z" stroke="none" fill={svgMenuColor}/>
                                        </g>
                                        <g id="Elipse_17" data-name="Elipse 17" transform="translate(25 187)" fill="none" stroke={svgMenuColor} stroke-width="2">
                                            <circle cx="5.5" cy="5.5" r="5.5" stroke="none"/>
                                            <circle cx="5.5" cy="5.5" r="4.5" fill="none"/>
                                        </g>
                                        <g id="Elipse_18" data-name="Elipse 18" transform="translate(18 182)" fill="none" stroke={svgMenuColor} stroke-width="2">
                                            <circle cx="12.5" cy="12.5" r="12.5" stroke="none"/>
                                            <circle cx="12.5" cy="12.5" r="11.5" fill="none"/>
                                        </g>
                                        </g>
                                    </svg>
                                {/if}
                            {:else}
                                {#if index === menuIndexSelected}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 25 25">
                                        <g id="setting-icon" fill="none">
                                        <path d="M2.355,9.217,0,9.857v5.286l2.355.64h0a10.3,10.3,0,0,0,.655,1.57h0L1.8,19.469,5.531,23.2l2.115-1.21h0a11.067,11.067,0,0,0,1.57.655h0L9.857,25h5.286l.64-2.355h0a10.3,10.3,0,0,0,1.57-.655h0l2.115,1.21L23.2,19.469l-1.21-2.115h0a11.067,11.067,0,0,0,.655-1.57h0L25,15.143V9.857l-2.355-.64h0a10.3,10.3,0,0,0-.655-1.57h0L23.2,5.531,19.469,1.8l-2.115,1.21h0a11.067,11.067,0,0,0-1.57-.655h0L15.143,0H9.857l-.64,2.355h0a10.3,10.3,0,0,0-1.57.655h0L5.531,1.8,1.8,5.531l1.21,2.115h0a10.829,10.829,0,0,0-.655,1.57Z" stroke="none"/>
                                        <path d="M 11.38598346710205 2 L 10.86209011077881 3.927740097045898 L 9.828319549560547 4.259700775146484 C 9.40149974822998 4.396760940551758 8.987289428710938 4.569820404052734 8.562019348144531 4.78877067565918 L 7.59623908996582 5.285999298095703 L 5.864580154418945 4.295310974121094 L 4.295310974121094 5.864580154418945 L 5.280960083007812 7.587419509887695 L 4.795909881591797 8.548019409179688 C 4.56471061706543 9.00586986541748 4.389320373535156 9.424659729003906 4.259700775146484 9.828310012817383 L 3.927749633789062 10.86209011077881 L 2 11.38598346710205 L 2 13.61401653289795 L 3.927749633789062 14.13790988922119 L 4.259700775146484 15.17168998718262 C 4.396749496459961 15.59848976135254 4.56981086730957 16.01269912719727 4.78877067565918 16.43798065185547 L 5.285999298095703 17.40375900268555 L 4.295310974121094 19.13541984558105 L 5.864580154418945 20.70468902587891 L 7.587419509887695 19.71903991699219 L 8.548019409179688 20.2040901184082 C 8.992950439453125 20.42876052856445 9.425419807434082 20.60972023010254 9.833430290222168 20.74195098876953 L 10.86301040649414 21.07562065124512 L 11.38598346710205 23 L 13.61400985717773 23 L 14.13788986206055 21.07225036621094 L 15.17168998718262 20.74028968811035 C 15.59848976135254 20.60325050354004 16.01269912719727 20.43019104003906 16.43798065185547 20.21122932434082 L 17.40375900268555 19.7140007019043 L 19.13541984558105 20.70468902587891 L 20.70468902587891 19.13541984558105 L 19.71903991699219 17.4125804901123 L 20.2040901184082 16.45198059082031 C 20.42874908447266 16.0070686340332 20.60971069335938 15.57458972930908 20.74195098876953 15.16656017303467 L 21.07562065124512 14.13698959350586 L 23 13.61401653289795 L 23 11.38598346710205 L 21.0722599029541 10.86209011077881 L 20.74029922485352 9.828319549560547 C 20.60324096679688 9.40149974822998 20.43017959594727 8.987289428710938 20.21122932434082 8.562019348144531 L 19.7140007019043 7.59623908996582 L 20.70468902587891 5.864580154418945 L 19.13541984558105 4.295310974121094 L 17.4125804901123 5.280960083007812 L 16.45198059082031 4.795909881591797 C 16.0070686340332 4.571250915527344 15.57458972930908 4.390289306640625 15.16656017303467 4.258050918579102 L 14.13698959350586 3.924379348754883 L 13.61401653289795 2 L 11.38598346710205 2 M 9.856969833374023 0 L 15.14303016662598 0 L 15.78316020965576 2.355470657348633 C 16.32326126098633 2.530509948730469 16.84836959838867 2.755550384521484 17.35346984863281 3.010599136352539 L 19.46889114379883 1.800359725952148 L 23.19964027404785 5.531110763549805 L 21.98939895629883 7.646530151367188 C 22.24945068359375 8.151630401611328 22.46949005126953 8.67173957824707 22.64452934265137 9.216839790344238 L 25 9.856969833374023 L 25 15.14303016662598 L 22.64452934265137 15.78316020965576 C 22.46949005126953 16.32326126098633 22.24444961547852 16.84836959838867 21.98939895629883 17.35346984863281 L 23.19964027404785 19.46889114379883 L 19.46889114379883 23.19964027404785 L 17.35346984863281 21.98939895629883 C 16.84836959838867 22.24945068359375 16.32826995849609 22.46949005126953 15.78314971923828 22.64452934265137 L 15.14303016662598 25 L 9.856969833374023 25 L 9.216839790344238 22.64452934265137 C 8.676729202270508 22.46949005126953 8.151630401611328 22.24444961547852 7.646530151367188 21.98939895629883 L 5.531110763549805 23.19964027404785 L 1.800359725952148 19.46889114379883 L 3.010599136352539 17.35346984863281 C 2.75054931640625 16.84836959838867 2.530509948730469 16.32826995849609 2.355470657348633 15.78316020965576 L 0 15.14303016662598 L 0 9.856969833374023 L 2.355470657348633 9.216839790344238 C 2.530509948730469 8.671730041503906 2.755550384521484 8.151630401611328 3.010599136352539 7.646530151367188 L 1.800359725952148 5.531110763549805 L 5.531110763549805 1.800359725952148 L 7.646530151367188 3.010599136352539 C 8.151630401611328 2.75054931640625 8.67173957824707 2.530509948730469 9.216839790344238 2.355470657348633 L 9.856969833374023 0 Z" stroke="none" fill={svgMenuColorSelected}/>
                                        </g>
                                        <g id="Elipse_19" data-name="Elipse 19" transform="translate(7 7)" fill="none" stroke={svgMenuColorSelected} stroke-width="2">
                                        <circle cx="5.5" cy="5.5" r="5.5" stroke="none"/>
                                        <circle cx="5.5" cy="5.5" r="4.5" fill="none"/>
                                        </g>
                                    </svg>
                                {:else}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 25 25">
                                        <g id="setting-icon" fill="none">
                                        <path d="M2.355,9.217,0,9.857v5.286l2.355.64h0a10.3,10.3,0,0,0,.655,1.57h0L1.8,19.469,5.531,23.2l2.115-1.21h0a11.067,11.067,0,0,0,1.57.655h0L9.857,25h5.286l.64-2.355h0a10.3,10.3,0,0,0,1.57-.655h0l2.115,1.21L23.2,19.469l-1.21-2.115h0a11.067,11.067,0,0,0,.655-1.57h0L25,15.143V9.857l-2.355-.64h0a10.3,10.3,0,0,0-.655-1.57h0L23.2,5.531,19.469,1.8l-2.115,1.21h0a11.067,11.067,0,0,0-1.57-.655h0L15.143,0H9.857l-.64,2.355h0a10.3,10.3,0,0,0-1.57.655h0L5.531,1.8,1.8,5.531l1.21,2.115h0a10.829,10.829,0,0,0-.655,1.57Z" stroke="none"/>
                                        <path d="M 11.38598346710205 2 L 10.86209011077881 3.927740097045898 L 9.828319549560547 4.259700775146484 C 9.40149974822998 4.396760940551758 8.987289428710938 4.569820404052734 8.562019348144531 4.78877067565918 L 7.59623908996582 5.285999298095703 L 5.864580154418945 4.295310974121094 L 4.295310974121094 5.864580154418945 L 5.280960083007812 7.587419509887695 L 4.795909881591797 8.548019409179688 C 4.56471061706543 9.00586986541748 4.389320373535156 9.424659729003906 4.259700775146484 9.828310012817383 L 3.927749633789062 10.86209011077881 L 2 11.38598346710205 L 2 13.61401653289795 L 3.927749633789062 14.13790988922119 L 4.259700775146484 15.17168998718262 C 4.396749496459961 15.59848976135254 4.56981086730957 16.01269912719727 4.78877067565918 16.43798065185547 L 5.285999298095703 17.40375900268555 L 4.295310974121094 19.13541984558105 L 5.864580154418945 20.70468902587891 L 7.587419509887695 19.71903991699219 L 8.548019409179688 20.2040901184082 C 8.992950439453125 20.42876052856445 9.425419807434082 20.60972023010254 9.833430290222168 20.74195098876953 L 10.86301040649414 21.07562065124512 L 11.38598346710205 23 L 13.61400985717773 23 L 14.13788986206055 21.07225036621094 L 15.17168998718262 20.74028968811035 C 15.59848976135254 20.60325050354004 16.01269912719727 20.43019104003906 16.43798065185547 20.21122932434082 L 17.40375900268555 19.7140007019043 L 19.13541984558105 20.70468902587891 L 20.70468902587891 19.13541984558105 L 19.71903991699219 17.4125804901123 L 20.2040901184082 16.45198059082031 C 20.42874908447266 16.0070686340332 20.60971069335938 15.57458972930908 20.74195098876953 15.16656017303467 L 21.07562065124512 14.13698959350586 L 23 13.61401653289795 L 23 11.38598346710205 L 21.0722599029541 10.86209011077881 L 20.74029922485352 9.828319549560547 C 20.60324096679688 9.40149974822998 20.43017959594727 8.987289428710938 20.21122932434082 8.562019348144531 L 19.7140007019043 7.59623908996582 L 20.70468902587891 5.864580154418945 L 19.13541984558105 4.295310974121094 L 17.4125804901123 5.280960083007812 L 16.45198059082031 4.795909881591797 C 16.0070686340332 4.571250915527344 15.57458972930908 4.390289306640625 15.16656017303467 4.258050918579102 L 14.13698959350586 3.924379348754883 L 13.61401653289795 2 L 11.38598346710205 2 M 9.856969833374023 0 L 15.14303016662598 0 L 15.78316020965576 2.355470657348633 C 16.32326126098633 2.530509948730469 16.84836959838867 2.755550384521484 17.35346984863281 3.010599136352539 L 19.46889114379883 1.800359725952148 L 23.19964027404785 5.531110763549805 L 21.98939895629883 7.646530151367188 C 22.24945068359375 8.151630401611328 22.46949005126953 8.67173957824707 22.64452934265137 9.216839790344238 L 25 9.856969833374023 L 25 15.14303016662598 L 22.64452934265137 15.78316020965576 C 22.46949005126953 16.32326126098633 22.24444961547852 16.84836959838867 21.98939895629883 17.35346984863281 L 23.19964027404785 19.46889114379883 L 19.46889114379883 23.19964027404785 L 17.35346984863281 21.98939895629883 C 16.84836959838867 22.24945068359375 16.32826995849609 22.46949005126953 15.78314971923828 22.64452934265137 L 15.14303016662598 25 L 9.856969833374023 25 L 9.216839790344238 22.64452934265137 C 8.676729202270508 22.46949005126953 8.151630401611328 22.24444961547852 7.646530151367188 21.98939895629883 L 5.531110763549805 23.19964027404785 L 1.800359725952148 19.46889114379883 L 3.010599136352539 17.35346984863281 C 2.75054931640625 16.84836959838867 2.530509948730469 16.32826995849609 2.355470657348633 15.78316020965576 L 0 15.14303016662598 L 0 9.856969833374023 L 2.355470657348633 9.216839790344238 C 2.530509948730469 8.671730041503906 2.755550384521484 8.151630401611328 3.010599136352539 7.646530151367188 L 1.800359725952148 5.531110763549805 L 5.531110763549805 1.800359725952148 L 7.646530151367188 3.010599136352539 C 8.151630401611328 2.75054931640625 8.67173957824707 2.530509948730469 9.216839790344238 2.355470657348633 L 9.856969833374023 0 Z" stroke="none" fill={svgMenuColor}/>
                                        </g>
                                        <g id="Elipse_19" data-name="Elipse 19" transform="translate(7 7)" fill="none" stroke={svgMenuColor} stroke-width="2">
                                        <circle cx="5.5" cy="5.5" r="5.5" stroke="none"/>
                                        <circle cx="5.5" cy="5.5" r="4.5" fill="none"/>
                                        </g>
                                    </svg>
                                {/if}
                            {/if}
                            </button>
                    {/each}
                    <!-- <button class="menuItem profile">profile</button>
                    <button class="menuItem settings">settings</button> -->
                </div>
                <div class="gameDiv">
                    <div class="gameSelection">
                        {#each tabSelectionTitles as tabSelection, index}
                            <button class="tabSelection" class:selected={index === tabSelected} on:click={() => selectTab(index)}><span>{tabSelection}</span></button>
                        {/each}
                    </div>
                    
                    <div class="gamesAvaiable">
                        {#if tabSelected === 0}
                            {#each Object.entries(gamesAvaiable) as [key, game], index}
                            <div class="wrapper" on:mouseenter={() => changeDoordashClass(index)} on:mouseleave={() => changeDoordashClass(index)}>
                                {#if index === 2}
                                    <div class= "doordashDiv" class:show={doordashDivShow}>
                                        <div class="doordashLogo"></div>
                                        <div class="doordashInfo"><span>$10 GIFT CARDS</span></div>
                                    </div>
                                {/if}
                                <div class="gameSelector" >
                                    <div class="gameTitle">{game.gameTitle}</div>
                                    <div class="gameInfo">
                                        <div class="blinds">{game.blinds}</div>
                                        <div class="players">{game.players}</div>
                                        <div class="buyInRow">
                                            <div class="buyIn minBuyIn">{game.minBuyIn}</div>
                                            <div class="buyIn maxBuyIn">{game.maxBuyIn}</div>
                                        </div>
                                    </div>
                                    <div class="buttonDiv">
                                        <button class="joinNow" on:click={()=>openNewTable(key)}>JOIN NOW</button>
                                    </div>
                                </div>
                            </div>
                            {/each}
                        {:else}
                            <div class="avaiableSoonDiv">
                                <svg xmlns="http://www.w3.org/2000/svg" width="483" height="69" viewBox="0 0 483 69">
                                    <text id="Available_soon" data-name="Available soon" transform="translate(0 55)" fill="#e5e5e5" font-size="57" font-family="Montserrat-Regular, Montserrat" letter-spacing="0.1em"><tspan x="0" y="0">Available soon</tspan></text>
                                </svg>
                            </div>
                        {/if}

                        
                    </div>
                    <div class="adsDiv">
                        <Ads />
                    </div>
                </div>
            </div>
        
        {/if}
    </div>
</main>

