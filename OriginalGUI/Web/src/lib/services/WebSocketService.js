import io from 'socket.io-client';

export function connectWebSocket() {
    const socket = io('http://127.0.0.1:3000'); // Replace with your server's address
    // const socket = io('https://originaltrial.onrender.com', {
    //     reconnection: true,
    //     reconnectionAttempts: 30,
    //     reconnectionDelay: 1000, // 1 segundo
    //     timeout: 20000
    // }); // Replace with your server's address

    socket.on('connect', () => {
        console.log(`Connected to the server with id: ${socket.id}`);
    });

    // needs to treat this on client side
    socket.on('disconnect', () => {
        console.log(`Disconnected from the server`);
    });
    return socket;
}
