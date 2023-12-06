<script lang="ts">
	import socket from '$lib/services/socket';
	async function handleSignin(event: SubmitEvent) {
		formError = {
			message: '',
			btnDisabled: true
		};
		const data = new FormData(event.target),
			user = data.get('username'),
			password = data.get('password');

		console.log(user, password);

		socket.emit('signIn', { user, password });
		// socket.emit('signIn', { user: 'gaban', password: '123456789' });
	}
	socket.on('signInResponse', ({ response, status, user, error = '' }) => {
		console.log('signInResponse');
		switch (status) {
			// case 200:
			// 	break;
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

<form class="flex w-full max-w-xs flex-col gap-4 px-2" on:submit|preventDefault={handleSignin}>
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
		autocomplete="current-password"
	/>
	<button disabled={formError.btnDisabled} class="auth filled mx-auto disabled:opacity-75" type="submit">
		Login
	</button>
</form>
{#if formError.message}
	<p class="my-1 text-red-500">{formError.message}</p>
{/if}
