<script>
	import { socket, user } from '$lib/stores';
	function handleSignup() {}
</script>

<form class="mb-2 flex w-full max-w-xs flex-col gap-4 px-2" on:submit|preventDefault={handleSignup}>
	<input
		class="auth"
		required
		placeholder="Username"
		name="username"
		type="text"
		autocomplete="username"
	/>
	<input
		class="auth"
		required
		placeholder="Password"
		name="password"
		type="password"
		autocomplete="new-password"
	/>
	<input
		class="auth"
		required
		placeholder="Confirm Password"
		name="confirm_password"
		type="password"
		autocomplete="new-password"
	/>
	<input
		class="auth"
		required
		placeholder="E-mail"
		name="email"
		type="email"
		autocomplete="email"
	/>
	<input
		class="auth"
		required
		placeholder="Repeat your E-mail"
		name="confirm_email"
		type="email"
		autocomplete="email"
	/>
	<button class="auth filled mx-auto" type="submit"> Signup </button>
</form>
