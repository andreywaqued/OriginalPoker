<script>
	import socket from '$lib/services/socket';
	import gamesAvailable from '$lib/stores/gamesAvailableStore';
	import navItemsStore from '$lib/stores/navItemsStore';
	import navSelectedItemStore from '$lib/stores/navSelectedItemStore';
	import userStore from '$lib/stores/userStore';
	/**
	 * Request signin handler
	 * @param {SubmitEvent} event
	 */
	async function handleSignin(event) {
		const data = new FormData(event.target);
		const user = data.get('username');
		const password = data.get('password');
		console.log(user, password);

		socket.emit('signIn', { user, password });
		// socket.emit('signIn', { user: 'gaban', password: '123456789' });
	}
	// socket.on('signInResponse', ({ response, status, user }) => {
	// 	console.log('signInResponse');
	// 	if (status === 200) {
	// 		// create the lobby component
	// 		const generatedID = crypto.randomUUID();
	// 		navItemsStore.set([{ id: generatedID, name: 'lobby' }]);
	// 		navSelectedItemStore.set(generatedID);

	// 		// check if user has players then push it to navbar
	// 		Object.entries(user.players).forEach(([key, value]) => {
	// 			navItemsStore.update((items) => {
	// 				const { gameTitle } = $gamesAvailable[value.poolID];
	// 				console.log(gameTitle);
	// 				return [...items, { id: key, name: gameTitle }];
	// 			});
	// 		});
	// 		console.log(user);
	// 		userStore.set(user);
	// 	}
	// });
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
