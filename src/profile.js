//new table col one for image one for bio
//change the user path

import React from 'react';
import ProfilePic from './profilepic';
import BioEditor from './bioeditor';

export default function Profile(props) {
    return (
        <div className="profpic-container">
            <h1>{props.first} {props.last}</h1>
            <ProfilePic
                first={props.first}
                last={props.last}
                imageUrl={props.imageUrl}
                toggleModal={props.toggleModal}
                logOut={props.logOut}
                size='xl'
            />
            <div className="bio-container">
                <BioEditor
                    bio={props.bio}
                    updateBio={props.updateBio}
                />
            </div>
        </div>
    );
}
