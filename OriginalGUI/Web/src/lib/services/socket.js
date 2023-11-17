import userStore from '$lib/stores/userStore';
import io from 'socket.io-client';

// const socket = io('http://192.168.237.73:3000');
const socket = io('http://192.168.1.110:3000');

socket.on('connect', () => {
	console.log('User connected on socketID:', socket.id);
});

socket.on('disconnect', () => {
	console.log('User disconnected');
	userStore.subscribe((user) => {
		if (user) userStore.set(null);
	});
});

export default socket;
