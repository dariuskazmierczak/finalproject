export default function reducer(state = {}, action) {

    if (action.type == "SET_USER") {
        //console.log("working");
        //console.log("working", action.data.id);
        state = { ...state, id: action.data.id, email: action.data.email };
        console.log("state", state);
        return state;
    }

    if (action.type == "SET_PERSONAL") {
        //console.log("working");
        //console.log("working", action.data);
        state = { ...state, personal: action.data };
        console.log("state", state);
        return state;
    }
    if (action.type == "SET_EDUCATION") {
        //console.log("working");
        //console.log("working", action.data);
        state = { ...state, personal: action.data };
        console.log("state", state);
        return state;
    }


    return state;
}