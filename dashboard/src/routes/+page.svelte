<script>
	import { onMount } from "svelte";
    let users = []
    let handsPlayed = 0
    let adsShown = 0
    async function updateUsers() {
        console.log("updateUsers()")
        // users = [{username: "asd"}]
        // return users
        const response = await fetch('https://originaltrial.onrender.com/getUsers')
        if (response.ok) {
            const data = await response.json()
            users = data
            adsShown = 0
            users.forEach(user => {
                adsShown += Number(user.count)
            });
            console.log(users)
        } else {
            console.error("failed to fetch users")
        }
    }
    async function updateHands() {
        console.log("updateHands()")
        // users = [{username: "asd"}]
        // return users
        const response = await fetch('https://originaltrial.onrender.com/getHandsCount')
        if (response.ok) {
            const data = await response.json()
            handsPlayed = data
        } else {
            console.error("failed to fetch users")
        }
    }
    // $: users = updateUsers()
    onMount(()=>{
        console.log("onMount()")
        updateUsers()
        updateHands()
    })
    async function sendChips(index, userid) {
        console.log(index)
        console.log(userid)
        const chipsValue = document.getElementById("addChipsInput"+index).value
        if (chipsValue) {
            const response = await fetch(`https://originaltrial.onrender.com/addchips?user=${userid}&chips=${chipsValue}`)
            if (response.ok) {
                updateUsers()
            } else {
                console.error("failed to add chips")
            }
        }
    }

</script>
<style>
    .header {
        display: flex;
        width: 100%;
        height: 10%;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
    }
    .info{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
    .usersDiv{
        width: 100%;
    }
    .usersTable{
        width: 100%;
        border-collapse: collapse;
    }
    td, th {
        text-align: center;
        border: 1px solid black;
        padding: 0.1%;
        width: 20%;
    }
    tr:nth-child(even) {
        background-color: #eeeeee;
    }
    input {
        width: 50%;
    }
    button {
        width: 35%;
        text-align: center;
        padding: 0;
    }

</style>

<div class="header">
    <div class="info">
        <span>USERS</span>
        <span>{users.length}</span>
    </div>
    <div class="info">
        <span>HANDS</span>
        <span>{handsPlayed}</span>
    </div>
    <div class="info">
        <span>ADS</span>
        <span>{adsShown}</span>
    </div>
</div>
<div class="usersDiv">
    <table class="usersTable">
        <tr>
            <th>NAME</th>
            <th>LastLogin</th>
            <th>Hands</th>
            <th>Balance</th>
            <th>Add Chips</th>
        </tr>
        {#each users as user, index}
            <tr>
                <td>{user.username}</td>
                <td>{new Date(user.last_login).toDateString()}</td>
                <td>{user.count}</td>
                <td>${user.balance}</td>
                <td><input id={"addChipsInput" + index} placeholder="$0"><button on:click={()=>{sendChips(index, user.userid)}}>Send</button></td>
            </tr>
        {/each}
    </table>
</div>


