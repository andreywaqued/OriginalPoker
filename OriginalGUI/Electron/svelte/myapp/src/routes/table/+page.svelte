<script>
  import Ads from '$lib/Ads.svelte';
  import TitleBar from '$lib/Title_Bar.svelte';
  import { SvelteComponent, onMount } from 'svelte';
	import Card from '$lib/Card.svelte';
  import Player from '$lib/Player.svelte';
	import Pot from '$lib/Pot.svelte';
  /**
   * @type {number}
   */
  export let sbSize = 5;
  let winHeight = 0;
  let tableStarted = true;
  let api;
  let winTitle = ""
  let playersMapping = {};
  let handHistories = [
    "hh 1",
    "hh 2",
    "hh 3",
    "hh 4",
    "hh 5",
    "hh 6",
    "hh 7",
    "hh 8",
    "hh 9",
    "hh 10",
  ]
  onMount(() => {
    const setHeight = () => {
      document.documentElement.style.setProperty('--window-height', `${window.innerHeight}px`);
      winHeight = window.innerHeight
    };
    if (window.api) {
      api = window.api
    }
    winTitle += api.getTitle()
    
    // Initial setting
    setHeight();
    
    // Update on resize
    window.addEventListener('resize', setHeight);
  });
  // function registerPlayer(id, component) {
  //   playersMapping[id] = component;
  // }
  function foldAction(){
    console.log("foldAction()");
    Object.values(playersMapping).forEach(p => {p.foldCards()})
  }
  function callAction(){
    console.log("callAction()");
    Object.values(playersMapping).forEach(p => {p.call(1000)})
    // playersMapping[0].call(1000)
  }
  function raiseAction(){
    console.log("raiseAction()");
    Object.values(playersMapping).forEach(p => {p.dealCards()})
    // betValue = 150
    // for (let i = 0; i <= players.length; i++) {
    //   if (players[i].id === 1) players[i].betSize = 200
    // }
    // players = [
    //   {id: 1, playerName : "asd1", balance: 1000, avatar: 1, position: 0, betSize:  0, cards: ["cb", "cb"], deck : "playerDeck", isButton : true, isHero : false},
    //   {id: 4, playerName : "asdc", balance: 1000, avatar: 4, position: 1, betSize:  30, cards: ["cb", "cb"], deck : "playerDeck", isButton : false, isHero : false},
    //   {id: 6, playerName : "asde", balance: 1000, avatar: 6, position: 2, betSize:  50, cards: ["cb", "cb"], deck : "playerDeck", isButton : false, isHero : false},
    //   {id: 2, playerName : "asda", balance: 1000, avatar: 2, position: 3, betSize:  10, cards: ["As", "Kd"], deck : "playerDeck", isButton : false, isHero : false},
    //   {id: 3, playerName : "asdb", balance: 1000, avatar: 3, position: 4, betSize:  20, cards: ["cb", "cb"], deck : "playerDeck", isButton : false, isHero : true},
    //   {id: 5, playerName : "asdd", balance: 1000, avatar: 5, position: 5, betSize:  40, cards: ["cb", "cb"], deck : "playerDeck", isButton : false, isHero : false},
    // ]
    // // const playerIndex = players.findIndex(p => p.id === 1)
    // // players[playerIndex].betSize = 200
    const player = players.find(p => p.id === 1)
    if (player) player.lastAction = "asddsa"
    // pots[1] = 100
    if (tableRotateAmount + 1 < tableSize) {
      tableRotateAmount += 1
    } else {
      tableRotateAmount += 1 - tableSize
    }
    
    // tableStarted = true;
    // console.log("raise action")
  }
  function plusBetSlider(){
    if (betValue + sbSize >= maxBet) {
      betValue = maxBet
    } else {
      betValue += sbSize
    }
  }
  function minusBetSlider(){
    if (betValue - sbSize <= minBet) {
      betValue = minBet
    } else {
      betValue -= sbSize
    }
      
  }

  /**
   *
   * @param {WheelEvent} event
   */
  function handleScroll(event) {
    if (event.deltaY < 0) {
      plusBetSlider();
    } else {
      minusBetSlider();
    }
  }

  let betValue = 50;
  let minBet = 5;
  let maxBet = 1000;
  let actualBet = 0;
  let pots = [0];
  // let sidePots = [0, 0]
  let boardCards = ["Qs", "Js", "Ts", "9s", "8s"]
  let players = [
    {id: 1, playerName : "asd1", balance: 1000, avatar: 1, position: 0, betSize:  9999999, cards: ["As", "5c"], deck : "boardDeck", isButton : true, isHero : true, lastAction : "cardDealt", showCards: true},
    {id: 4, playerName : "asdc", balance: 1000, avatar: 4, position: 1, betSize:  9999999, cards: ["cb", "cb"], deck : "boardDeck", isButton : true, isHero : false, lastAction : "cardDealt", showCards: false},
    {id: 6, playerName : "asde", balance: 1000, avatar: 6, position: 2, betSize:  9999999, cards: ["cb", "cb"], deck : "boardDeck", isButton : true, isHero : false, lastAction : "cardDealt", showCards: false},
    {id: 2, playerName : "asda", balance: 1000, avatar: 2, position: 3, betSize:  9999999, cards: ["As", "Kd"], deck : "boardDeck", isButton : true, isHero : false, lastAction : "cardDealt", showCards: false},
    {id: 3, playerName : "asdb", balance: 1000, avatar: 3, position: 4, betSize:  9999999, cards: ["cb", "cb"], deck : "boardDeck", isButton : true, isHero : false, lastAction : "cardDealt", showCards: false},
    {id: 5, playerName : "asdd", balance: 1000, avatar: 5, position: 5, betSize:  9999999, cards: ["cb", "cb"], deck : "boardDeck", isButton : true, isHero : false, lastAction : "cardDealt", showCards: false},
    // {id: 6, playerName : "asdg", balance: 1000, avatar: 7, position: 6, betSize:  9999999, cards: ["cb", "cb"], deck : "boardDeck", isButton : true, isHero : false},
    // {id: 7, playerName : "asdh", balance: 1000, avatar: 8, position: 7, betSize:  9999999, cards: ["cb", "cb"], deck : "boardDeck", isButton : true, isHero : false},
    // {id: 8, playerName : "asdi", balance: 1000, avatar: 9, position: 8, betSize:  9999999, cards: ["cb", "cb"], deck : "boardDeck", isButton : true, isHero : false},
  ]
  function findHero(){
    let index = players.findIndex(p => p.isHero === true)
    if (index < 0) return 0
    return index
  }
  let heroPlaceHolder = {id: 1, playerName : "Hero", balance: 1000, avatar: 1, position: 0, betSize:  0, cards: [], deck : "playerDeck", isButton : true, isHero : true};
  let tableRotateAmount = findHero();
  let tableSize = 6
  // function restartTable() {
  //   console.log("restarting table")
  //   tableRotateAmount = 0
  //   players = [];
  //   tableStarted = false;
  // }
  // setTimeout(()=>{
  //   raiseAction()
  //   restartTable()
  // }, 2000)
  function tileTables(){
    console.log("organizeTables")
    api.send("organize-tables")
  }
  function openHH(){
    console.log("openHH")
    api.send("open-hh")
  }
  
