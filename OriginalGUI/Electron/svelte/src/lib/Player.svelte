<script>
	import { afterUpdate } from "svelte";
    import Card from "./Card.svelte";
    /**
     * @type {Number}
     */
    export let tableSize
    /**
     * @type {Number}
     */
    export let tableRotateAmount

    // /**
    //  * @type {Object.<string,any>}
    //  */
    // export let player
    export let id, name, stackSize, avatar, position, betSize, cards, isButton, showCards, hasFolded, isSitout, isHero, possibleActions, isWinner;
    const deck = "boardDeck"
    let playerTurn = false;
    // export let playerName, balance: 1000, avatar: 1, position: 0, betSize:  9999999, cards: ["As", "5c"], deck : "boardDeck", isButton : true, isHero : true, lastAction : "cardDealt"
    /**
     * @type {Object.<Number, String>}
     */
    let positionClassByTableSize = {
        2: {
            0 : "playerRow middleColumn pos0 row4",
            1 : "playerRow middleColumn pos3 row1",
        },
        3: {
            0 : "playerRow middleColumn pos0 row4",
            1 : "playerRow leftColumn pos2 row2",
            2 : "playerRow rightColumn pos4 row2",
        },
        6: {
            0 : "playerRow middleColumn pos0 row4",
            1 : "playerRow leftColumn pos1 row3",
            2 : "playerRow leftColumn pos2 row2",
            3 : "playerRow middleColumn pos3 row1",
            4 : "playerRow rightColumn pos4 row2",
            5 : "playerRow rightColumn pos5 row3",
        },
        9: {
            0 : "table9max playerRow middleColumn pos0 row5",
            1 : "table9max playerRow leftMiddleColumn pos1 row4",
            2 : "table9max playerRow leftColumn pos2 row3",
            3 : "table9max playerRow leftMiddleColumn pos3 row2",
            4 : "table9max playerRow leftMiddleTopColumn pos4 row1",
            5 : "table9max playerRow rightMiddleTopColumn pos5 row1",
            6 : "table9max playerRow rightMiddleColumn pos6 row2",
            7 : "table9max playerRow rightColumn pos7 row3",
            8 : "table9max playerRow rightMiddleColumn pos8 row4",
        }
    }
    let playerCards
    let playerCardsHero
    let playerCardsFolded = false;
    let playerCardsShow = false;
    $: console.log(`isWinner: ${isWinner}`)
    export function dealCards() {
        console.log("dealCard called at player " + playerID)
        // const playerCards = document.getElementsByClassName("playerCards")[position]
        // console.log(window.innerHeight, window.innerWidth)
        // console.log(window.innerHeight/2, window.innerWidth/2)
        playerCardsFolded = false;
        if (playerCards) { 
            console.log(playerCards)
            console.log(playerCards.className)
            // if (playerCards.class.contains("leftColumn")) leftPos = 500
            playerCards.animate([
                { top: "-100vh", opacity: 0, transform: "rotate(-3600deg)" },
                { opacity: 1, transform: "rotate(0)" }
            ], {
                duration: 1000,
                iterations: 1,
                easing: "ease-out",
                delay: 100*position
            })
        }
        if (playerCardsHero) { 
            // console.log(playerCards)
            // console.log(playerCards.className)
            // if (playerCards.class.contains("leftColumn")) leftPos = 500
            playerCardsHero.animate([
                { top: "-100vh", opacity: 0, transform: "rotate(-3600deg)" },
                { opacity: 1, transform: "rotate(0)" }
            ], {
                duration: 1000,
                iterations: 1,
                easing: "ease-out",
                delay: 100*position
            })
        }
    }
    export function foldCards() {
        console.log("foldCards() called at player " + playerID)
        // const playerCards = document.getElementsByClassName("playerCards")[position]
        playerCardsFolded = true;
        // if (playerCards) { 
            // playerCards.className += " fold"
            // playerCards.animate([
            //     { },
            //     { opacity: 0, transform: "translateX(50vh) rotate(1080deg)" }
            // ], {
            //     duration: 1000,
            //     iterations: 1,
            //     easing: "ease-out",
            //     delay: 100*position
            // })
        // }
        // if (playerCardsHero) { 
        //     playerCardsFolded = true;
        // }
    }
    export function call(amount) {
        console.log(`call(${amount}) called at player ${playerID}`)
        betSize = amount
    }
    let timeLeftPerc = 100;
    let timer
    export function startPlayerTurn(timeLimit) {
        console.log("startPlayerTurn(timeLimit)")
        console.log(position)
        console.log(name)
        console.log(id)
        endPlayerTurn()
        console.log(timeLimit)
        playerTurn = true;
        let timeDiff = timeLimit - new Date().getTime()
        timeLeftPerc = (timeDiff/20000) * 100
        // if (timer) clearInterval(timer)
        console.log(timeLeftPerc)
        timer = setInterval(()=>{
            // clearInterval(timer)
            if (playerTurn === false) return
            if (timeLeftPerc > 1) return timeLeftPerc -= 1
            if (timeLeftPerc > 0) return timeLeftPerc -= timeLeftPerc
            endPlayerTurn()
        }, timeDiff/100);
    }
    export function endPlayerTurn() {
        clearInterval(timer)
        playerTurn = false;
        timeLeftPerc = 100
    }
    $: avatarUrl = `url('../../../avatar/${avatar}.png')`
    /**
     * 
     * @param {String} lastAction
     */
    function animateLastAction(lastAction) {
        console.log(lastAction)
    }
    $: cssVarStyles = `--avatar-url:${avatarUrl};--time-left-perc:${timeLeftPerc}%`;
    let positioningClass = positionClassByTableSize[tableSize][(position - tableRotateAmount + tableSize) % tableSize];
    $: console.log(`(${position} - ${tableRotateAmount} + ${tableSize}) % ${tableSize}: ${(position - tableRotateAmount + tableSize) % tableSize}`)
    $: console.log(positioningClass)
    $: positioningClass = positionClassByTableSize[tableSize][(position - tableRotateAmount + tableSize) % tableSize]; //needs to be done like this to become reactive to changes
    // console.log(positioningClass)
    // $: lastAction = animateLastAction(lastAction)
    // $: changePositionClass();

    // url('/player1.png')
