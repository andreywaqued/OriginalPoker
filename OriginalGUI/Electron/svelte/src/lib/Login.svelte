<script>
    import { enhance } from "$app/forms";
    import { onMount } from 'svelte';
    /**
     *@type {("signin"|"signup"|"recover")}
     */
    export let tipo   /**@type {string} */

    let api
    let btnDisabled = true;
    let formError = "";

    onMount(() => {
        if (window.api) {
            api = window.api
            btnDisabled = false;
        }
    });

    function waitForSignin() {
        return new Promise((resolve, reject) => {
            api.on("updateUser", (user) => {
                resolve(0)
            })
            api.on("updateUserError", (error) => {
                reject(error)
            })
        })
    }

    function waitForSignup() {
        return new Promise((resolve, reject) => {
            api.on('signedUser', (user) => {
              resolve(0)
            });
            api.on('signedUserError', (error) => {
              reject(error)
            });
        });
    }

    /** @param {SubmitEvent} event */
    function handleLogin(event) {
        setError("", true)
        // !!! TODO !!!
        if (tipo === "recover") return console.log("TODO !!!!")
        const data = new FormData(event.target);
        const username = data.get("username")
        if (tipo === "signup") {
            const password = data.get("password"),
                confirmPassword = data.get("confirm_password"),
                email = data.get("email"),
                confirmEmail = data.get("confirm_email")
            const hasErrors = handleInputErrors(password, confirmPassword, email, confirmEmail)
            if (hasErrors) return;
            api.send("signUp", {username, password, email})
            waitForSignup().then(() => {
                api.send("signIn", {username, password })
            }).catch((err) => {
                console.log(err)
                formError = err
            }).finally(() => {
                btnDisabled = false;
            })
        }
        if (tipo === "signin") {
            const password = data.get("password")
            api.send("signIn", {username, password})
            waitForSignin().then().catch((err) => {
                console.log(err)
                formError = err
            }).finally(() => {
                btnDisabled = false;
            })
        }
    }


    /**
     *
     * @returns {boolean}
     *
     */
    function handleInputErrors(password, confirmPassword, email, confirmEmail) {
            if (password !== confirmPassword) {
                setError("Password not match", false);
                return true;
            }
            if (email !== confirmEmail) {
                setError("Email not match", false);
                return true;
            }
            return false;
        
    }
    /** 
    * @param {string} msg 
    * @param {boolean} btnDisabled
    */
    function setError(msg, btnDisabled) {
        btnDisabled = btnDisabled;
        formError = msg;
    }

</script>

<style lang="scss">
    form {
        input {
            display: block;
            border: unset;
            border-bottom: 1px solid #c2c2c2;
            padding-bottom: 0.4em;
            margin: 1.5em auto;
            width: 100%;
            font-size: 1.2em;
        }
        input::-webkit-input-placeholder {
            color: #c2c2c2;
        }
        input:focus {
            outline: none
        }
        div {
            display: flex;
            flex-direction: column;
            gap: 0.5em;
            // color: #1ea12b; deposit button
            // color: #282828; gray
            // color: #b82b2b; red
            // color: #2bb839; green
            // color: #c2c2c2; gray text
        }
    }
    .error {
        margin: 0.5em 0;
        color: #b82b2b;
    }
</style>
<form on:submit|preventDefault={handleLogin} use:enhance>
    <input required placeholder="Username" name="username" type="text"/>
    {#if tipo === "signin"}
        <input required placeholder="Password" name="password" type="password"/>
        <div>
            <button disabled={btnDisabled} class="roundedButton filled" type="submit">
                Login
            </button>
        </div>
    {:else if tipo === "signup"}
        <input required placeholder="Password" name="password" type="password"/>
        <input required placeholder="Confirm Password" name="confirm_password" type="password"/>
        <input required placeholder="E-mail" name="email" type="email"/>
        <input required placeholder="Repeat your e-mail" name="confirm_email" type="email"/>
        <div>
            <button disabled={btnDisabled} class="roundedButton filled" type="submit">
                Signup
            </button>
        </div>
    {:else if tipo === "recover"}
        <input required placeholder="E-mail" name="email" type="email"/>
        <div>
            <!-- TODO -->
            <button class="roundedButton filled" type="submit">
                Recover
            </button>
        </div>
    {/if}
</form>
{#if formError}
    <p class="error">{formError}</p>
{/if}
<slot/>