</script>

<style lang="scss">

  
:root {
  font-family: 'Roboto', sans-serif;
  -webkit-user-select: none;
  --height: var(--window-height);
  --root-font-size: calc(var(--height) * 0.025);
  font-size: var(--root-font-size);
}
.bg-table {
    all : unset;
    position: relative;
    height: var(--height);
    /* height: 108px; */
    overflow: hidden;
    background-image: url('/fundo final 1280x1080.png');
    // background-image: url('/fundo doordash.png');
    background-size: cover;
    background-position: center;
    aspect-ratio: 128/108;
    display: flex;
    flex-direction: column;
    // border-radius: 4px;
    // border-top-left-radius: 3px;
    // border-top-right-radius: 3px;
}
.potLine {
  position: absolute;
  // background-color: rgba(255,255,255, 0.05);
  height: 3%;
  width: 26%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  .value::before{
      content: "$";
  }
}

.potsParalelos {
    top: 37%;
    left: 37%;
    font-size: 0.8em;
    justify-content: space-around;
    // background-color: blue;

}
.potPrincipal {
    top: 50%;
    left: 37%;
    font-size: 1.2em;
}
.board {
    position: absolute;
    // background-color: rgba(255,255,255,0.1);
    height: 10%;
    width: 30%;
    top: 40%;
    left: 35%;
    // opacity: 0.1;
    z-index: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 1.5%;

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
.playButtonsContainer {
    position: absolute;
    left: 61%;
    top: 84%;
    width: 38%;
    height: 15%;
    // background-color: white;
    display: flex;
    flex-direction: column;
    gap: 5%;
    .betDisplayRow {
      display: flex;
      width: 100%;
      height: 30%;
      flex-direction: row;
      // background-color: blue;
      align-items: center;
      gap: 1%
    }
    .presetButtons {
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: row;
      gap: 1%;
      .presetBetSizeButton {
        // all: unset;
        width: 100%;
        // margin: 0 1%;
        font-size: 0.5em;
        border-radius: 5px;
        background-color: #c1c1c1;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .betDisplay {
        all: unset;
        background-color: rgba(0,0,0,0.5);
        width: 46%;
        height: 100%;
        // transform: translateX(80%);
        display: flex;
        justify-content: flex-end;
        align-items: center;
        text-align: end;
        padding: 0 2%;
        // border: 1px solid yellow;
        border-radius: 5px;
        font-size: 0.8em;
        color: rgba(255,255,255,0.7);

        span {
            color: white;
            padding-right: 5%;
            opacity: 0.7;
        }
        ::before {
            display: block;
            position: absolute;
            // left: 15%;
            color: white;
            content: "$";
            align-self: flex-start;
            font-size: 0.5em;
        }
    }
    .dolarSign {
      position: absolute;
      left: 52%;
      color: rgba(255,255,255,0.7);
      font-size: 0.7em;
    }
    .betDisplay:before {
      display: block;
      content: "$";
      color: white;
    }
    .betDisplay:hover, .betDisplay:focus {
      color: rgba(255,255,255,1);
    }
    .buttons {
        display: flex;
        gap: 2%;
        flex-direction: row;
        width: 100%;
        height: 70%;
    }
    .playButton:hover, .presetBetSizeButton:hover {
        background-color: white;
    }
    button:active {
      transform: scale(0.95);
    }
    button {
      all: unset;
    }
    .playButton{
      position: relative;
      border: none;
      width: 33%;
      border-radius: 1.3vw;
      font-size: 0.60rem;
      // border-top: 0;
      border-bottom: 0.4vh solid #c1c1c1;
      // border: 3px groove #e3e3e3;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      // font-weight: bold;
      margin: 0;
      // padding: 0.2vh 0;
      background-color: #e3e3e3;
      :first-child {
          font-size: 1.3em;
          text-transform: uppercase;
          // font-weight: bold;
      }
      span {
        transform: translateY(0.2vh);
      }
    }
    .value::before{
        content: "$";
    }
    .betSlider {
        // border: 1px solid black;
        border-radius: 5px;
        position: relative;
        background-color: rgba(0,0,0,0.5);
        width: 100%;
        height: 20%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 0;
        .betSliderButton {
          // all:unset;
          border: none;
          color: whitesmoke;
          font-size: 1.2em;
          display: flex;
          align-items: center;
          justify-content: center;
          // background-color: green;
          // border: 1px solid whitesmoke;
          margin: 0;
          padding: 0;
          width: 5%;
          height: 60%;
          // border-radius: 50%;
          svg {
            fill: #c1c1c1;
          }
        }
    }
  }
  .slider {
    -webkit-app-region: no-drag;
    -webkit-appearance: none;
    width: 80%;
    height: 25%;
    border-radius: 5px;
    background: #d3d3d3;
    // outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }

  .slider:hover {
    opacity: 1;
  }

  .slider::-webkit-slider-thumb {
    // position: absolute;
    -webkit-appearance: none;
    appearance: none;
    height: calc(var(--height) * 0.025);
    aspect-ratio: 1;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    top: 0;
    left: 0;
  }
  .adsContainer {
    position: absolute;
    width: 38%;
    height: 17%;
    top: 82%;
    left: 1%;
    z-index: 1;
  }
  
  .betSliderButton:hover {
    svg {
      fill: white !important;
    }
    // background-color: white;
  }
  // .hidden {
  //   display: none;
  // }
  .auxiliarButtons {
    position: absolute;
    width: 100%;
    height: 5%;
    top: 20px;
    display: flex;
    z-index: 100;
  }

  .popover {
    width: 80%;
    height: 80%;
    // display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0;
  }
  .popoverTitle {
    width: 98%;
    height: 5%;
    // background-color: blue;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid black;
    padding: 0 1%;
  }
  .popoverMain {
    width: 100%;
    height: 95%;
    // background-color: yellow;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 0 1%;
  }
  ::backdrop {
    background-color: rgba(0,0,0,0.5);
  }
</style>

<main>
  <TitleBar {winTitle}/>
  <div class="auxiliarButtons">
    <button on:click={tileTables}>Tile Tables</button>
    <button popovertarget="test" on:click={openHH}>HH</button>
  </div>
  <div class="bg-table" on:wheel={handleScroll}>
    <div class="board">
      {#each boardCards as card}
        <div class="card"><Card cardString = {card} deck = "boardDeck" /></div>
      {/each}
    </div>
    <div class="potLine potPrincipal">
        <Pot potAmount = {pots[0]}/>
    </div>
    <div class="potLine potsParalelos">
      {#each pots as pot, index}
        {#if index != 0}
          <Pot potAmount = {pot}/>
        {/if} 
      {/each}
    </div>
    {#if tableStarted}
      {#each players as player (player.position)}
        <Player {...player} bind:tableSize = {tableSize} bind:tableRotateAmount = {tableRotateAmount} bind:this={playersMapping[player.position]}/>
      {/each}
    {:else}
      <!-- <Player bind:tableSize = {tableSize} bind:tableRotateAmount = {tableRotateAmount} bind:player = {heroPlaceHolder}/> -->
    {/if}
    <div class="playButtonsContainer">
        <div class="betDisplayRow">
          <div class="presetButtons">
            <button class="presetBetSizeButton">25%</button>
            <button class="presetBetSizeButton">50%</button>
            <button class="presetBetSizeButton">75%</button>
            <button class="presetBetSizeButton">100%</button>
          </div>
          <label class="dolarSign">$</label>
          <input class="betDisplay" value={betValue}/>
        </div>
        <div class="betSlider">
          <button class="betSliderButton" on:click={minusBetSlider}><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM152 232H296c13.3 0 24 10.7 24 24s-10.7 24-24 24H152c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/></svg></button>
          <input type="range" min={minBet} max={maxBet} bind:value={betValue} class="slider" id="myRange">
          <button class="betSliderButton" on:click={plusBetSlider}><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg></button>
        </div>
        <div class="buttons">
            <button class="playButton" on:click={foldAction} ><span>Fold</span></button>
            <button class="playButton" on:click={callAction}><span>Call</span><span class="value">0123456789</span></button>
            <button class="playButton" on:click={raiseAction}><span>Raise</span><span class="value">{betValue}</span></button>
        </div>
    </div>
    <div class="popover" popover id="test">
      <div class="popoverTitle">
        <span>Hand History</span>
        <button popovertarget="test">X</button>
      </div>
      <div class="popoverMain">
        {#each handHistories as hh, index}
          <div class="handHistory">{hh} {index}</div>
        {/each}
      </div>
    </div>
    <div class="adsContainer">
      <Ads />
    </div>
  </div>
</main>

