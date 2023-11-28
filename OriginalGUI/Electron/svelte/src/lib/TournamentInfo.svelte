<script>
    import { onMount } from 'svelte';
    let tabSelected = 0;
    export let tournamentID, state, title, buyIn, tableSize, gameType, playersLeft, totalEntries, startingChips, prizeStructure, playersList, blindStructure, blindLevelUpTime, blindLevel
    export let userID
    export const updateTournamentInfo = (playersList) => {
        console.log("updateTournamentInfo()")
        checkHeroRegistered()
        updateStackAverage()
    }
    $: updateTournamentInfo(playersList)
    let stackAverage = 0
    let heroRegistered = false;
    function updateStackAverage() {
        console.log("updateStackAverage()")
        stackAverage = 0
        playersList.forEach(player => {
            stackAverage += player.stackSize/playersLeft
        })
    }

    onMount(() => {
        if (window.api) {
            api = window.api
        }
        // checkHeroRegistered()
        // updateStackAverage()
    })
    function register() {
        console.log("register()")
        api.send("registerOnTournament", tournamentID)
        // checkHeroRegistered()
        // updateStackAverage()
    }
    function unregister() {
        console.log("unregister()")
        api.send("unregisterOnTournament", tournamentID)
        // checkHeroRegistered()
        // updateStackAverage()
    }
    function checkHeroRegistered() {
        console.log("checkHeroRegistered()")
        for (let i = 0; i<playersList.length; i++) {
            const player = playersList[i]
            console.log("comparing userID")
            console.log(`${userID} === ${player.userID}: ${userID === player.userID}`)
            if (userID === player.userID) {
                heroRegistered = true
                return
            }
        }
        console.log("hero is not registered")
        console.log(userID)
        console.log(playersList)
        heroRegistered = false
        return 
    }
    
