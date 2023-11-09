<script>
    import Signin from '$lib/components/auth/Signin.svelte';
    import Signup from '$lib/components/auth/Signup.svelte';

    const AuthIndexes = {
        signin: 0,
        signup: 1
    };
    let AuthIndexSelected = AuthIndexes.signin;
</script>

<section class="flex flex-col w-full h-full justify-center items-center">
    <!-- <img height="30" src="./originalLogo.png" /> -->
    {#if AuthIndexSelected === AuthIndexes.signin}
        <Signin />
        <button class="auth ringed" on:click={() => AuthIndexSelected = AuthIndexes.signup} >
            Signup
        </button>
    {:else if AuthIndexSelected === AuthIndexes.signup}
        <Signup />
        <button class="text-white font-bold py-2 px-4 rounded mx-auto mt-2" on:click={() => AuthIndexSelected = AuthIndexes.signin}>
            Already have a account? <u>Login here</u>
        </button>
    {/if}
</section>
