import { c as create_ssr_component, v as validate_component, f as each, d as add_attribute, e as escape, h as null_to_empty } from './ssr-8d0cd32c.js';
import { T as Title_Bar } from './Title_Bar-87c48394.js';

const globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : (
  // @ts-ignore Node typings have this
  global
);
const css$4 = {
  code: '.adsDiv.svelte-ngdqiy{width:100%;height:100%;border-radius:5px;border:1px solid black;background-color:rgba(255,255,255, 0.5);display:flex;justify-content:center;align-items:center}.adsImage.svelte-ngdqiy{background-image:url("/originalLogo.png");background-position:center;background-repeat:no-repeat;background-size:contain;width:90%;height:90%}',
  map: null
};
const Ads = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$4);
  return `<div class="adsDiv svelte-ngdqiy" data-svelte-h="svelte-1lz2kfp"><div class="adsImage svelte-ngdqiy"></div> </div>`;
});
const css$3 = {
  code: ".card.svelte-1u6gdwv{background-image:var(--card-url);background-position:center;background-size:contain;background-repeat:no-repeat;width:100%;height:100%;z-index:100}",
  map: null
};
const Card = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cardUrl;
  let cssVarStyles;
  let { cardString } = $$props;
  let { deck: deck2 } = $$props;
  if ($$props.cardString === void 0 && $$bindings.cardString && cardString !== void 0)
    $$bindings.cardString(cardString);
  if ($$props.deck === void 0 && $$bindings.deck && deck2 !== void 0)
    $$bindings.deck(deck2);
  $$result.css.add(css$3);
  cardUrl = `url('/baralho/${deck2}/${cardString}.png')`;
  cssVarStyles = `--card-url:${cardUrl}`;
  return `<div class="card svelte-1u6gdwv"${add_attribute("style", cssVarStyles, 0)}></div>`;
});
const css$2 = {
  code: '.playerWrapper.svelte-meo5f9.svelte-meo5f9{all:unset;position:absolute;height:calc(0.15 * var(--height));display:flex;align-items:center}.playerRow.svelte-meo5f9.svelte-meo5f9{all:unset;position:absolute;width:100%;height:calc(0.15 * var(--height));display:flex;flex-direction:row;align-items:center}.row1.svelte-meo5f9.svelte-meo5f9{top:6%;font-size:calc(var(--root-font-size) * 0.85)}.row1.svelte-meo5f9 .player.svelte-meo5f9{height:calc(0.24 * var(--height))}.row2.svelte-meo5f9.svelte-meo5f9{top:12%;font-size:calc(var(--root-font-size) * 0.9)}.row2.svelte-meo5f9 .player.svelte-meo5f9{height:calc(0.26 * var(--height))}.row2.svelte-meo5f9 .playerButton.svelte-meo5f9{top:calc(0.18 * var(--height))}.row2.svelte-meo5f9 .playerCards.svelte-meo5f9{top:calc(0.255 * var(--height))}.row3.svelte-meo5f9.svelte-meo5f9{top:45%;font-size:calc(var(--root-font-size) * 0.95)}.row3.svelte-meo5f9 .player.svelte-meo5f9{height:calc(0.28 * var(--height))}.row3.svelte-meo5f9 .playerButton.svelte-meo5f9{top:calc(0.05 * var(--height))}.row3.svelte-meo5f9 .playerCards.svelte-meo5f9{top:calc(0.105 * var(--height))}.row4.svelte-meo5f9.svelte-meo5f9{top:67%}.row4.svelte-meo5f9 .player.svelte-meo5f9{height:calc(0.3 * var(--height))}.middleColumn.svelte-meo5f9.svelte-meo5f9{justify-content:center}.middleColumn.svelte-meo5f9 .playerBet.svelte-meo5f9{left:20%}.leftColumn.svelte-meo5f9.svelte-meo5f9{justify-content:flex-start;padding:5%;width:90%}.rightColumn.svelte-meo5f9.svelte-meo5f9{justify-content:flex-end;padding:5%;width:90%}.row5.svelte-meo5f9.svelte-meo5f9{top:67%}.row5.svelte-meo5f9 .player.svelte-meo5f9{height:calc(0.3 * var(--height))}.table9max.row1.svelte-meo5f9.svelte-meo5f9{top:5%}.table9max.row1.svelte-meo5f9 .player.svelte-meo5f9{height:calc(0.22 * var(--height))}.table9max.row2.svelte-meo5f9.svelte-meo5f9{top:10%}.table9max.row2.svelte-meo5f9 .player.svelte-meo5f9{height:calc(0.24 * var(--height))}.table9max.row3.svelte-meo5f9.svelte-meo5f9{top:35%}.table9max.row3.svelte-meo5f9 .player.svelte-meo5f9{height:calc(0.26 * var(--height))}.table9max.row4.svelte-meo5f9.svelte-meo5f9{top:60%}.table9max.row4.svelte-meo5f9 .player.svelte-meo5f9{height:calc(0.28 * var(--height))}.table9max.leftColumn.svelte-meo5f9.svelte-meo5f9{justify-content:flex-start;padding:0 0.5%;width:100%}.table9max.leftMiddleTopColumn.svelte-meo5f9.svelte-meo5f9{justify-content:flex-start;padding:0 32.5%;width:75%}.table9max.leftMiddleColumn.svelte-meo5f9.svelte-meo5f9{justify-content:flex-start;padding:0 10%;width:80%}.table9max.rightMiddleColumn.svelte-meo5f9.svelte-meo5f9{justify-content:flex-end;padding:0%;width:90%}.table9max.rightMiddleTopColumn.svelte-meo5f9.svelte-meo5f9{justify-content:flex-end;padding:0%;width:67.5%}.table9max.rightColumn.svelte-meo5f9.svelte-meo5f9{justify-content:flex-end;padding:0%;width:99.5%}.player.svelte-meo5f9.svelte-meo5f9{all:unset;position:relative;display:flex;flex-direction:column;aspect-ratio:6/8;z-index:1}.playerImage.svelte-meo5f9.svelte-meo5f9{position:relative;margin:0 auto;width:90%;height:70%;background-image:var(--avatar-url);background-position:center;background-size:contain;background-repeat:no-repeat}.playerName.svelte-meo5f9.svelte-meo5f9{width:100%;height:12%;background-color:#464c5d;display:flex;flex-direction:row;justify-content:flex-end;align-items:center;z-index:2}.playerName.svelte-meo5f9 span.svelte-meo5f9{color:whitesmoke;padding-right:5%}.playerBalance.svelte-meo5f9.svelte-meo5f9{width:100%;height:18%;background-color:#353a48;display:flex;flex-direction:row;justify-content:flex-end;align-items:center;z-index:2}.playerBalance.svelte-meo5f9 span.svelte-meo5f9{color:whitesmoke;padding-right:5%}.playerBalance.svelte-meo5f9 .svelte-meo5f9::before{position:absolute;content:"$";left:5%}.playerButton.svelte-meo5f9.svelte-meo5f9{background-image:url("./Dealer.png");background-position:center;background-size:contain;background-repeat:no-repeat;position:absolute;width:calc(0.03 * var(--height));aspect-ratio:1;border-radius:50%;top:15%;display:flex;color:white;align-items:center;justify-content:center}.playerCards.svelte-meo5f9.svelte-meo5f9{position:absolute;width:30%;aspect-ratio:1;display:flex;align-items:center;justify-content:center;transition:1s}.playerCards.svelte-meo5f9 .svelte-meo5f9:first-child{transform:translateX(15%) translateY(-10%) rotate(-100deg)}.playerCards.svelte-meo5f9 .svelte-meo5f9:last-child{transform:translateX(-75%) translateY(10%) rotate(-80deg)}.pos0.svelte-meo5f9 .playerCards.svelte-meo5f9{left:85%;top:20%}.pos0.svelte-meo5f9 .playerCards .svelte-meo5f9:first-child{transform:translateX(15%) translateY(10%) rotate(-130deg);z-index:1}.pos0.svelte-meo5f9 .playerCards .svelte-meo5f9:last-child{transform:translateX(-95%) translateY(-5%) rotate(-150deg)}.pos0.svelte-meo5f9 .playerCards.fold.svelte-meo5f9{top:-18vh;left:10vw;opacity:0}.pos0.svelte-meo5f9 .playerButton.svelte-meo5f9{top:25%}.pos1.svelte-meo5f9 .playerButton.svelte-meo5f9{left:75%}.pos1.svelte-meo5f9 .playerCards.svelte-meo5f9{left:85%}.pos1.svelte-meo5f9 .playerCards .svelte-meo5f9:first-child{transform:translateX(15%) translateY(10%) rotate(-130deg);z-index:1}.pos1.svelte-meo5f9 .playerCards .svelte-meo5f9:last-child{transform:translateX(-95%) translateY(-5%) rotate(-150deg)}.pos1.svelte-meo5f9 .playerBet.svelte-meo5f9{top:25%;left:80%}.pos1.svelte-meo5f9 .playerCards.fold.svelte-meo5f9{top:-2vh;left:45vw;opacity:0}.pos2.svelte-meo5f9 .playerButton.svelte-meo5f9{left:120%}.pos2.svelte-meo5f9 .playerCards.svelte-meo5f9{left:70%}.pos2.svelte-meo5f9 .playerCards .svelte-meo5f9:first-child{transform:translateX(55%) translateY(10%) rotate(-80deg);z-index:1}.pos2.svelte-meo5f9 .playerCards .svelte-meo5f9:last-child{transform:translateX(-80%) translateY(20%) rotate(-40deg)}.pos2.svelte-meo5f9 .playerBet.svelte-meo5f9{top:85%;left:100%}.pos2.svelte-meo5f9 .playerCards.fold.svelte-meo5f9{top:30vh;left:45vw;opacity:0}.pos3.svelte-meo5f9 .playerButton.svelte-meo5f9{top:95%;left:105%}.pos3.svelte-meo5f9 .playerCards.svelte-meo5f9{top:100%;left:5%}.pos3.svelte-meo5f9 .playerCards .svelte-meo5f9:first-child{transform:translateX(5%) translateY(15%) rotate(-45deg)}.pos3.svelte-meo5f9 .playerCards .svelte-meo5f9:last-child{transform:translateX(-45%) translateY(15%) rotate(-55deg)}.pos3.svelte-meo5f9 .playerBet.svelte-meo5f9{top:105%;left:40%}.pos3.svelte-meo5f9 .playerCards.fold.svelte-meo5f9{top:40vh;left:8vw;opacity:0}.pos4.svelte-meo5f9 .playerButton.svelte-meo5f9{right:120%}.pos4.svelte-meo5f9 .playerCards.svelte-meo5f9{left:10%}.pos4.svelte-meo5f9 .playerCards .svelte-meo5f9:first-child{transform:translateX(15%) translateY(23%) rotate(-30deg)}.pos4.svelte-meo5f9 .playerCards .svelte-meo5f9:last-child{transform:translateX(-50%) translateY(20%) rotate(-60deg)}.pos4.svelte-meo5f9 .playerBet.svelte-meo5f9{top:85%;right:100%}.pos4.svelte-meo5f9 .playerCards.fold.svelte-meo5f9{top:30vh;left:-28vw;opacity:0}.pos5.svelte-meo5f9 .playerButton.svelte-meo5f9{right:75%}.pos5.svelte-meo5f9 .playerCards.svelte-meo5f9{left:-5%}.pos5.svelte-meo5f9 .playerCards .svelte-meo5f9:first-child{transform:translateX(15%) translateY(-5%) rotate(60deg)}.pos5.svelte-meo5f9 .playerCards .svelte-meo5f9:last-child{transform:translateX(-80%) translateY(5%) rotate(30deg)}.pos5.svelte-meo5f9 .playerBet.svelte-meo5f9{top:25%;right:80%}.pos5.svelte-meo5f9 .playerCards.fold.svelte-meo5f9{top:-2vh;left:-28vw;opacity:0}.table9max.pos0.svelte-meo5f9 .playerCards.svelte-meo5f9{left:85%;top:20%}.table9max.pos0.svelte-meo5f9 .playerCards .svelte-meo5f9:first-child{transform:translateX(15%) translateY(10%) rotate(-130deg);z-index:1}.table9max.pos0.svelte-meo5f9 .playerCards .svelte-meo5f9:last-child{transform:translateX(-95%) translateY(-5%) rotate(-150deg)}.table9max.pos1.svelte-meo5f9 .playerButton.svelte-meo5f9{left:70%}.table9max.pos1.svelte-meo5f9 .playerCards.svelte-meo5f9{left:85%;top:30%}.table9max.pos1.svelte-meo5f9 .playerCards .svelte-meo5f9:first-child{transform:translateX(30%) translateY(10%) rotate(-130deg);z-index:1}.table9max.pos1.svelte-meo5f9 .playerCards .svelte-meo5f9:last-child{transform:translateX(-80%) translateY(-5%) rotate(-150deg)}.table9max.pos1.svelte-meo5f9 .playerBet.svelte-meo5f9{top:15%;left:80%}.table9max.pos2.svelte-meo5f9 .playerButton.svelte-meo5f9{top:45%;left:115%}.table9max.pos2.svelte-meo5f9 .playerCards.svelte-meo5f9{top:70%;left:110%}.table9max.pos2.svelte-meo5f9 .playerCards .svelte-meo5f9:first-child{transform:translateX(25%) translateY(25%) rotate(-120deg)}.table9max.pos2.svelte-meo5f9 .playerCards .svelte-meo5f9:last-child{transform:translateX(-80%) translateY(15%) rotate(-140deg)}.table9max.pos2.svelte-meo5f9 .playerBet.svelte-meo5f9{top:60%;left:100%}.table9max.pos3.svelte-meo5f9 .playerButton.svelte-meo5f9{top:95%;left:115%}.table9max.pos3.svelte-meo5f9 .playerCards.svelte-meo5f9{top:100%;left:80%}.table9max.pos3.svelte-meo5f9 .playerCards .svelte-meo5f9:first-child{transform:translateX(-25%) translateY(25%) rotate(-35deg);z-index:1}.table9max.pos3.svelte-meo5f9 .playerCards .svelte-meo5f9:last-child{transform:translateX(-145%) translateY(25%) rotate(-55deg)}.table9max.pos3.svelte-meo5f9 .playerBet.svelte-meo5f9{top:110%;left:95%}.table9max.pos4.svelte-meo5f9 .playerButton.svelte-meo5f9{top:100%;left:80%}.table9max.pos4.svelte-meo5f9 .playerCards.svelte-meo5f9{top:96%;left:15%}.table9max.pos4.svelte-meo5f9 .playerCards .svelte-meo5f9:first-child{transform:translateX(15%) translateY(23%) rotate(-50deg)}.table9max.pos4.svelte-meo5f9 .playerCards .svelte-meo5f9:last-child{transform:translateX(-50%) translateY(20%) rotate(-70deg)}.table9max.pos4.svelte-meo5f9 .playerBet.svelte-meo5f9{top:120%;left:40%}.table9max.pos5.svelte-meo5f9 .playerButton.svelte-meo5f9{left:5%;top:100%}.table9max.pos5.svelte-meo5f9 .playerCards.svelte-meo5f9{top:96%;left:75%}.table9max.pos5.svelte-meo5f9 .playerCards .svelte-meo5f9:first-child{transform:translateX(-85%) translateY(23%) rotate(-60deg)}.table9max.pos5.svelte-meo5f9 .playerCards .svelte-meo5f9:last-child{transform:translateX(-150%) translateY(20%) rotate(-75deg)}.table9max.pos5.svelte-meo5f9 .playerBet.svelte-meo5f9{top:120%;left:0%}.table9max.pos6.svelte-meo5f9 .playerButton.svelte-meo5f9{left:-20%;top:95%}.table9max.pos6.svelte-meo5f9 .playerCards.svelte-meo5f9{top:98%;left:25%}.table9max.pos6.svelte-meo5f9 .playerCards .svelte-meo5f9:first-child{transform:translateX(-85%) translateY(23%) rotate(-40deg)}.table9max.pos6.svelte-meo5f9 .playerCards .svelte-meo5f9:last-child{transform:translateX(-150%) translateY(20%) rotate(-55deg)}.table9max.pos6.svelte-meo5f9 .playerBet.svelte-meo5f9{top:110%;left:-60%}.table9max.pos7.svelte-meo5f9 .playerButton.svelte-meo5f9{left:-20%;top:45%}.table9max.pos7.svelte-meo5f9 .playerCards.svelte-meo5f9{top:68%;left:-15%}.table9max.pos7.svelte-meo5f9 .playerCards .svelte-meo5f9:first-child{transform:translateX(-55%) translateY(23%) rotate(40deg)}.table9max.pos7.svelte-meo5f9 .playerCards .svelte-meo5f9:last-child{transform:translateX(-150%) translateY(20%) rotate(55deg)}.table9max.pos7.svelte-meo5f9 .playerBet.svelte-meo5f9{top:60%;left:-60%}.table9max.pos8.svelte-meo5f9 .playerButton.svelte-meo5f9{left:10%;top:15%}.table9max.pos8.svelte-meo5f9 .playerCards.svelte-meo5f9{top:25%;left:5%}.table9max.pos8.svelte-meo5f9 .playerCards .svelte-meo5f9:first-child{transform:translateX(-55%) translateY(23%) rotate(40deg)}.table9max.pos8.svelte-meo5f9 .playerCards .svelte-meo5f9:last-child{transform:translateX(-150%) translateY(20%) rotate(55deg)}.table9max.pos8.svelte-meo5f9 .playerBet.svelte-meo5f9{top:15%;left:-50%}.playerCircle.svelte-meo5f9.svelte-meo5f9{position:absolute;height:40%;top:60%;left:8.5%;aspect-ratio:2/1;background:gray;opacity:0.15;border-radius:10rem 10rem 0 0;z-index:-1}.card.svelte-meo5f9.svelte-meo5f9{background-position:center;background-size:contain;background-repeat:no-repeat;height:100%;aspect-ratio:6/9}.playerCardsHero.svelte-meo5f9.svelte-meo5f9{position:absolute;height:40%;aspect-ratio:4/3;top:45%;left:14%;opacity:1;z-index:1;display:flex;flex-direction:row;gap:1%;transition:1s}.playerCardsHero.svelte-meo5f9 .svelte-meo5f9:last-child{z-index:2}.playerCardsHero.fold.svelte-meo5f9.svelte-meo5f9{top:-15vh;left:14%;opacity:0}.playerBet.svelte-meo5f9.svelte-meo5f9{position:absolute;font-size:0.8em;width:60%;height:10%;color:white;display:flex;justify-content:center;align-items:center;top:-5%;border-radius:5px}.playerBet.svelte-meo5f9 .value.svelte-meo5f9::before{content:"$ "}.playerBet.svelte-meo5f9 span.svelte-meo5f9{background-color:rgba(77, 77, 77, 0.25);padding:2% 5%;border-radius:5px}.playerGlow.svelte-meo5f9.svelte-meo5f9{position:absolute;width:150%;aspect-ratio:1;background:radial-gradient(rgb(255, 255, 255), rgba(255, 255, 255, 0) 55%);left:-25%;display:none}.glowPlayerAnimation.svelte-meo5f9.svelte-meo5f9{display:initial;animation-name:svelte-meo5f9-glow;animation-duration:1s;animation-timing-function:linear;animation-direction:alternate;animation-iteration-count:infinite}@keyframes svelte-meo5f9-glow{0%{background:radial-gradient(rgb(255, 255, 255), rgba(255, 255, 255, 0) 50%)}10%{background:radial-gradient(rgb(255, 255, 255), rgba(255, 255, 255, 0) 50.5%)}20%{background:radial-gradient(rgb(255, 255, 255), rgba(255, 255, 255, 0) 51%)}30%{background:radial-gradient(rgb(255, 255, 255), rgba(255, 255, 255, 0) 51.5%)}40%{background:radial-gradient(rgb(255, 255, 255), rgba(255, 255, 255, 0) 52%)}50%{background:radial-gradient(rgb(255, 255, 255), rgba(255, 255, 255, 0) 52.5%)}60%{background:radial-gradient(rgb(255, 255, 255), rgba(255, 255, 255, 0) 53%)}70%{background:radial-gradient(rgb(255, 255, 255), rgba(255, 255, 255, 0) 53.5%)}80%{background:radial-gradient(rgb(255, 255, 255), rgba(255, 255, 255, 0) 54%)}90%{background:radial-gradient(rgb(255, 255, 255), rgba(255, 255, 255, 0) 54.5%)}100%{background:radial-gradient(rgb(255, 255, 255), rgba(255, 255, 255, 0) 55%)}}.timer.svelte-meo5f9.svelte-meo5f9{position:absolute;height:1%;width:100%;top:100%}.timer.svelte-meo5f9 .background.svelte-meo5f9{position:absolute;background:linear-gradient(90deg, darkred, yellow 75%);height:100%;width:100%}.timer.svelte-meo5f9 .timePasser.svelte-meo5f9{position:absolute;background-color:#353a48;height:100%;left:var(--time-left-perc);width:calc(100% - var(--time-left-perc));z-index:10}',
  map: null
};
const deck = "boardDeck";
const Player = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cssVarStyles;
  let { tableSize } = $$props;
  let { tableRotateAmount } = $$props;
  let { id, name, stackSize, avatar, position, betSize, cards, isButton, showCards, hasFolded, isSitout, isHero, possibleActions } = $$props;
  let playerTurn = false;
  let positionClassByTableSize = {
    2: {
      0: "playerRow middleColumn pos0 row4",
      1: "playerRow middleColumn pos3 row1"
    },
    3: {
      0: "playerRow middleColumn pos0 row4",
      1: "playerRow leftColumn pos2 row2",
      2: "playerRow rightColumn pos4 row2"
    },
    6: {
      0: "playerRow middleColumn pos0 row4",
      1: "playerRow leftColumn pos1 row3",
      2: "playerRow leftColumn pos2 row2",
      3: "playerRow middleColumn pos3 row1",
      4: "playerRow rightColumn pos4 row2",
      5: "playerRow rightColumn pos5 row3"
    },
    9: {
      0: "table9max playerRow middleColumn pos0 row5",
      1: "table9max playerRow leftMiddleColumn pos1 row4",
      2: "table9max playerRow leftColumn pos2 row3",
      3: "table9max playerRow leftMiddleColumn pos3 row2",
      4: "table9max playerRow leftMiddleTopColumn pos4 row1",
      5: "table9max playerRow rightMiddleTopColumn pos5 row1",
      6: "table9max playerRow rightMiddleColumn pos6 row2",
      7: "table9max playerRow rightColumn pos7 row3",
      8: "table9max playerRow rightMiddleColumn pos8 row4"
    }
  };
  let playerCards;
  let playerCardsHero;
  function dealCards() {
    console.log("dealCard called at player " + playerID);
  }
  function foldCards() {
    console.log("foldCards() called at player " + playerID);
  }
  function call(amount) {
    console.log(`call(${amount}) called at player ${playerID}`);
    betSize = amount;
  }
  let timeLeftPerc = 100;
  let timer;
  function startPlayerTurn(timeLimit) {
    console.log("startPlayerTurn(timeLimit)");
    console.log(position);
    console.log(name);
    console.log(id);
    endPlayerTurn();
    console.log(timeLimit);
    playerTurn = true;
    let timeDiff = timeLimit - (/* @__PURE__ */ new Date()).getTime();
    timeLeftPerc = timeDiff / 2e4 * 100;
    console.log(timeLeftPerc);
    timer = setInterval(
      () => {
        if (playerTurn === false)
          return;
        if (timeLeftPerc > 1)
          return timeLeftPerc -= 1;
        if (timeLeftPerc > 0)
          return timeLeftPerc -= timeLeftPerc;
        endPlayerTurn();
      },
      timeDiff / 100
    );
  }
  function endPlayerTurn() {
    clearInterval(timer);
    playerTurn = false;
    timeLeftPerc = 100;
  }
  let avatarUrl = `url('/avatar/${avatar}.png')`;
  let positioningClass = positionClassByTableSize[tableSize][(position - tableRotateAmount + tableSize) % tableSize];
  if ($$props.tableSize === void 0 && $$bindings.tableSize && tableSize !== void 0)
    $$bindings.tableSize(tableSize);
  if ($$props.tableRotateAmount === void 0 && $$bindings.tableRotateAmount && tableRotateAmount !== void 0)
    $$bindings.tableRotateAmount(tableRotateAmount);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.stackSize === void 0 && $$bindings.stackSize && stackSize !== void 0)
    $$bindings.stackSize(stackSize);
  if ($$props.avatar === void 0 && $$bindings.avatar && avatar !== void 0)
    $$bindings.avatar(avatar);
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  if ($$props.betSize === void 0 && $$bindings.betSize && betSize !== void 0)
    $$bindings.betSize(betSize);
  if ($$props.cards === void 0 && $$bindings.cards && cards !== void 0)
    $$bindings.cards(cards);
  if ($$props.isButton === void 0 && $$bindings.isButton && isButton !== void 0)
    $$bindings.isButton(isButton);
  if ($$props.showCards === void 0 && $$bindings.showCards && showCards !== void 0)
    $$bindings.showCards(showCards);
  if ($$props.hasFolded === void 0 && $$bindings.hasFolded && hasFolded !== void 0)
    $$bindings.hasFolded(hasFolded);
  if ($$props.isSitout === void 0 && $$bindings.isSitout && isSitout !== void 0)
    $$bindings.isSitout(isSitout);
  if ($$props.isHero === void 0 && $$bindings.isHero && isHero !== void 0)
    $$bindings.isHero(isHero);
  if ($$props.possibleActions === void 0 && $$bindings.possibleActions && possibleActions !== void 0)
    $$bindings.possibleActions(possibleActions);
  if ($$props.dealCards === void 0 && $$bindings.dealCards && dealCards !== void 0)
    $$bindings.dealCards(dealCards);
  if ($$props.foldCards === void 0 && $$bindings.foldCards && foldCards !== void 0)
    $$bindings.foldCards(foldCards);
  if ($$props.call === void 0 && $$bindings.call && call !== void 0)
    $$bindings.call(call);
  if ($$props.startPlayerTurn === void 0 && $$bindings.startPlayerTurn && startPlayerTurn !== void 0)
    $$bindings.startPlayerTurn(startPlayerTurn);
  if ($$props.endPlayerTurn === void 0 && $$bindings.endPlayerTurn && endPlayerTurn !== void 0)
    $$bindings.endPlayerTurn(endPlayerTurn);
  $$result.css.add(css$2);
  cssVarStyles = `--avatar-url:${avatarUrl};--time-left-perc:${timeLeftPerc}%`;
  {
    console.log(`(${position} - ${tableRotateAmount} + ${tableSize}) % ${tableSize}: ${(position - tableRotateAmount + tableSize) % tableSize}`);
  }
  positioningClass = positionClassByTableSize[tableSize][(position - tableRotateAmount + tableSize) % tableSize];
  {
    console.log(positioningClass);
  }
  return `<div class="${escape(null_to_empty(positioningClass), true) + " svelte-meo5f9"}"><div class="player svelte-meo5f9"><div class="${["playerGlow svelte-meo5f9", playerTurn ? "glowPlayerAnimation" : ""].join(" ").trim()}"></div> <div class="playerImage svelte-meo5f9"${add_attribute("style", cssVarStyles, 0)}><div class="playerCircle svelte-meo5f9"></div></div> <div class="playerName svelte-meo5f9"><span class="svelte-meo5f9">${escape(name)}</span></div> <div class="playerBalance svelte-meo5f9"><span class="svelte-meo5f9">${escape(stackSize)}</span></div> ${betSize > 0 ? `<div class="playerBet svelte-meo5f9"><span class="value svelte-meo5f9">${escape(betSize)}</span></div>` : ``} ${showCards ? `<div class="${[
    "playerCardsHero svelte-meo5f9",
    " " + (hasFolded && isHero ? "fold" : "")
  ].join(" ").trim()}"${add_attribute("this", playerCardsHero, 0)}>${each(cards, (card) => {
    return `<div class="card svelte-meo5f9">${validate_component(Card, "Card").$$render($$result, { cardString: card, deck }, {}, {})}</div>`;
  })} </div>` : `<div class="${["playerCards svelte-meo5f9", hasFolded ? "fold" : ""].join(" ").trim()}"${add_attribute("this", playerCards, 0)}>${each(cards, (card) => {
    return `<div class="card svelte-meo5f9">${validate_component(Card, "Card").$$render($$result, { cardString: card, deck }, {}, {})}</div>`;
  })}  </div>`} ${isButton ? `<div class="playerButton svelte-meo5f9"></div>` : ``} ${playerTurn ? `<div class="timer svelte-meo5f9"><div class="background svelte-meo5f9"></div> <div class="timePasser svelte-meo5f9"${add_attribute("style", cssVarStyles, 0)}></div></div>` : ``}</div></div>`;
});
const css$1 = {
  code: '.pot.svelte-mxdxk0{transform:translateX(-10%)}span.svelte-mxdxk0{background-color:rgba(77,77,77,0.25);width:100%;padding:5% 10%;border-radius:5px;color:white;font-size:0.8em;font-weight:bold;display:flex;justify-content:center;align-items:center}span.svelte-mxdxk0::before{content:"$";padding-right:5%}',
  map: null
};
const Pot = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { potAmount } = $$props;
  if ($$props.potAmount === void 0 && $$bindings.potAmount && potAmount !== void 0)
    $$bindings.potAmount(potAmount);
  $$result.css.add(css$1);
  return `${potAmount != 0 ? `<div class="pot svelte-mxdxk0"><span class="svelte-mxdxk0">${escape(potAmount)}</span></div>` : ``}`;
});
const { Object: Object_1 } = globals;
const css = {
  code: ':root{font-family:"Roboto", sans-serif;-webkit-user-select:none;--height:var(--window-height);--root-font-size:calc(var(--height) * 0.025);font-size:var(--root-font-size)}.bg-table.svelte-1yjx5wx.svelte-1yjx5wx{all:unset;position:relative;height:var(--height);overflow:hidden;background-image:url("/fundo final 1280x1080.png");background-size:cover;background-position:center;aspect-ratio:128/108;display:flex;flex-direction:column}.transitioning.svelte-1yjx5wx.svelte-1yjx5wx{position:absolute;z-index:10000;width:100%;height:100%;left:-100%;background-image:url("/transitionBackground.png");background-position:center;background-size:cover;background-repeat:no-repeat;animation-name:svelte-1yjx5wx-slideInOut;animation-timing-function:linear;animation-duration:1s}@keyframes svelte-1yjx5wx-slideInOut{from{left:100%}to{left:-100%}}.potLine.svelte-1yjx5wx.svelte-1yjx5wx{position:absolute;height:3%;width:26%;display:flex;justify-content:center;align-items:center;flex-direction:row}.potsParalelos.svelte-1yjx5wx.svelte-1yjx5wx{top:37%;left:37%;font-size:0.8em;justify-content:space-around}.potPrincipal.svelte-1yjx5wx.svelte-1yjx5wx{top:50%;left:37%;font-size:1.2em}.board.svelte-1yjx5wx.svelte-1yjx5wx{position:absolute;height:10%;width:30%;top:40%;left:35%;z-index:1;display:flex;flex-direction:row;justify-content:flex-start;align-items:center;gap:1.5%}.card.svelte-1yjx5wx.svelte-1yjx5wx{background-position:center;background-size:contain;background-repeat:no-repeat;height:100%;aspect-ratio:6/9}.playButtonsContainer.svelte-1yjx5wx.svelte-1yjx5wx{position:absolute;left:61%;top:84%;width:38%;height:15%;display:flex;flex-direction:column;gap:5%}.playButtonsContainer.svelte-1yjx5wx .betDisplayRow.svelte-1yjx5wx{display:flex;width:100%;height:30%;flex-direction:row;align-items:center;gap:1%}.playButtonsContainer.svelte-1yjx5wx .presetButtons.svelte-1yjx5wx{width:50%;height:100%;display:flex;flex-direction:row;gap:1%}.playButtonsContainer.svelte-1yjx5wx .presetButtons .presetBetSizeButton.svelte-1yjx5wx{width:100%;font-size:0.5em;border-radius:5px;background-color:#c1c1c1;display:flex;justify-content:center;align-items:center}.playButtonsContainer.svelte-1yjx5wx .betDisplay.svelte-1yjx5wx{all:unset;background-color:rgba(0, 0, 0, 0.5);width:46%;height:100%;display:flex;justify-content:flex-end;align-items:center;text-align:end;padding:0 2%;border-radius:5px;font-size:0.8em;color:rgba(255, 255, 255, 0.7)}.playButtonsContainer.svelte-1yjx5wx .betDisplay span.svelte-1yjx5wx{color:white;padding-right:5%;opacity:0.7}.playButtonsContainer.svelte-1yjx5wx .betDisplay .svelte-1yjx5wx::before{display:block;position:absolute;color:white;content:"$";align-self:flex-start;font-size:0.5em}.playButtonsContainer.svelte-1yjx5wx .dolarSign.svelte-1yjx5wx{position:absolute;left:52%;color:rgba(255, 255, 255, 0.7);font-size:0.7em}.playButtonsContainer.svelte-1yjx5wx .betDisplay.svelte-1yjx5wx:before{display:block;content:"$";color:white}.playButtonsContainer.svelte-1yjx5wx .betDisplay.svelte-1yjx5wx:hover,.playButtonsContainer.svelte-1yjx5wx .betDisplay.svelte-1yjx5wx:focus{color:rgb(255, 255, 255)}.playButtonsContainer.svelte-1yjx5wx .buttons.svelte-1yjx5wx{display:flex;gap:2%;flex-direction:row;width:100%;height:70%}.playButtonsContainer.svelte-1yjx5wx .playButton.svelte-1yjx5wx:hover,.playButtonsContainer.svelte-1yjx5wx .presetBetSizeButton.svelte-1yjx5wx:hover{background-color:white}.playButtonsContainer.svelte-1yjx5wx button.svelte-1yjx5wx:active{transform:scale(0.95)}.playButtonsContainer.svelte-1yjx5wx button.svelte-1yjx5wx{all:unset}.playButtonsContainer.svelte-1yjx5wx .playButton.svelte-1yjx5wx{position:relative;border:none;width:33%;border-radius:1.3vw;font-size:0.6rem;border-bottom:0.4vh solid #c1c1c1;display:flex;justify-content:center;align-items:center;flex-direction:column;margin:0;background-color:#e3e3e3}.playButtonsContainer.svelte-1yjx5wx .playButton .svelte-1yjx5wx:first-child{font-size:1.3em;text-transform:uppercase}.playButtonsContainer.svelte-1yjx5wx .playButton span.svelte-1yjx5wx{transform:translateY(0.2vh)}.playButtonsContainer.svelte-1yjx5wx .playerButtonHide.svelte-1yjx5wx{display:none}.playButtonsContainer.svelte-1yjx5wx .value.svelte-1yjx5wx::before{content:"$"}.playButtonsContainer.svelte-1yjx5wx .betSlider.svelte-1yjx5wx{border-radius:5px;position:relative;background-color:rgba(0, 0, 0, 0.5);width:100%;height:20%;display:flex;justify-content:space-around;align-items:center;margin:0}.playButtonsContainer.svelte-1yjx5wx .betSlider .betSliderButton.svelte-1yjx5wx{border:none;color:whitesmoke;font-size:1.2em;display:flex;align-items:center;justify-content:center;margin:0;padding:0;width:5%;height:60%}.playButtonsContainer.svelte-1yjx5wx .betSlider .betSliderButton svg.svelte-1yjx5wx{fill:#c1c1c1}.slider.svelte-1yjx5wx.svelte-1yjx5wx{-webkit-app-region:no-drag;-webkit-appearance:none;width:80%;height:25%;border-radius:5px;background:#d3d3d3;opacity:0.7;transition:opacity 0.2s}.slider.svelte-1yjx5wx.svelte-1yjx5wx:hover{opacity:1}.slider.svelte-1yjx5wx.svelte-1yjx5wx::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;height:calc(var(--height) * 0.025);aspect-ratio:1;border-radius:50%;background:white;cursor:pointer;top:0;left:0}.adsContainer.svelte-1yjx5wx.svelte-1yjx5wx{position:absolute;width:38%;height:17%;top:82%;left:1%;z-index:1}.betSliderButton.svelte-1yjx5wx:hover svg.svelte-1yjx5wx{fill:white !important}.auxiliarButtons.svelte-1yjx5wx.svelte-1yjx5wx{position:absolute;width:100%;height:5%;top:20px;display:flex;z-index:100}.rebuyPopover.svelte-1yjx5wx.svelte-1yjx5wx{width:50%;height:50%;flex-direction:column;overflow:hidden;padding:0}.hhPopover.svelte-1yjx5wx.svelte-1yjx5wx{width:80%;height:80%;flex-direction:column;overflow:hidden;padding:0}.popoverTitle.svelte-1yjx5wx.svelte-1yjx5wx{width:98%;height:5%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;border-bottom:1px solid black;padding:0 1%}.popoverTitle.svelte-1yjx5wx button.svelte-1yjx5wx{display:flex;justify-content:center;align-items:center;height:100%;aspect-ratio:1;font-size:1em}.popoverMain.svelte-1yjx5wx.svelte-1yjx5wx{width:100%;height:95%;display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;padding:0 1%}.popoverOverlay.active.svelte-1yjx5wx.svelte-1yjx5wx{position:absolute;background-color:rgba(0, 0, 0, 0.5);width:100%;height:100%;z-index:10000}',
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let winTitle = "";
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
    "hh 10"
  ];
  let hero = {
    id: "",
    poolID: "",
    position: 0,
    cards: [],
    betSize: 0,
    stackSize: 0
  };
  let players = {};
  let playersComponents = {};
  let possibleActions = [];
  let boardCards = [];
  let pots = [0];
  let minBet = 0;
  let maxBet = 9999999;
  let betValue = 50;
  let tableRotateAmount = hero.position;
  let tableSize = 6;
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      console.log(tableRotateAmount = hero.position);
    }
    $$rendered = `<main>${validate_component(Title_Bar, "TitleBar").$$render($$result, { winTitle }, {}, {})} <div class="auxiliarButtons svelte-1yjx5wx"><button data-svelte-h="svelte-kxces6">Tile Tables</button> <button data-svelte-h="svelte-yrrng0">HH</button> <button data-svelte-h="svelte-fli994">Rebuy</button></div> <div class="bg-table svelte-1yjx5wx"><div class="${["svelte-1yjx5wx", ""].join(" ").trim()}"></div> <div class="board svelte-1yjx5wx">${each(boardCards, (card) => {
      return `<div class="card svelte-1yjx5wx">${validate_component(Card, "Card").$$render($$result, { cardString: card, deck: "boardDeck" }, {}, {})}</div>`;
    })}</div> <div class="potLine potPrincipal svelte-1yjx5wx">${validate_component(Pot, "Pot").$$render($$result, { potAmount: pots[0] }, {}, {})}</div> <div class="potLine potsParalelos svelte-1yjx5wx">${each(pots, (pot, index) => {
      return `${index != 0 ? `${validate_component(Pot, "Pot").$$render($$result, { potAmount: pot }, {}, {})}` : ``}`;
    })}</div> ${`${each(Object.entries(players), ([playerID2, player]) => {
      return `${validate_component(Player, "Player").$$render(
        $$result,
        Object_1.assign({}, player, { tableRotateAmount }, { tableSize }, { this: playersComponents[playerID2] }),
        {
          tableRotateAmount: ($$value) => {
            tableRotateAmount = $$value;
            $$settled = false;
          },
          tableSize: ($$value) => {
            tableSize = $$value;
            $$settled = false;
          },
          this: ($$value) => {
            playersComponents[playerID2] = $$value;
            $$settled = false;
          }
        },
        {}
      )} `;
    })}`} ${possibleActions.length > 0 ? `<div class="playButtonsContainer svelte-1yjx5wx"><div class="betDisplayRow svelte-1yjx5wx"><div class="presetButtons svelte-1yjx5wx"><button class="presetBetSizeButton svelte-1yjx5wx" data-svelte-h="svelte-yj1vap">25%</button> <button class="presetBetSizeButton svelte-1yjx5wx" data-svelte-h="svelte-1lx3wyl">50%</button> <button class="presetBetSizeButton svelte-1yjx5wx" data-svelte-h="svelte-7poxfv">75%</button> <button class="presetBetSizeButton svelte-1yjx5wx" data-svelte-h="svelte-km3zjf">100%</button></div> <label class="dolarSign svelte-1yjx5wx" data-svelte-h="svelte-4bzk52">$</label> <input class="betDisplay svelte-1yjx5wx"${add_attribute("value", betValue, 0)}></div> <div class="betSlider svelte-1yjx5wx"><button class="betSliderButton svelte-1yjx5wx" data-svelte-h="svelte-2a3y7c"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" class="svelte-1yjx5wx"><path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM152 232H296c13.3 0 24 10.7 24 24s-10.7 24-24 24H152c-13.3 0-24-10.7-24-24s10.7-24 24-24z" class="svelte-1yjx5wx"></path></svg></button> <input type="range"${add_attribute("min", minBet, 0)}${add_attribute("max", maxBet, 0)} class="slider svelte-1yjx5wx" id="myRange"${add_attribute("value", betValue, 0)}> <button class="betSliderButton svelte-1yjx5wx" data-svelte-h="svelte-mjzih5"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" class="svelte-1yjx5wx"><path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" class="svelte-1yjx5wx"></path></svg></button></div> <div class="buttons svelte-1yjx5wx">${each(possibleActions, (action, index) => {
      return `${index < 2 ? `<button class="${[
        "playButton svelte-1yjx5wx",
        action.amount >= hero.betSize + hero.stackSize ? "playerButtonHide" : ""
      ].join(" ").trim()}"><span class="svelte-1yjx5wx">${escape(action.type)}</span> ${action.amount > 0 ? `<span class="value svelte-1yjx5wx">${escape(action.amount)}</span>` : ``} </button>` : ` <button class="playButton svelte-1yjx5wx">${`<span class="svelte-1yjx5wx" data-svelte-h="svelte-s049cb">All-in</span>`} <span class="value svelte-1yjx5wx">${escape(betValue)}</span> </button>`}`;
    })} </div></div>` : ``} <div class="${["popoverOverlay svelte-1yjx5wx", ""].join(" ").trim()}"></div> <div class="hhPopover svelte-1yjx5wx" popover id="hhPopover"><div class="popoverTitle svelte-1yjx5wx"><span data-svelte-h="svelte-aynhjj">Hand History</span> <button class="svelte-1yjx5wx" data-svelte-h="svelte-1xy11d4">X</button></div> <div class="popoverMain svelte-1yjx5wx">${each(handHistories, (hh, index) => {
      return `<div class="handHistory">${escape(hh)} ${escape(index)}</div>`;
    })}</div></div> <div class="${["popoverOverlay svelte-1yjx5wx", ""].join(" ").trim()}"></div> <div class="rebuyPopover svelte-1yjx5wx" popover id="rebuyPopover"><div class="popoverTitle svelte-1yjx5wx"><span data-svelte-h="svelte-1b1x407">Rebuy</span> <button class="svelte-1yjx5wx" data-svelte-h="svelte-1oiyumr">X</button></div> <div class="popoverMain svelte-1yjx5wx"><label for="rebuyAmount" data-svelte-h="svelte-dtxwhx">Amount to Rebuy</label> <input placeholder="Amount to Rebuy" id="rebuyAmount"> <button data-svelte-h="svelte-fiomgp">Rebuy</button></div></div> <div class="adsContainer svelte-1yjx5wx">${validate_component(Ads, "Ads").$$render($$result, {}, {}, {})}</div></div></main>`;
  } while (!$$settled);
  return $$rendered;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-02495592.js.map
