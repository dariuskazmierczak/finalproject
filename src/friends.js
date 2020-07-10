import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveWannabes, acceptFriendRequest, unfriend } from "./actions";
import { Link } from "react-router-dom";

export default function Friends() {
    const friends = useSelector(
        (state) =>
            state.friendsWannabees &&
            state.friendsWannabees.filter((friend) => friend.accepted)
    );

    const wannabees = useSelector(
        (state) =>
            state.friendsWannabees &&
            state.friendsWannabees.filter(
                (wannabee) => wannabee.accepted == false
            )
    );
    setTimeout(() => console.log("x", friends), 2000);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(receiveWannabes());
    }, []);

    if (!friends) {
        return null;
    }

    return (

        <div className="fr-wb-list">
            <div className="fr-list">
                {friends.map((user, i) => {
                    return (
                        <div className="friends" key={i}>
                            <h2>These people are currently you friends</h2>
                            <div className="f-user">
                                <div className="wrap-info-user">
                                    <div className="image3">
                                        <Link to={`/user/${user.id}`}>

                                            <img
                                                className="of-user-img"
                                                src={user.imageurl}
                                                alt={user.first + " " + user.last}
                                            />
                                        </Link>
                                    </div>

                                    <p className="f-user-name">
                                        {user.first} {user.last}
                                    </p>
                                    <button className="end-fr" onClick={() => dispatch(unfriend(user.id))}>
                                        End Friendship
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="wb-list">
                {wannabees.map((user, i) => {
                    return (
                        <div className="wannabees" key={i}>
                            <h2>These people want to be your Friend</h2>
                            <div className="f-user">
                                <div className="wrap-info-user">
                                    <div className="image3">
                                        <Link to={`/user/${user.id}`}>
                                            <img
                                                className="f-user-img"
                                                src={user.imageurl}
                                                alt={user.first + " " + user.last}
                                            />
                                        </Link>
                                    </div>


                                    <p className="f-user-name">
                                        {user.first} {user.last}
                                    </p>
                                    <button className="accept"
                                        onClick={() =>
                                            dispatch(acceptFriendRequest(user.id))
                                        }
                                    >
                                        Accept Friend Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>


        </div>
    );
}