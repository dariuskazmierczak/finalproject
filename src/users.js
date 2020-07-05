import React, { useState, useEffect } from "react";
import axios from './axios';
import { Link } from 'react-router-dom';

export default function FindPeople() {
    //hooks//
    const [] =
        useEffect(() => {
            console.log();
        });

    (async () => {
        const { data } = await axios.get(

        );
        setCountries(data);
    })();
}, [country]);

const handleChange = (e) => {
    setGreetee(e.target.value);
};

const handleCountryChange = (e) => {
    setCountry(e.target.value);
};

return (
    <div>
        {/* ... */}

        {users.map(
            user => (
                <div>
                    {/* ... */}
                </div>
            )
        )}

        {/* ... */}
    </div>
)
}