</script>

<style lang="scss">
    // span {
    //     font-size: 1rem;
    // }
    .playerWrapper {
        all: unset;
        position: absolute;
        /* background-color: blue; */
        // width: 100%;
        height: calc(0.15 * var(--height));
        /* top: 7%; */
        display: flex;
        // flex-direction: row;
        /* justify-content: center; */
        align-items: center;
        /* z-index: 1; */
    }
    .playerRow {
        all: unset;
        position: absolute;
        /* background-color: blue; */
        width: 100%;
        height: calc(0.15 * var(--height));
        /* top: 7%; */
        display: flex;
        flex-direction: row;
        /* justify-content: center; */
        align-items: center;
        /* z-index: 1; */
    }
    .row1 {
        top: 6%;
        .player {
            height: calc(0.24 * var(--height));
        }
        font-size: calc(var(--root-font-size) * 0.85)
    }
    .row2 {
        top: 12%;
        .player {
            height: calc(0.26 * var(--height));
        }
        .playerButton {
            top: calc(0.18 * var(--height))
        }
        .playerCards {
            top: calc(0.255 * var(--height))
        }
        font-size: calc(var(--root-font-size) * 0.90)
    }
    .row3 {
        top: 45%;
        .player {
            height: calc(0.28 * var(--height));
        }
        .playerButton {
            top: calc(0.05 * var(--height))
        }
        .playerCards {
            top: calc(0.105 * var(--height))
        }
        font-size: calc(var(--root-font-size) * 0.95)
    }
    .row4 {
        top: 67%;
        .player {
            height: calc(0.30 * var(--height));
        }
    }
    .middleColumn {
        justify-content: center;
        .playerBet {
            // top: 25%;
            left: 20%;
        }
    }
    .leftColumn {
        justify-content: flex-start;
        padding: 5%;
        width: 90%;
    }
    .rightColumn {
        // background-color: white;
        justify-content: flex-end;
        padding: 5%;
        width: 90%;
    }
    .row5 {
        top: 67%;
        .player {
            height: calc(0.30 * var(--height));
        }
    }
    .table9max.row1 {
        top: 5%;
        .player {
            height: calc(0.22 * var(--height));
        }
        .playerBet {
            
        }
    }
    .table9max.row2 {
        top: 10%;
        .player {
            height: calc(0.24 * var(--height));
        }
    }
    .table9max.row3 {
        top: 35%;
        .player {
            height: calc(0.26 * var(--height));
        }
    }
    .table9max.row4 {
        top: 60%;
        .player {
            height: calc(0.28 * var(--height));
        }
    }
    .table9max.leftColumn {
        // background-color: white;
        justify-content: flex-start;
        padding: 0 0.5%;
        width: 100%;
    }
    .table9max.leftMiddleTopColumn {
        // background-color: white;
        justify-content: flex-start;
        padding: 0 32.5%;
        width: 75%;
    }
    .table9max.leftMiddleColumn {
        // background-color: white;
        justify-content: flex-start;
        padding: 0 10%;
        width: 80%;
    }
    .table9max.rightMiddleColumn {
        // background-color: white;
        justify-content: flex-end;
        padding: 0%;
        width: 90%;
    }
    .table9max.rightMiddleTopColumn {
        // background-color: white;
        justify-content: flex-end;
        padding: 0%;
        width: 67.5%;
    }
    .table9max.rightColumn {
        // background-color: white;
        justify-content: flex-end;
        padding: 0%;
        width: 99.5%;
    }
    // .borderColumn {
    //     justify-content: space-between;
    //     padding: 5%;
    //     width: 90%;
    // }
    .player {
        all: unset;
        position: relative;
        display: flex;
        flex-direction: column;
        // background-color: white;
        aspect-ratio: 6/8;
        z-index: 1;
    }
    .playerImage {
        position: relative;
        margin: 0 auto;
        width: 90%;
        height: 70%;
        background-image: var(--avatar-url);
        // background-image: url('/player1.png');
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
    }
    .playerName {
        width: 100%;
        height: 12%;
        background-color: #464c5d;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        // margin-right: 5%;
        span {
            color: whitesmoke;
            padding-right: 5%;
        }
        z-index: 2;
    }
    .playerName.winner {
        border-top: 1px solid green;
        border-left: 1px solid green;
        border-right: 1px solid green;
    }
    
    .playerBalance {
        width: 100%;
        height: 18%;
        background-color: #353a48;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        span {
            color: whitesmoke;
            padding-right: 5%;
        }
        ::before {
            position: absolute;
            content: "$";
            left: 5%;
        }
        z-index: 2;
    }
    .playerBalance.winner {
        border-bottom: 1px solid green;
        border-left: 1px solid green;
        border-right: 1px solid green;
    }
    .playerButton {
        background-image: url('/Dealer.png');
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        position: absolute;
        // background-color: red;
        width: calc(0.03 * var(--height));
        aspect-ratio: 1;
        border-radius: 50%;
        top: 15%;
        display: flex;
        color: white;
        align-items: center;
        justify-content: center;
    }
    .playerCards {
        position: absolute;
        // background-color: gray;
        // width: calc(0.06 * var(--height));
        width: 30%;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 1s;
        // .card {
        //     width: 100%;
        //     height: 100%;
        //     background-image: url('/baralho/cardback preto.png');
        //     background-position: center;
        //     background-size: contain;
        //     background-repeat: no-repeat;
        // }
        :first-child{
            transform: translateX(15%) translateY(-10%) rotate(-100deg);
        }
        :last-child{
            transform: translateX(-75%) translateY(10%) rotate(-80deg) ;
        }
    }
    // .playerCards.fold {
    //     top: -100vh !important;
    //     // left: 50vw !important;
    //     // right: 0;
    //     opacity: 1;
    // }
    .pos0 {
        .playerCards {
            left: 85%;
            top: 20%;
            :first-child{
                transform: translateX(15%) translateY(10%) rotate(-130deg);
                z-index: 1;
            }
            :last-child{
                transform: translateX(-95%) translateY(-5%) rotate(-150deg);
            }
        }
        .playerCards.fold {
            top: -18vh;
            left: 10vw;
            opacity: 0;
        }
        .playerButton {
            top: 25%;
        }
        // .playerBet{
        //     transform: translateX(-15%) translateY(40%) rotate(-130deg) ;
        // }
    }
    .pos1 {
        .playerButton {
            left: 75%
        }
        .playerCards {
            left: 85%;
            :first-child{
                transform: translateX(15%) translateY(10%) rotate(-130deg);
                z-index: 1;
            }
            :last-child{
                transform: translateX(-95%) translateY(-5%) rotate(-150deg) ;
            }
        }
        .playerBet {
            top: 25%;
            left: 80%;
        }
        .playerCards.fold {
            top: -2vh;
            left: 45vw;
            opacity: 0;
        }
        // .playerBet{
        //     transform: translateX(-15%) translateY(40%) rotate(-130deg) ;
        // }
    }
    .pos2 {
        .playerButton {
            left: 120%;
        }
        .playerCards {
            left: 70%;
            :first-child{
                transform: translateX(55%) translateY(10%) rotate(-80deg);
                z-index: 1;
            }
            :last-child{
                transform: translateX(-80%) translateY(20%) rotate(-40deg) ;
            }
        }
        .playerBet {
            top: 85%;
            left: 100%;
        }
        .playerCards.fold {
            top: 30vh;
            left: 45vw;
            opacity: 0;
        }
        // .playerBet{
        //     transform: translateX(-15%) translateY(40%) rotate(-60deg) ;
        // }
    }
    .pos3 {
        .playerButton {
            top: 95%;
            left: 105%;
        }
        .playerCards {
            top: 100%;
            left: 5%;
            :first-child{
                transform: translateX(5%) translateY(15%) rotate(-45deg);
            }
            :last-child{
                transform: translateX(-45%) translateY(15%) rotate(-55deg) ;
            }
        }
        .playerBet {
            top: 105%;
            left: 40%
        }
        .playerCards.fold {
            top: 40vh;
            left: 8vw;
            opacity: 0;
        }
    }
    .pos4 {
        .playerButton {
            right: 120%;
        }
        .playerCards {
            // top: 0;
            left: 10%;
            // right: 60%;
            :first-child{
                transform: translateX(15%) translateY(23%) rotate(-30deg);
            }
            :last-child{
                transform: translateX(-50%) translateY(20%) rotate(-60deg) ;
            }
        }
        .playerBet {
            top: 85%;
            right: 100%;
        }
        .playerCards.fold {
            top: 30vh;
            left: -28vw;
            opacity: 0;
        }
    }
    .pos5 {
        .playerButton {
            right: 75%
        }
        .playerCards {
            left: -5%;
            // right: 75%;
            :first-child{
                transform: translateX(15%) translateY(-5%) rotate(60deg);
            }
            :last-child{
                transform: translateX(-80%) translateY(5%) rotate(30deg) ;
            }
        }
        .playerBet {
            top: 25%;
            right: 80%;
        }
        .playerCards.fold {
            top: -2vh;
            left: -28vw;
            opacity: 0;
        }
    }
    .table9max.pos0 {
        .playerCards {
            left: 85%;
            top: 20%;
            :first-child{
                transform: translateX(15%) translateY(10%) rotate(-130deg);
                z-index: 1;
            }
            :last-child{
                transform: translateX(-95%) translateY(-5%) rotate(-150deg);
            }
        }
        // .playerBet{
        //     transform: translateX(-15%) translateY(40%) rotate(-130deg) ;
        // }
    }
    .table9max.pos1 {
        .playerButton {
            left: 70%
        }
        .playerCards {
            left: 85%;
            top: 30%;
            :first-child{
                transform: translateX(30%) translateY(10%) rotate(-130deg);
                z-index: 1;
            }
            :last-child{
                transform: translateX(-80%) translateY(-5%) rotate(-150deg) ;
            }
        }
        .playerBet {
            top: 15%;
            left: 80%;
        }
        // .playerBet{
        //     transform: translateX(-15%) translateY(40%) rotate(-130deg) ;
        // }
    }
    .table9max.pos2 {
        .playerButton {
            top: 45%;
            left: 115%;
        }
        .playerCards {
            top: 70%;
            left: 110%;
            :first-child{
                transform: translateX(25%) translateY(25%) rotate(-120deg);
                // z-index: 1;
            }
            :last-child{
                transform: translateX(-80%) translateY(15%) rotate(-140deg) ;
            }
        }
        .playerBet {
            top: 60%;
            left: 100%;
        }
        // .playerBet{
        //     transform: translateX(-15%) translateY(40%) rotate(-60deg) ;
        // }
    }
    .table9max.pos3 {
        .playerButton {
            top: 95%;
            left: 115%;
        }
        .playerCards {
            top: 100%;
            left: 80%;
            :first-child{
                transform: translateX(-25%) translateY(25%) rotate(-35deg);
                z-index: 1;
            }
            :last-child{
                transform: translateX(-145%) translateY(25%) rotate(-55deg) ;
            }
        }
        .playerBet {
            top: 110%;
            left: 95%;
        }
    }
    .table9max.pos4 {
        .playerButton {
            top: 100%;
            left: 80%;
        }
        .playerCards {
            top: 96%;
            left: 15%;
            :first-child{
                transform: translateX(15%) translateY(23%) rotate(-50deg);
            }
            :last-child{
                transform: translateX(-50%) translateY(20%) rotate(-70deg) ;
            }
        }
        .playerBet {
            top: 120%;
            left: 40%;
        }
    }
    .table9max.pos5 {
        .playerButton {
            left: 5%;
            top: 100%
        }
        .playerCards {
            top: 96%;
            left: 75%;
            :first-child{
                transform: translateX(-85%) translateY(23%) rotate(-60deg);
            }
            :last-child{
                transform: translateX(-150%) translateY(20%) rotate(-75deg) ;
            }
        }
        .playerBet {
            top: 120%;
            left: 0%;
        }
    }
    .table9max.pos6 {
        .playerButton {
            left: -20%;
            top: 95%
        }
        .playerCards {
            top: 98%;
            left: 25%;
            :first-child{
                transform: translateX(-85%) translateY(23%) rotate(-40deg);
            }
            :last-child{
                transform: translateX(-150%) translateY(20%) rotate(-55deg) ;
            }
        }
        .playerBet {
            top: 110%;
            left: -60%;
        }
    }
    .table9max.pos7 {
        .playerButton {
            left: -20%;
            top: 45%;
        }
        .playerCards {
            top: 68%;
            left: -15%;
            :first-child{
                transform: translateX(-55%) translateY(23%) rotate(40deg);
            }
            :last-child{
                transform: translateX(-150%) translateY(20%) rotate(55deg) ;
            }
        }
        .playerBet {
            top: 60%;
            left: -60%;
        }
    }
    .table9max.pos8 {
        .playerButton {
            left: 10%;
            top: 15%;
        }
        .playerCards {
            top: 25%;
            left: 5%;
            :first-child{
                transform: translateX(-55%) translateY(23%) rotate(40deg);
            }
            :last-child{
                transform: translateX(-150%) translateY(20%) rotate(55deg) ;
            }
        }
        .playerBet {
            top: 15%;
            left: -50%;
        }
    }
    .playerCircle {
        position: absolute;
        height: 40%;
        top: 60%;
        left: 8.5%;
        aspect-ratio: 2/1;
        background: gray;
        opacity: 0.15;
        border-radius: 10rem 10rem 0 0 ;
        z-index: -1;
    }
    .card {
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        // width: 100%;
        height: 100%;
        // background-color: azure;
        aspect-ratio: 6/9;
    }
    .playerCardsHero {
        position: absolute;
        // background-color: white;
        height: 40%;
        aspect-ratio: 4/3;
        top: 45%;
        left: 14%;
        opacity: 1;
        z-index: 1;
        display: flex;
        flex-direction: row;
        gap:1%;
        transition: 1s;
        :last-child{
            // transform: translateX(0%);
            z-index: 2;
        }
    }
    .playerCardsHero.fold {
        top: -15vh;
        left: 14%;
        opacity: 0;
    }


        
    .playerBet {
        position: absolute;
        font-size: 0.8em;
        width: 60%;
        height: 10%;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        top: -5%;
        border-radius: 5px;
        // transition: 1s;
        .value::before{
            content: "$ ";
        }
        span{
            background-color: rgba(77,77,77,0.25);
            padding: 2% 5%;
            border-radius: 5px;
        }
    }
    .playerGlow {
        position: absolute;
        // height: 100%;
        width: 150%;
        aspect-ratio: 1;
        // border-radius: 50%;
        background: radial-gradient(rgba(255,255,255,1), rgba(255,255,255,0.0) 55%);
        // background: radial-gradient(rgba(255,255,255,1) 25%, rgba(255,255,255,0.0));
        left: -25%;
        display: none;
        // transition: background 1s;
        // opacity: 1;
    }
    .glowPlayerAnimation {
        display: initial;
        animation-name: glow;
        animation-duration: 1s;
        animation-timing-function: linear;
        animation-direction: alternate;
        animation-iteration-count: infinite;
        // 1s ease-in-out infinite;
    }
    @keyframes glow {
        0% {background: radial-gradient(rgba(255,255,255,1), rgba(255,255,255,0.0) 50%);}
        10% {background: radial-gradient(rgba(255,255,255,1), rgba(255,255,255,0.0) 50.5%);}
        20% {background: radial-gradient(rgba(255,255,255,1), rgba(255,255,255,0.0) 51%);}
        30% {background: radial-gradient(rgba(255,255,255,1), rgba(255,255,255,0.0) 51.5%);}
        40% {background: radial-gradient(rgba(255,255,255,1), rgba(255,255,255,0.0) 52%);}
        50% {background: radial-gradient(rgba(255,255,255,1), rgba(255,255,255,0.0) 52.5%);}
        60% {background: radial-gradient(rgba(255,255,255,1), rgba(255,255,255,0.0) 53%);}
        70% {background: radial-gradient(rgba(255,255,255,1), rgba(255,255,255,0.0) 53.5%);}
        80% {background: radial-gradient(rgba(255,255,255,1), rgba(255,255,255,0.0) 54%);}
        90% {background: radial-gradient(rgba(255,255,255,1), rgba(255,255,255,0.0) 54.5%);}
        100% {background: radial-gradient(rgba(255,255,255,1), rgba(255,255,255,0.0) 55%);}
    }

    .timer {
        position: absolute;
        height: 1%;
        width: 100%;
        top: 100%;
        .background {
            position: absolute;
            background: linear-gradient(90deg, darkred, yellow 75%);
            height: 100%;
            width: 100%;
        }
        .timePasser {
            position: absolute;
            background-color: #353a48;
            height: 100%;
            left: var(--time-left-perc);
            width: calc(100% - var(--time-left-perc));
            // left: 100%;
            // width: 100%;
            z-index: 10;
        }
    }
