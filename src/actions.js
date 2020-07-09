import axios from "./axios";

export async function receiveWannabes() {
    console.log("receiving");
    const { data } = await axios.post("receiveWannabes");
    return {
        type: "RECEIVE_FRIENDS_WANNABEES",
        friendsWannabees: data,
    };
}

export async function acceptFriendRequest(id) {
    console.log("accepting", id);
    await axios.post(`/acceptWannabee/${id}`);

    return {
        type: "ACCEPT_FRIEND_REQUEST",
        id,
    };
}

export async function unfriend(id) {
    console.log("unfriending", id);
    await axios.post(`/unfriend/${id}`);

    return {
        type: "UNFRIEND",
        id,
    };
}

//---------------------------------------------------------------
//-----------------CHAT
//---------------------------------------------------------------

export function getLastChatMessages(data) {
    console.log('data in action chatMessages: ', data);
    return {
        type: 'GET_LAST_MESSAGES',
        data
    };
}

export function addNewChatMsg(data) {
    console.log('data in action addChatMsg: ', data);
    return {
        type: 'ADD_NEW_MESSAGE',
        data
    };
}

export function usersConnected(data) {
    console.log('data in action usersConnected: ', data);
    return {
        type: 'ADD_USERS_CONNECTED',
        data
    };
}