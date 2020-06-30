import React from 'react';


export default function ProfilePic(props) {
    console.log('props.ProfPic:', props);

    let imageUrl;
    if (props.imageUrl) {
        imageUrl = props.imageUrl
    } else {
        imageUrl = '/default_profile_pic.jpg'
    }

    return (
        <div className="profpic-container">
            <div className="imgContainer" onClick={() => props.toggleModal} >
                {/* <p>Upload a picture</p> */}
                <img src={props.imageUrl} alt={`${props.first} ${props.last}`} />

            </div>
            <div className="profpic-name">
                <p>{props.first} {props.last}</p>
            </div>
        </div>
    )
}
