export default function reducer(state = {}, action) {
    // ... (spread operator) make clones of objects & arrays
    if (action.type == "RECEIVE_FRIENDS_WANNABEES") 
    {
        console.log("working");
        state = Object.assign({}, state, {
            friendsWannabees: action.friendsWannabees,
        });
        console.log("state", state);
        return state;
    }

    if (action.type == "ACCEPT_FRIEND_REQUEST") 
    {
        console.log("acceptng in reducer");
        const newFriend = state.friendsWannabees.map((user) => {
            if (user.id == action.id) {
                user.accepted = true;
            }
        });
        return { ...state, newFriend };
    }

    if (action.type == "UNFRIEND") 
    {
        console.log("unfriending");

        state.friendsWannabees = state.friendsWannabees.filter(
            (user) => user.id != action.id
        );

        console.log("statend", state);
        return state;
    }
    
    //---------------------------------------------------------------
    //-----------------CHAT
    //---------------------------------------------------------------

    if (action.type == 'GET_LAST_MESSAGES') 
    {
        console.log("REducer GET_LAST_MESSAGES");
        state = {
            ...state,
            chatMessages: action.data
        };
        console.log("REducer return state:", state);
        return state;
    }

    if (action.type == 'ADD_NEW_MESSAGE') 
    {
        state = {
            ...state,
            //newMessage: action.data
            chatMessages: [...state.chatMessages, ...action.data]

            // chatMessages: state.chatMessages.map(
            //     msg=>{
            //         if(!action.data){
            //             return msg
            //         } else {
            //             return{
            //                 [...msg, ...action.data]
            //             }
            //         }
            //     })
        };
        return state;
    }

    if (action.type == 'ADD_USERS_CONNECTED') 
    {
        state = {
            ...state,
            users: action.data

        };
        return state;
    }

    return state;

}