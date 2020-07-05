import React from 'react';


export default function ProfilePic(props) {
    console.log('props.ProfPic:', props);

    let imageUrl;
    if (props.imageUrl) {
        imageUrl = props.imageUrl
    } else {
        imageUrl = './default_profile_pic.jpg'
    }

    return (
        <div>
            {<div className={`profpic-container-${props.size}`}>

                <img src={props.imageUrl} alt={`${props.first} ${props.last}`}
                    onClick={() => props.toggleModal()} />

                {
                    props.size == "s" &&
                    <button className='logout' onClick={() => props.logOut()}>LOGOUT</button>
                }

            </div>}
        </div>
    )
}
