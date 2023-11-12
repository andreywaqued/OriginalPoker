<script>
	import socketStore from '$lib/stores/socketStore';
	// import socket from '$lib/services/WebSocketService';
	// /**
	//  * Request signin handler
	//  * @param {SubmitEvent} event
	//  */
	async function handleSignin(event) {
		const data = new FormData(event.target);
		const user = data.get('username');
		const password = data.get('password');
		console.log(user, password);

		socketStore.sendMessage('signIn', { user, password });
	}
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
	<button class="auth filled mx-auto" type="submit"> Login </button>
</form>
