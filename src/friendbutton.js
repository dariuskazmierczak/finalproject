import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton(props) {
    const [buttonText, setButtonText] = useState();
    const [buttonAxios, setButtonAxios] = useState();

    //console.log(props);
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.post(
                    "/initial-friendship-status/" + props.id
                );
                console.log("data mounted", data);
                if (data.length == 0) {
                    setButtonText("Make Friend Request");
                    setButtonAxios("Make-Friend-Request");
                } else if (data.accepted) {
                    setButtonText("End Friendship");
                    setButtonAxios("End-Friendship");
                } else if (data.cancelled) {
                    setButtonText("Make Friend Request");
                    setButtonAxios("Make-Friend-Request");
                } else if (!data.accepted && data.receiver) {
                    setButtonText("Accept Friend Request");
                    setButtonAxios("Accept-Friend-Request");
                } else if (!data.accepted) {
                    setButtonText("Cancel Friend Request");
                    setButtonAxios("Cancel-Friend-Request");
                }
            } catch (err) {
                console.log("Friend button useEffect error:", err);
            }
        })();
    }, []);

    const onClick = () => 
    {
        axios.post(`/${buttonAxios}/${props.id}`).then((resp) => 
        {
            setButtonText(resp.data.setButtonText);
        }).catch((err) => console.log("Friend button onClick error:", err));
    };
    
    return(
        <button onClick={() => onClick()}>{buttonText}</button>
    );

}