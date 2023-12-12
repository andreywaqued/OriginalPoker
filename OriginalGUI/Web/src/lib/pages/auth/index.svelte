<script>
	import Signin from './Signin.svelte';
	import Signup from './Signup.svelte';

	const AuthIndexes = {
		signin: 0,
		signup: 1
	};
	let AuthIndexSelected = AuthIndexes.signin;
</script>

<section class="flex h-full w-full flex-col items-center justify-between py-10">
	<img class="h-14" alt="logo" src="/logos/OriginalLogoWhite.png" />
	<div class="flex w-full flex-col items-center justify-center">
		{#if AuthIndexSelected === AuthIndexes.signin}
			<Signin />
			<button class="mb-4 mt-0.5 text-sm text-white underline underline-offset-2">
				Forgot your Password?
			</button>
			<button class="auth ringed" on:click={() => (AuthIndexSelected = AuthIndexes.signup)}>
				Register
			</button>
		{:else if AuthIndexSelected === AuthIndexes.signup}
			<Signup />
			<button
				class="mx-auto rounded text-sm text-white"
				on:click={() => (AuthIndexSelected = AuthIndexes.signin)}
			>
				Already have a account? <u>Login here</u>
			</button>
		{/if}
	</div>
	<div class="flex flex-col items-center justify-center">
		<p class="text-white">Need help?</p>
		<a href="tel:+551195284-4514" class="text-white"> (11)95284-4514 </a>
	</div>
	<div class="flex items-center justify-center">
		<p class="text-neutral-500">Terms of Service & Privacy Policy</p>
	</div>
</section>
