<script>
  import Ads from '$lib/Ads.svelte';
  import TitleBar from '$lib/Title_Bar.svelte';
  import { SvelteComponent, onMount } from 'svelte';
	import Card from '$lib/Card.svelte';
  import Player from '$lib/Player.svelte';
	import Pot from '$lib/Pot.svelte';
  import { fade, fly, slide } from "svelte/transition"
  export const ssr = false;
  // /**
  //  * @type {number}
  //  */
  // export let sbSize = 5;
  let sbSize = 5
  let bbSize = 10
  let winHeight = 0;
  let tableStarted = true;
  let api;
  let winTitle = ""
  let handHistories = []
  let hhIndex = 0
  let hero = { id: "", poolID: "", position : 0, cards: [], betSize: 0, stackSize : 0};
  let players = {};
  let playersComponents = {};
  let possibleActions = [];
  let boardCards = [];
  let pots = [0];
  let callAmount = 0;
  let minBet = 0.00;
  let maxBet = 9999999.99;
  let biggestBet = 0;
  let currentPlayerActing = ""
  let currentGameState = {}
  let sumOfBetSizes = 0
  let betValue = 50
  let tableRotateAmount = hero.position
  let tryStartPlayerTurn
  let handIsBeingPlayed = false
  let waitingForPlayers = true
  let doordashTable = false
  $: console.log(tableRotateAmount = hero.position)
  let handStrength = ""
  let callChangeAds
  onMount(() => {
    const setHeight = () => {
      document.documentElement.style.setProperty('--window-height', `${window.innerHeight}px`);
      winHeight = window.innerHeight
    };
    if (window.api) {
      api = window.api
      window.api.on('updatePlayer', (player) => {
        console.log("updatePlayer")
        let playersTemp = JSON.parse(JSON.stringify(players))
        hero = player
        hero.isHero = true
        hero.showCards = true
        hero.betSize = parseFloat(player.betSize)
        hero.stackSize = parseFloat(player.stackSize)
        if (player.finalHandRank) handStrength = player.finalHandRank.combination
        possibleActions = player.possibleActions
        if (possibleActions.length > 1) {
          if (possibleActions[1].amount > hero.betSize + hero.stackSize) possibleActions[1].amount = Math.round((hero.betSize + hero.stackSize)*100)/100
          callAmount = possibleActions[1].amount
          betValue = Math.round(possibleActions[2].amount * 100) / 100
          if (betValue > hero.betSize + hero.stackSize) betValue = Math.round((hero.betSize + hero.stackSize)*100)/100
          minBet = betValue;
          maxBet = Math.round((player.betSize + player.stackSize)*100)/100;
          api.send("focusOnWindow")
          api.send("playSound", "hora_de_jogar.wav")
        }
        tableRotateAmount = hero.position
        playersTemp[player.id] = hero
        players = playersTemp
        console.log(hero)
      });
      api.on("updateGameState", (gameState) => {
        console.log("updateGameState")
        console.log(gameState)
        sumOfBetSizes = 0
        currentPlayerActing = "empty player"
        handIsBeingPlayed = gameState.handIsBeingPlayed
        clearInterval(tryStartPlayerTurn)
        if (!gameState.handIsBeingPlayed) possibleActions = []
        if (gameState.handIsBeingPlayed || gameState.isShowdown) {
          waitingForPlayers = false
        } else {
          waitingForPlayers = true
        }
        // heroTurn = false
        Object.values(gameState.players).forEach( player => {
          player.isHero = false
          // player.showCards = false
          player.isButton = false
          sumOfBetSizes += parseFloat(player.betSize)
          
          if (gameState.positionActing === player.position) currentPlayerActing = player.id
          if (player.position === gameState.dealerPos) player.isButton = true
          // player.position -= hero.position
          // if (player.position < 0) player.position += gameState.tableSize
          // if (!player.hasFolded) player.cards = ["cb", "cb"]
          if (player.id === hero.id) {
            player.isHero = true
            player.showCards = true
            player.cards = hero.cards
            // if (!player.hasFolded) 
          }
        })
        players = gameState.players
        console.log(players)
        tableSize = gameState.tableSize
        boardCards = gameState.boardCards
        pots = gameState.pots
        sbSize = parseFloat(gameState.sb)
        bbSize = parseFloat(gameState.bb)
        biggestBet = parseFloat(gameState.biggestBet)
        currentGameState = gameState
        console.log(playersComponents)
        Object.values(playersComponents).forEach( playerComponent => { 
          if (playerComponent) playerComponent.endPlayerTurn()
        })
        console.log(currentPlayerActing)
        
        if (gameState.handIsBeingPlayed && !gameState.isShowdown) {
          tryStartPlayerTurn = setInterval(()=>{
            if (currentPlayerActing in playersComponents) { //it may be called before the component is created
              playersComponents[currentPlayerActing].startPlayerTurn(gameState.timeLimitToAct)
              clearInterval(tryStartPlayerTurn)
            }
          }, 100)
        }
      })
      window.api.on('handTransition', () => {
        console.log("handTransition")
        possibleActions = []
        handStrength = ""
        transitionBackground()
        callChangeAds()
      });
      window.api.on('updateHandHistory', (handHistory) => {
        console.log("updateHandHistory")
        handHistories.push(handHistory)
        handHistories = handHistories //forcing the update
        if (hhIndex === -1) hhIndex = handHistories.length - 1
      });
      window.api.on('askRebuy', (data) => {
        toggleRebuy()
      });
      window.api.on('sitoutUpdate', (isSitout) => {
        playerSitout = isSitout
        sitoutPopover(isSitout)
      });
      api.on("updatePlayerCards", cards => {
        console.log("updatePlayerCards")
        hero.cards = cards
      })

      api.send("window-ready")
    }
    winTitle += api.getTitle()
    if (winTitle.includes("NL 50")) doordashTable = true
    
    // Initial setting
    setHeight();
    
    // Update on resize
    window.addEventListener('resize', setHeight);
  });
  // function registerPlayer(id, component) {
  //   playersComponents[id] = component;
  // }
  function validateBetValueInput(event) {
    let input = event.target.value;
    input = input.replace(/[^0-9.]/g, '');
    
    // Allow only one dot
    const parts = input.split('.');
    if (parts.length > 2) {
        input = parts[0] + '.' + parts.slice(1).join('');
    }
    
    betValue = parseFloat(input);

  }
  
  function validateRebuyAmountInput(event) {
    let input = event.target.value;
    input = input.replace(/[^0-9.]/g, '');
    
    // Allow only one dot
    const parts = input.split('.');
    if (parts.length > 2) {
        input = parts[0] + '.' + parts.slice(1).join('');
    }
    
    rebuyAmount = parseFloat(input);

  }

  function foldAction(){
    console.log("foldAction()");
    Object.values(playersComponents).forEach(p => {p.foldCards()})
  }
  function callAction(){
    console.log("callAction()");
    Object.values(playersComponents).forEach(p => {p.call(1000)})
    // playersComponents[0].call(1000)
  }
  function raiseAction(){
    console.log("raiseAction()");
    Object.values(playersComponents).forEach(p => {p.dealCards()})
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
      betValue = Math.round(maxBet * 100) / 100
    } else {
      betValue = Math.round((betValue + sbSize) * 100) / 100 
    }
  }
  function minusBetSlider(){
    if (betValue - sbSize <= minBet) {
      betValue = Math.round(minBet * 100) / 100
    } else {
      betValue = Math.round((betValue - sbSize) * 100) / 100 
    }
      
  }
  function updateBetValue(potPerc){
    // console.log(`updateBetValue(${potPerc})`)
    let sumOfPots = 0
    for (let i = 0; i< pots.length; i++) {
      sumOfPots += parseFloat(pots[i])
    }
    // console.log("betValue = potPerc/100*(sumOfPots + sumOfBetSizes + callAmount - hero.betSize)+callAmount")
    betValue = potPerc/100*(sumOfPots + sumOfBetSizes + biggestBet - hero.betSize)+biggestBet
    // console.log(`${betValue} = ${potPerc}/100*(${sumOfPots} + ${sumOfBetSizes} + ${callAmount}) + ${biggestBet}`)
    // if (sumOfBetSizes == 0) betValue = sumOfPots * potPerc / 100
    // // if (sumOfBetSizes == 0) betValue = sumOfPots * potPerc / 100
    // // if (sumOfBetSizes == 0) betValue = betValue * potPerc / 100
    // if (sumOfBetSizes > 0) {
      
    //   100/100*(3 + 0 + 2 - 1)+2
    //   100/100*(3 + 0 + 2 - 0)+2
    //   100/100*(10 + 0 + 0 - 0)+0
    //   betValue = (2 - 1) + (0 + 3 + 2) * 100 / 100 //first round sb x bb
    //   betValue = (2 - 0) * 2 + (0 + 3 + 0) * 100 / 100 //first round other players
    //   betValue = (callAmount - hero.betSize) + (sumOfPots + sumOfBetSizes + callAmount) * potPerc / 100
    // }


    if (betValue > hero.betSize + hero.stackSize) betValue = hero.betSize + hero.stackSize
    if (betValue < minBet) betValue = minBet
    betValue = Math.round(betValue * 100) / 100
    
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

  let actualBet = 0;
  // let sidePots = [0, 0]
  // let playerTurn = true; //only for testing, this should come from the server
  // players = [
  //   {id: 1, name : "asd1", stackSize: 1000, avatar: 1, position: 0, betSize:  9999999, cards: ["As", "5c"], deck : "boardDeck", isButton : true, isHero : true, showCards: true},
  //   {id: 4, name : "asdc", stackSize: 1000, avatar: 4, position: 1, betSize:  9999999, cards: ["cb", "cb"], deck : "boardDeck", isButton : true, isHero : false, showCards: false},
  //   {id: 6, name : "asde", stackSize: 1000, avatar: 6, position: 2, betSize:  9999999, cards: ["cb", "cb"], deck : "boardDeck", isButton : true, isHero : false, showCards: false},
  //   {id: 2, name : "asda", stackSize: 1000, avatar: 2, position: 3, betSize:  9999999, cards: ["As", "Kd"], deck : "boardDeck", isButton : true, isHero : false, showCards: false},
  //   {id: 3, name : "asdb", stackSize: 1000, avatar: 3, position: 4, betSize:  9999999, cards: ["cb", "cb"], deck : "boardDeck", isButton : true, isHero : false, showCards: false},
  //   {id: 5, name : "asdd", stackSize: 1000, avatar: 5, position: 5, betSize:  9999999, cards: ["cb", "cb"], deck : "boardDeck", isButton : true, isHero : false, showCards: false},
  //   // {id: 6, playerName : "asdg", balance: 1000, avatar: 7, position: 6, betSize:  9999999, cards: ["cb", "cb"], deck : "boardDeck", isButton : true, isHero : false},
  //   // {id: 7, playerName : "asdh", balance: 1000, avatar: 8, position: 7, betSize:  9999999, cards: ["cb", "cb"], deck : "boardDeck", isButton : true, isHero : false},
  //   // {id: 8, playerName : "asdi", balance: 1000, avatar: 9, position: 8, betSize:  9999999, cards: ["cb", "cb"], deck : "boardDeck", isButton : true, isHero : false},
  // ]
  function findHero(){
    return 0
    // let index = players.findIndex(p => p.isHero === true)
    // if (index < 0) return 0
    // return index
  }
  let heroPlaceHolder = {id: 1, playerName : "Hero", balance: 1000, avatar: 1, position: 0, betSize:  0, cards: [], deck : "playerDeck", isButton : true, isHero : true};
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
  function toggleSitout() {
    console.log("toggleSitout()")
    playerSitout = !playerSitout
    if (!playerSitout) sitoutPopover(playerSitout)
    api.send("sitoutUpdate", {playerID: hero.id, poolID: hero.poolID, isSitout: playerSitout})
  }
  let playerSitout = false;
  let sitoutPopoverActive = false;
  function sitoutPopover(isSitout = true) {
    console.log("sitoutPopover" + isSitout)
    const target = document.getElementById("sitoutPopover")
    if (isSitout) target?.showPopover()
    if (!isSitout) target?.hidePopover()
    sitoutPopoverActive = isSitout;
    // popovertarget="test"
  }
  let rebuyPopoverActive = false;
  let rebuyAmount = 0;
  function toggleRebuy(){
    console.log("toggleRebuy")
    rebuyAmount = bbSize * 100 - hero.stackSize
    const target = document.getElementById("rebuyPopover")
    if (rebuyPopoverActive) target?.hidePopover()
    if (!rebuyPopoverActive) target?.showPopover()
    rebuyPopoverActive = !rebuyPopoverActive;
    // popovertarget="test"
  }
  function tryRebuy(){
    console.log("toggleRebuy")
    let rebuy = Math.round(rebuyAmount * 100) / 100
    if (rebuy > 0) api.send("tryRebuy", {playerID: hero.id, poolID: hero.poolID, stackSize: rebuy})
    toggleRebuy()
  }
  let hhPopoverActive = false;
  function toggleHH(){
    console.log("toggleHH")
    api.send("toggleHH")
    const target = document.getElementById("hhPopover")
    if (hhPopoverActive) target?.hidePopover()
    if (!hhPopoverActive) target?.showPopover()
    hhPopoverActive = !hhPopoverActive;
    hhIndex = handHistories.length - 1
    // popovertarget="test"
  }
  function changeHandHistoryIndex(direction){
    console.log(`changeHandHistoryIndex(${direction})`)
    if (hhIndex + direction >= 0 && hhIndex + direction < handHistories.length) hhIndex += direction
  }
  let transitioning = false;
  function transitionBackground() {
    transitioning = true;
    setTimeout( () => {
      transitioning = false;
    }, 1000)
  }
  function parseAction(index) {
    let action = possibleActions[index]
    betValue = parseFloat(betValue.toString().replace(",", "."))
    if (index === 2) action.amount = Math.round(betValue * 100) / 100
    api.send("parseAction", {player: hero, action: action})
    possibleActions = []
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
    background-size: cover;
    background-position: center;
    aspect-ratio: 128/108;
    display: flex;
    flex-direction: column;
    // transition: 0.1s;
    // left: 0;
    // border-radius: 4px;
    // border-top-left-radius: 3px;
    // border-top-right-radius: 3px;
}
.bg-table.doordash {
  background-image: url('/fundo doordash.png');
}
.waitingForPlayersDiv{
  position: absolute;
  width: 100%;
  top: 50%;
  // left: 40%;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  .waitingForPlayersText{
    // background-color: #c1c1c1;
    color: white;
    animation-name: pulseWaitingPlayer; 
    animation-duration: 1.5s; 
    animation-timing-function: ease-in-out; 
    animation-direction: alternate; 
    animation-iteration-count: infinite; 
    animation-play-state: running; 
  }
}
@keyframes pulseWaitingPlayer {
  0% {
    opacity: 0.3
  }
  100% {
    opacity: 0.8

  }
}
.transitioning {
    position: absolute;
    z-index: 10000;
    width: 200%;
    height: 100%;
    left: -200%;
    background-image: url('/transitionBackground.png');
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    animation-name: slideInOut;
    animation-timing-function: linear;
    animation-duration: 1s;
    // left: -100vw;
    // animation: forwards 1s ease-in-out;
}
@keyframes slideInOut {
  from {left: 200%}
  to {left: -200%}
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
button:active:enabled {
  transform: scale(0.95);
}
button {
  all: unset;
  border: none;
  border-bottom: 0.4vh solid #c1c1c1;
  background-color: #e3e3e3;
  border-radius: 1.3vw;
}
button:hover {
  background-color: white;
}
button:disabled {
  opacity:0.7
}
.handStrengthDiv {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c1c1c1;
  width: 10%;
  top: 90%;
  left: 45%
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
    z-index: 10;
    .betDisplayRow {
      display: flex;
      width: 100%;
      height: 30%;
      flex-direction: row;
      // background-color: blue;
      align-items: center;
      gap: 1%;
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
           -webkit-appearance: none;
           margin: 0;
      }
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
      /* Chrome, Safari, Edge, Opera */
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
      .fastFold{
        text-decoration: underline;
        font-weight: bold;
        font-style: italic;
        text-underline-offset: 0.25em;
      }
      span {
        transform: translateY(0.2vh);
      }
    }
    .allin {
      background-color: red;
    }
    .playerButtonHide {
      display: none;
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
    width: 35%;
    height: 15%;
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
    height: 4.5%;
    top: 20px;
    display: flex;
    z-index: 100;
    gap: 0.5%;
    padding-top: 0.5%;
    padding-left: 0.5%;
    button {
      width: 8%;
      font-size: 0.6em;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sitout {
      background-color: lightcoral;
    }
  }

  .rebuyPopover {
    width: 50%;
    height: 50%;
    // display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0;
  }
  .hhPopover {
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
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #888888;
    padding: 0 1%;
    background-color: #1d1d1d;
    color: #e5e5e5;
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 90%;
      aspect-ratio: 1;
      font-size: 1em;
    }
    .closeButton {
      position: absolute;
      color: #1d1d1d;
      height: 4%;
      right: 0.25%;
      top: 0.25%;
    }
  }
  .popoverMain {
    width: 100%;
    height: 95%;
    // background-color: yellow;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 1%;
    background-color: #1d1d1d;
    color: #e5e5e5;
    .handHistory {
      font-size: 0.75em;
      white-space: pre-line;
      background-color: #2d2d2d;
      width: 96%;
      height: 95%;
      border-radius: 5px;
      padding: 1%;
      overflow-y: auto;
    }
  }
  .popoverOverlay.active {
    position: absolute;
    background-color: rgba(0,0,0,0.5);
    top: 20px;
    height: calc(100% - 20px);
    width: 100%;
    z-index: 10000;

    
  }
  
  // ::backdrop {
  // }
</style>

<main>
  <TitleBar {winTitle}/>
  <div class="auxiliarButtons">
    <button on:click={tileTables}>Tile Tables</button>
    <button on:click={toggleHH}>Hand History</button>
    <button on:click={toggleRebuy}>Rebuy</button>
    <button on:click={toggleSitout} class:sitout={playerSitout}>Sitout</button>
  </div>
  <div class="bg-table" class:doordash={doordashTable} on:wheel={handleScroll}>
    <div class:transitioning={transitioning}></div>
    {#if waitingForPlayers && !playerSitout}
      <div class="waitingForPlayersDiv">
        <span class="waitingForPlayersText">Waiting for players...</span>
      </div>
    {/if}
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
      {#each Object.entries(players) as [playerID, player]}
        <Player {...player} bind:tableRotateAmount={tableRotateAmount} bind:tableSize = {tableSize} bind:handIsBeingPlayed = {handIsBeingPlayed} bind:this={playersComponents[playerID]}/> 
        <!--bind:this={playersComponents[playerID]}-->
      {/each}
    {:else}
      <!-- <Player bind:tableSize = {tableSize} bind:tableRotateAmount = {tableRotateAmount} bind:player = {heroPlaceHolder}/> -->
    {/if}
    {#if possibleActions.length > 0}
      <div class="playButtonsContainer"> <!--transition:slide={{duration: 250, axis:"x"}}-->
        {#if possibleActions.length > 1}
          <div class="betDisplayRow">
            <div class="presetButtons">
              <button class="presetBetSizeButton" on:click={()=>updateBetValue(25)}>25%</button>
              <button class="presetBetSizeButton" on:click={()=>updateBetValue(50)}>50%</button>
              <button class="presetBetSizeButton" on:click={()=>updateBetValue(75)}>75%</button>
              <button class="presetBetSizeButton" on:click={()=>updateBetValue(100)}>100%</button>
            </div>
            <label class="dolarSign">$</label>
            <input class="betDisplay" bind:value={betValue} type="number" step="0.01" on:keydown={() => betValue = Number(betValue.toFixed(1))}/>
          </div>
          <div class="betSlider">
            <button class="betSliderButton" on:click={minusBetSlider}><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM152 232H296c13.3 0 24 10.7 24 24s-10.7 24-24 24H152c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/></svg></button>
            <input type="range" min={minBet} max={maxBet} step=0.01 bind:value={betValue} class="slider" id="myRange">
            <button class="betSliderButton" on:click={plusBetSlider}><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg></button>
          </div>
        {/if}
        <div class="buttons">
            {#each possibleActions as action, index}
              {#if index<2}
                <button class="playButton" class:playerButtonHide={action.amount >= hero.betSize + hero.stackSize} on:click={() => parseAction(index)} >
                  <span class:fastFold={action.type === "⚡Fold"}>{action.type}</span>
                  {#if action.amount > 0}
                    <span class="value">{Math.round((action.amount - hero.betSize)*100)/100}</span>
                  {/if}
                </button>
              {:else}
                <!-- <button class="playButton" class:allin={betValue >= hero.betSize + hero.stackSize} on:click={() => parseAction(index)} > -->
                <button class="playButton" on:click={() => parseAction(index)} >
                  {#if betValue < hero.betSize + hero.stackSize}
                    <span>{action.type}</span>
                  {:else}
                    <span>All-in</span>
                  {/if}
                  <span class="value">{betValue}</span>
                </button>
              {/if}
            {/each}
            <!-- <button class="playButton" on:click={callAction}><span>Call</span><span class="value">0123456789</span></button>
            <button class="playButton" on:click={raiseAction}><span>Raise</span><span class="value">{betValue}</span></button> -->
        </div>
      </div>
    {/if}
    {#if handStrength && handStrength != ""}
      <div class="handStrengthDiv">
        <span>{handStrength}</span>
      </div>
    {/if}
    
    <div class="popoverOverlay" class:active={sitoutPopoverActive} on:click={() => sitoutPopover(false)}></div>
    <div class="sitoutPopover" popover id="sitoutPopover">
      <div class="popoverTitle">
        <span>Sitout</span>
        <button class="closeButton" on:click={() => sitoutPopover(false)}>X</button>
      </div>
      <div class="popoverMain">
        You are sitout
        <button on:click={toggleSitout}>I`m Back!`</button>
      </div>
    </div>
    <div class="popoverOverlay" class:active={hhPopoverActive} on:click={toggleHH}></div>
    <div class="hhPopover" popover id="hhPopover">
      <div class="popoverTitle">
        <button disabled={hhIndex<=0} on:click={() => {changeHandHistoryIndex(-1)}}><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg></button>
        <span><pre>Hand History {hhIndex+1}/{handHistories.length}</pre></span>
        <button disabled={hhIndex>=handHistories.length-1} on:click={() => {changeHandHistoryIndex(1)}}><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg></button>
        <button class="closeButton" on:click={toggleHH}>X</button>
      </div>
      <div class="popoverMain">
        {#if handHistories.length>0}
          <div class="handHistory">{handHistories[hhIndex]}</div>
        {:else}
          <div class="handHistory">Hand History Is Empty</div>
        {/if}
      </div>
    </div>
    <div class="popoverOverlay" class:active={rebuyPopoverActive} on:click={toggleRebuy}></div>
    <div class="rebuyPopover" popover id="rebuyPopover">
      <div class="popoverTitle">
        <span>Rebuy</span>
        <button class="closeButton" on:click={toggleRebuy}>X</button>
      </div>
      <div class="popoverMain">
        <label for="rebuyAmount">Amount to Rebuy</label>
        <input placeholder="Amount to Rebuy" id="rebuyAmount" bind:value={rebuyAmount} step=0.01 type="number"/>
        <button on:click={tryRebuy}>Rebuy</button>
      </div>
    </div>
    <div class="adsContainer">
      {#if !doordashTable}
        <Ads bind:changeAds={callChangeAds}/>
      {/if}
    </div>
  </div>
</main>

