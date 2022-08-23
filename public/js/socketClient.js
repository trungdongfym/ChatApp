const messageNSP = '/messages';

const socket = io(messageNSP);

socket.on('connect', () => {
   console.log('Socket connected!');
});