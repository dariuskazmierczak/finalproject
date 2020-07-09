import React from 'react';
import { Link } from 'react-router-dom';


export default function ProfilePic(props) {
    console.log('props en ProfilePic:', props);

    let imageUrl;
    if (props.imageUrl) {
        imageUrl = props.imageUrl
    } else {
        imageUrl = '/default_profile_pic.jpg'
    }



    return (
        <div>
            {<div className={`profpic-container-${props.size}`} >
                {
                    props.size == 's' ?
                        <Link to={`/`}> <img src={props.imageUrl} alt={`${props.first} ${props.last}`} /> </Link>
                        :
                        <img src={props.imageUrl} alt={`${props.first} ${props.last}`} onClick={() => props.toggleModal()} />
                }

                {
                    props.size == "s" &&
                    <p className='logout' onClick={() => props.logOut()}>LOGOUT</p>
                }

            </div>}
        </div>
    )
}