</script>
<style style lang="scss">

    container{
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction: column;
        font-size: 0.7em;
        padding: 1%;
    }
    ::-webkit-scrollbar-track
    {
    	-webkit-box-shadow: inset 0 0 6px rgba(49,49,49,0.7);
    	border-radius: 10px;
    	background-color: rgb(18, 18, 18);
    }

    ::-webkit-scrollbar
    {
    	width: 0.5em;
    	background-color: rgb(18, 18, 18);
    }

    ::-webkit-scrollbar-thumb
    {
    	border-radius: 10px;
    	-webkit-box-shadow: inset 0 0 6px rgba(60, 60, 60, 0.7);
    	background-color: rgba(49, 49, 49);
    }
    
    .tabSelection {
        width: 100%;
        height: 5%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        // background-color: green;
        button {
            all: unset;
            position: relative;
            color: rgba(255,255,255,0.5);
            cursor: pointer;
        }
        button.active{
            color: white;
        }
        button:hover {
            color: white;
        }
        button:active {
            transform: scale(0.95);
        }
        button.active::after{
            content: "";
            position: absolute;
            width: 60%;
            height: 0.1em;
            left: 20%;
            background-color: rgb(79,148,217);
            top: 90%;
        }
    }
    .main {
        width: 100%;
        height: 85%;
        display: flex;
        // background-color: red;
    }
    .register {
        width: 100%;
        height: 10%;
        padding-bottom: 0.5em;
        padding-top: 0.5em;
        button {
            all:unset;
            cursor: pointer;
            height: 100%;
            width: 100%;
            color: white;
            background-color: green;
            border: 1px solid black;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 0.5em;
            font-weight: bold;
        }
        button:hover {
            background-color: darkgreen;
        }
        button:active {
            transform: scale(0.95);
        }        
    }
    .homeTab {
        width: 100%;
        height: 100%;
        // min-height: 27.5em;
        max-height: 15.4rem;
        // max-height: 27.5rem;
        display: flex;
        flex-direction: column;
        // gap: 0.1em;
        font-size: 0.7em;
        // background-color: red;
        .homeTitle{
            width: 100%;
            height: 15%;
            min-height: 15%;
            font-size: 1.5em;
            font-weight: bold;
            text-transform: capitalize;
            // border: 1px solid white;
            // background-color: aqua;
        }
        .homeTournamentInfo{
            width: 100%;
            height: 40%;
            min-height: 40%;
            border: 1px solid white;
            // background-color: purple;
            border-collapse: collapse;
        }
        .homePlayersInfo{
            width: 100%;
            height: 20%;
            min-height: 20%;
            border: 1px solid white;
            // background-color: orange;
            border-collapse: collapse;
        }
        .homePrizeInfo{
            width: 100%;
            height: 25%;
            min-height: 25%;
            border: 1px solid white;
            gap: 0 !important; 
            // background-color: bisque;
            border-collapse: collapse;
        }
        .column {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            gap: 0.25em;
            justify-content: center;
            align-items: center;
        }
        .row {
            display: flex;
            flex-direction: row;
            width: 100%;
            height: 100%;
            gap: 0.25em;
            justify-content: center;
            align-items: center;
            .type {
                height: 100%;
                width: 30%;
                color: rgba(255,255,255,0.5)
            }
            .description {
                height: 100%;
                width: 70%;
                color: rgba(255,255,255,0.9)
            }
        }
        .tournamentStack {
            border-bottom: 1px solid white;
            border-collapse: collapse;
        }
        .playersAndPrize.row {
            gap: 0;
        }
        .players.column {
            align-items: flex-start;
            border-right: 1px solid white;
        }
        .prize.column {
            justify-content: flex-start;
        }
        td {
            width: 50%;
            text-align: center;
        }
    }
    .playersTab {
        width: 100%;
        height: 100%;
        max-height: 15.4rem;
        border: 1px solid rgba(255,255,255,0.5);
        font-size: 0.8em;
        overflow-y: auto;
        th, td {
            width: 42.5%;
            text-align: center;
        }
        .rank {
            width: 15%;
            text-align: center;
        }
    }
    .infoTab {
        font-size: 0.8em;
        .blindsTable {
            width: 100%;
            height: 40%;
            max-height: 4.25rem;
            border: 1px solid rgba(255,255,255,0.5);
            font-size: 0.8em;
            overflow-y: auto;
            margin-bottom: 0.5rem;
            th, td {
                width: 25%;
                text-align: center;
            }
        }
        .infoTabTournamentInfo.column {
            width: 100%;
            height: 60%;
            overflow-y: auto;
            max-height: 9rem;
            border: 1px solid rgba(255,255,255,0.5);
            justify-content: flex-start;
        }
        .column {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            gap: 0.25em;
            justify-content: center;
            align-items: center;
        }
        .row {
            display: flex;
            flex-direction: row;
            width: 100%;
            height: 100%;
            gap: 0.25em;
            justify-content: center;
            align-items: center;
            .type {
                height: 100%;
                width: 30%;
                color: rgba(255,255,255,0.5)
            }
            .description {
                height: 100%;
                width: 70%;
                color: rgba(255,255,255,0.9)
            }
        }
    }

    .prizePoolTab {
        width: 100%;
        height: 100%;
        max-height: 15.4rem;
        // max-height: 27.5rem;
        .players.column,
        .nextPayout.column {
            width: 100%;
            height: 25%;
            justify-content: center;
            align-items: center;
            border: 1px solid white;
            border-collapse: collapse;
            display: flex;
            flex-direction: column;
        }
        // .players.column {
        //     width: 100%;
        //     height: 25%;
        //     justify-content: center;
        //     align-items: center;
        //     border: 1px solid white;
        //     border-collapse: collapse;
        // }
    }
    .prizesTable {
        width: 100%;
        height: 50%;
        max-height: 13.5em;
        border: 1px solid rgba(255,255,255,0.5);
        font-size: 0.8em;
        overflow-y: auto;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        tr:nth-child(odd) {
            background-color: #383838;
        }
    }
    tr {
        width: 100%;
        height: 1.1em;
    }
    .tableHead {
        position: sticky;
        top: 0px;
    }
    td {
        width: 50%;
        text-align: center;
    }
