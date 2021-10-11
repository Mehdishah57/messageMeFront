import io from 'socket.io-client'
const socket = io(process.env.REACT_APP_localServer,{
    reconnectionDelayMax: 200000,
});
export default socket;