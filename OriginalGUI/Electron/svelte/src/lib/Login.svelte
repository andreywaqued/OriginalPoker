<script>
    import { enhance } from "$app/forms";
    import { onMount } from 'svelte';
    /**
     *@type {("signin"|"signup")}
     */
    export let tipo   /**@type {string} */

    let api
    let btnDisabled = false;

    onMount(() => {
        if (window.api) {
            api = window.api
            api.on("updateUser", () => {
                btnDisabled = false;
            })
            api.on("signedUser", () => {
                btnDisabled = false;
            })
        }
    });

    function waitForSignup() {
        return new Promise((resolve, reject) => {
          api.on('signedUser', () => {
            resolve(1);
          });

          // In case of an error
          // api.on('error', (error) => {
          //   reject(error);
          // });
        });
    }

    /** @param {SubmitEvent} event */
    function handleLogin(event) {
        event.preventDefault()
        btnDisabled = true;
        const data = new FormData(event.target);
        const user = data.get("username")
        const password = data.get("password")
        if (tipo === "signup") {
            const confirmPassword = data.get("confirm_password")
            if (password !== confirmPassword) return "TODO! Need to show error to the client (clientside verification)"
            const email = data.get("email")
            api.send("signUp", {user, password, email})
            waitForSignup().then(()=>{
                api.send("signIn", {user, password })
            })
        }
        if (tipo === "signin") api.send("signIn", {user, password})
    }


</script>

<style lang="scss">
    form {
        input {
            display: block;
            border: unset;
            border-bottom: 1px solid grey;
            padding-bottom: 0.4em;
            margin: 1em auto;
            width: 100%;
            font-size: 1.2em;
        }
        input::-webkit-input-placeholder {
            color: darkgray;
        }
        input:focus {
            outline: none
        }
        div {
            display: flex;
            flex-direction: column;
            gap: 0.5em;
        }
    }
</style>
<form on:submit={handleLogin} use:enhance>
    <input placeholder="Username" name="username" type="text"/>
    <input placeholder="Password" name="password" type="password"/>
    {#if tipo === "signin"}
      <div>
          <button disabled={btnDisabled} class="roundedButton filled" type="submit">
              Login
          </button>
      </div>
    {:else if tipo === "signup"}
      <input placeholder="Confirm Password" name="confirm_password" type="password"/>
      <input placeholder="E-mail" name="email" type="email"/>
      <div>
          <button disabled={btnDisabled} class="roundedButton filled" type="submit">
              Signup
          </button>
      </div>
    {/if}
</form>
<slot/>
