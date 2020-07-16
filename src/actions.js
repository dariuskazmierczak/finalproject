import axios from "./axios";

export async function setUser() {
    console.log("receiving");
    const { data } = await axios.post('/user');
    return {
        type: "SET_USER",
        data
    };
}

export async function setPersonal(data) {
    console.log("setPersoonal receiving", data);
    return {
        type: "SET_PERSONAL",
        data
    };
}

export async function userLogout() {
    console.log("redux loging out...");
    return {
        type: "USER_LOGOUT"
    };
}