import * as io from 'socket.io-client';
import { getLastChatMessages, addNewChatMsg, usersConnected } from './actions';
//import { getLastChatMessages} from './actions';

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on('chatMessages', msgs =>
            store.dispatch(getLastChatMessages(msgs))
        );

        socket.on('addChatMsg', msg => {
            console.log('new message in chat: ', msg)
            store.dispatch(addNewChatMsg(msg))
        });

        socket.on('onlineUsers', data =>
            store.dispatch(usersConnected(data))
        );
    }
};
/* import * as io from 'socket.io-client';

//import { chatMessages, chatMessage } from './actions';

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on('addChatMsg', msg => {
            console.log();
        })

        /*socket.on(
            'chatMessages',
            msgs => store.dispatch(
                chatMessages(msgs)
            )
        );

        socket.on(
            'chatMessage',
            msg => store.dispatch(
                chatMessage(msg)
            )
        );*/
