import React from 'react';


export default function ProfilePic(props) {
    console.log('props', props);
    const imageUrl = props.image || 'default_profile_pic.jpg';

    return (
        <div>
            <div className="profileImage">
                <img src={imageUrl}></img>
                <p>{props.first} {props.last}</p>
            </div>


        </div>

    )
}