import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [recent, setRecent] = useState(true);

    useEffect(() => {
        (async () => {
            const { data } = await axios.post("/recentUsers");
            console.log("data1", data.rows);
            setUsers(data.rows);
        })();
    }, []);
    const handleChange = (e) => {
        if (e.target.value) {
            (async () => {
                setRecent(false);
                console.log(e.target.value);
                const { data } = await axios.post("/userQuery" + e.target.value);
                console.log("resp", data);
                setUsers(data);
            })();
        } else {
            (async () => {
                const { data } = await axios.post("/recentUsers");
                console.log("data", data.rows);
                setRecent(true);
                setUsers(data.rows);
            })();
        }
    };

    return (
        <div className="fp-container" >
            <div className="fp-profile-finder">
                <div className="fp-profile-header">
                    <h2>Find Friends</h2>
                    <h3>Are you looking for someone in particular?</h3>
                </div>
                <div className="fp-input">
                    <input onChange={handleChange}></input>
                </div>
            </div>
            {
                users.map((user, idx) => {
                    return (
                        <div className="fp-user" key={idx}>
                            <div className="pf-img-container">
                                <div className="image2">
                                    <Link to={`/user/${user.id}`}>
                                        <img
                                            className="pf-img"
                                            src={user.imageurl}
                                            alt={user.first + " " + user.last}
                                        />
                                    </Link>
                                </div>
                            </div>
                            <div className="fp-bio-cont">
                                <h3 className="fp-name">
                                    {user.first} {user.last}
                                </h3>

                                <p>{user.bio}</p>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}