</style>
<container>
    <div class="tabSelection">
        <button class:active={tabSelected === 0} on:click={()=>{tabSelected = 0}}>HOME</button>
        <button class:active={tabSelected === 1} on:click={()=>{tabSelected = 1}}>INFO</button>
        <button class:active={tabSelected === 2} on:click={()=>{tabSelected = 2}}>PLAYERS</button>
        <button class:active={tabSelected === 3} on:click={()=>{tabSelected = 3}}>PRIZE POOL</button>
    </div>
    <div class="main">
        {#if tabSelected === 0}
            <div class="homeTab">
                <div class="homeTitle column">{title}</div>
                <div class="homeTournamentInfo column">
                    <div class="totalPrize row">
                        <span class="type">Total Prize: </span>
                        <span class="description">${totalEntries*buyIn}</span>
                    </div>
                    <div class="startingChips row">
                        <div class="type">Starting Chips:</div>
                        <div class="description">{startingChips}</div>
                    </div>
                    <div class="tournamentInfo row">
                        <div class="type">Re-entry:</div>
                        <div class="description">Re-entry tournaments are tournaments where you can re-entry once you lost all your chips if the tournament is still in the late register period.</div>
                    </div>
                    <div class="breaks row">
                        <div class="type">Break:</div>
                        <div class="description">5 minutes break every hour at 55min</div>
                    </div>
                </div>
                <div class="homePlayersInfo column">
                    <div class="currentBlindLevel row">
                        <div class="type">Current Level:</div>
                        <div class="description">Level {blindLevel} - Blinds: {blindStructure[blindLevel-1].sb}/{blindStructure[blindLevel-1].bb} Ante {blindStructure[blindLevel-1].ante}</div>
                    </div>
                    <div class="nextBlindLevel row">
                        <div class="type">Next Level:</div>
                        <div class="description">Blinds: {blindStructure[blindLevel].sb}/{blindStructure[blindLevel].bb} Ante {blindStructure[blindLevel].ante} (in X min)</div>
                    </div>
                </div>
                <div class="homePrizeInfo column">
                    <div class="tournamentStack row">
                        <div class="largest column">
                            <span>Largest Stack</span>
                            <span>{playersList.length>1 ? playersList[0].stackSize : 0}</span>
                        </div>
                        <div class="average column">
                            <span>Average Stack</span>
                            <span>{stackAverage}</span>
                        </div>
                        <div class="smallest column">
                            <span>Smallest Stack</span>
                            <span>{playersList.length>1 ? playersList[playersLeft-1].stackSize : 0}</span>
                        </div>
                    </div>
                    <div class="playersAndPrize row">
                        <div class="players column">
                            <div><span class="type">Entries: </span><span class="description">{totalEntries}</span></div>
                            <div><span class="type">Players Left: </span><span class="description">{playersLeft}</span></div>
                            <div><span class="type">Places Paid: </span><span class="description">{prizeStructure.length}</span></div>
                        </div>
                        <div class="prize column">
                            <table>
                                {#each prizeStructure as payAmount, index}
                                    {#if index<3}
                                        <tr><td>{index + 1}º:</td><td>${payAmount}</td></tr>
                                    {/if}
                                {/each}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        {:else if tabSelected === 1}
            <div class="infoTab">
                Blind Structure
                <div class="blindsTable">
                    <table>
                        <tr class="tableHead">
                            <th>Level</th>
                            <th>Blinds</th>
                            <th>Ante</th>
                            <th>Minutes</th>
                        </tr>
                        {#each blindStructure as blindLevel, index}
                            <tr><td>{index + 1}</td><td>{blindLevel.sb}/{blindLevel.bb}</td><td>{blindLevel.ante}</td><td>{blindLevelUpTime/60000}</td></tr>
                        {/each}
                    </table>
                </div>
                Tournament Information
                <div class="infoTabTournamentInfo column">
                    <div class="totalPrize row">
                        <span class="type">Total Prize: </span>
                        <span class="description">${totalEntries*buyIn}</span>
                    </div>
                    <div class="startingChips row">
                        <div class="type">Starting Chips:</div>
                        <div class="description">{startingChips}</div>
                    </div>
                    <div class="tournamentInfo row">
                        <div class="type">Re-entry:</div>
                        <div class="description">Re-entry tournaments are tournaments where you can re-entry once you lost all your chips if the tournament is still in the late register period.</div>
                    </div>
                    <div class="breaks row">
                        <div class="type">Break:</div>
                        <div class="description">5 minutes break every hour at 55min</div>
                    </div>
                    <div class="breaks row">
                        <div class="type">Break:</div>
                        <div class="description">5 minutes break every hour at 55min</div>
                    </div>
                    <div class="breaks row">
                        <div class="type">Break:</div>
                        <div class="description">5 minutes break every hour at 55min</div>
                    </div>
                    <div class="breaks row">
                        <div class="type">Break:</div>
                        <div class="description">5 minutes break every hour at 55min</div>
                    </div>
                    <div class="breaks row">
                        <div class="type">Break:</div>
                        <div class="description">5 minutes break every hour at 55min</div>
                    </div>
                    <div class="breaks row">
                        <div class="type">Break:</div>
                        <div class="description">5 minutes break every hour at 55min</div>
                    </div>
                    <div class="breaks row">
                        <div class="type">Break:</div>
                        <div class="description">5 minutes break every hour at 55min</div>
                    </div>
                    <div class="breaks row">
                        <div class="type">Break:</div>
                        <div class="description">5 minutes break every hour at 55min</div>
                    </div>
                </div>
            </div>
        {:else if tabSelected === 2}
            <div class="playersTab">
                <table>
                    <tr class="tableHead">
                        <th class="rank">Rank</th>
                        <th>Player</th>
                        <th>Chips</th>
                    </tr>
                    {#each playersList as player, index}
                        <tr><td class="rank">{index + 1}º</td><td>{player.name}</td><td>{player.stackSize}</td></tr>
                    {/each}
                </table>
            </div>
        {:else if tabSelected === 3}
            <div class="prizePoolTab column"> 
                <div class="nextPayout column">
                    {#if state != "Registering"}
                        <span>Next Payout: </span>
                        {#if playersLeft<prizeStructure.length}
                            <span>{playersLeft-1}º - ${prizeStructure[playersLeft-2]}</span>
                        {:else}
                            <span>{prizeStructure.length}º - ${prizeStructure[prizeStructure.length-1]}</span>
                        {/if}
                    {/if}
                </div>
                <div class="players column">
                    <div><span class="type">Entries: </span><span class="description">{totalEntries}</span></div>
                    <div><span class="type">Players Left: </span><span class="description">{playersLeft}</span></div>
                    <div><span class="type">Places Paid: </span><span class="description">{prizeStructure.length}</span></div>
                    <div><span class="type">Total Prize: </span><span class="description">${totalEntries*buyIn}</span></div>
                </div>
                <div class="prizesTable">
                    <table>
                        {#each prizeStructure as payAmount, index}
                            <tr><td>{index + 1}º:</td><td>${payAmount}</td></tr>
                        {/each}
                    </table>
                </div>
            </div>
        {/if}
    </div>
    <div class="register">
        {#if (state==="Registering" || state==="Late Register") && !heroRegistered}
            <button on:click={register}>REGISTER</button>
        {:else if state==="Registering" && heroRegistered}
            <button on:click={unregister}>UNREGISTER</button>
        {/if}
    </div>
</container>