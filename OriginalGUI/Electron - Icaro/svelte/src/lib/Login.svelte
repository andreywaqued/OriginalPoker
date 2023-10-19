<script>
    let login = ""
    let password = ""
    import { onMount } from 'svelte';
    let api
    onMount(() => {
        if (window.api) {
            api = window.api
        }
    });
    function sendSignIn() {
        api.send("signIn", {user: login, password: password})
    }
</script>

<style lang="scss">
    button {
        all: unset;
    }
    button:active {
        transform: scale(0.95);
    }
    .loginDiv {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        gap: 0.5em;
        input {
            text-align: center;
        }
        .loginButton {
            // background-color: white;
            border-radius: 5px;
            border: 1px solid white;
            width: 25%;
            height: 5%;
            text-align: center;

        }
    }
</style>

<div class="loginDiv">
    Login <input placeholder="Login" bind:value={login} on:input={(e)=>{console.log(e)}}/>
    Password <input placeholder="Password" bind:value={password}/>
    <button class="loginButton" on:click={sendSignIn}>SIGN IN</button>
    <button class="loginButton">SIGN UP</button>
</div>