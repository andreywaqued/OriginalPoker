<script>
	import { socket, user } from '$lib/stores';
	/**
	 * Request signin handler
	 * @param {SubmitEvent} event
	 */
	async function handleSignin(event) {
		const data = new FormData(event.target);
		const user = data.get('username');
		const password = data.get('password');
		console.log(user, password);
		$socket?.emit('signIn', { user, password });
	}
	socket.subscribe((s) => {
		// response
		s?.on('signInResponse', ({ response, status, user: u }) => {
			console.log('signInResponse: ' + status + ' ' + response);
			user.set(u);
		});
	});
</script>

<form class="flex flex-col gap-4 w-full max-w-xs px-2 mb-2" on:submit|preventDefault={handleSignin}>
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
	<button
		class="auth filled mx-auto"
		type="submit"
	>
		Login
	</button>
</form>
