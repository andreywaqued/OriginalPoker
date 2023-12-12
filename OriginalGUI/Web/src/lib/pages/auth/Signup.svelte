<script lang="ts">
	import socket from '$lib/services/socket';

	// store the user & password on a component scope variable to be used to signin when successfully signed up
	let user, password;

	async function handleSignup(event: SubmitEvent) {
		formError = {
			message: '',
			btnDisabled: true
		};
		console.log('handleSignup');
		const data = new FormData(event.target),
			confirmPassword = data.get('confirm_password'),
			email = data.get('email'),
			confirmEmail = data.get('confirm_email');

		user = data.get('username');
		password = data.get('password');

		if (password !== confirmPassword) {
			return (formError = { message: 'Password not match', btnDisabled: false });
		}
		if (email !== confirmEmail) {
			return (formError = { message: 'Email not match', btnDisabled: false });
		}

		console.log(user, password);
		socket.emit('signUp', { user, password, email });
	}
	socket.on('signUpResponse', ({ status, error = '' }) => {
		console.log('signUpResponse');
		switch (status) {
			case 200:
				socket.emit('signIn', { user, password });
				break;
			case 403:
				formError.message = error;
				break;
		}
		formError.btnDisabled = false;
	});

	let formError = {
		message: '',
		btnDisabled: false
	};
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
	<button
		disabled={formError.btnDisabled}
		class="auth filled mx-auto disabled:opacity-75"
		type="submit"
	>
		Register
	</button>
</form>
{#if formError.message}
	<p class="my-2 text-red-700">{formError.message}</p>
{/if}
