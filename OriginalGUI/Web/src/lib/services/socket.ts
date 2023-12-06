import {user} from '$lib/stores/user';
import io from 'socket.io-client';

// const socket = io('http://192.168.237.73:3000');
// const socket = io('http://192.168.1.110:3000');
const socket = io('https://originaltrial.onrender.com', {
  reconnection: true,
  reconnectionAttempts: 30,
  reconnectionDelay: 1000,  // 1 segundo
  timeout: 20000,
}); // Replace with your server's address

socket.on('connect', () => {
	console.log('User connected on socketID:', socket.id);
});

socket.on('disconnect', () => {
	console.log('User disconnected');
	user.set(null);
});

export default socket;