</style>

<div class={positioningClass}>
    <div class="player">
        <div class="playerGlow" class:glowPlayerAnimation={playerTurn}></div>
        <div class="playerImage" style={cssVarStyles}>
            <div class="playerCircle"></div>
        </div>
        <div class="playerName" class:winner={isWinner}><span>{name}</span></div>
        <div class="playerBalance" class:winner={isWinner}><span>{stackSize}</span></div> <!-- {Math.round(stackSize * 100) / 100} -->
        {#if betSize > 0}
            <div class="playerBet"><span class="value">{betSize}</span></div>
        {/if}
        {#if showCards}
            <div class="playerCardsHero" class:show={playerCardsShow} class:fold={hasFolded && isHero} bind:this={playerCardsHero}>
                {#each cards as card}
                    <div class="card"><Card cardString = {card} deck = {deck} /></div>
                {/each}
                <!-- <div class="card"><Card cardString = "Ks" deck = {deck} /></div> -->
            </div>
        {:else}
            <div class="playerCards" class:fold={hasFolded} bind:this={playerCards}>
                {#each cards as card}
                    <div class="card"><Card cardString = {card} deck = {deck} /></div>
                {/each}
                <!-- <div class="card"><Card cardString = "cb" deck = {deck} /></div>
                <div class="card"><Card cardString = "cb" deck = {deck} /></div> -->
            <!-- <div class="card"><Card cardString = "cardback preto" deck = "playerDeck" /></div>
            <div class="card"><Card cardString = "cardback preto" deck = "playerDeck" /></div> -->
            </div>
        {/if}
        
        
        {#if isButton}
            <div class="playerButton"></div>
        {/if}
        {#if playerTurn}
            <div class="timer">
                <div class="background"></div>
                <div class="timePasser" style={cssVarStyles}></div>
            </div>
        {/if}
    </div>
</div>
