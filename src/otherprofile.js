import React, { Component } from 'react';
import axios from './axios';
import FriendButton from "./friendbutton";
import { Link } from 'react-router-dom';

class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        console.log(':::otherProfile this.props.match.params.id:', this.props.match.params.id);
        var data1 = { id: this.props.match.params.id };
        axios.post('/otherUser', data1).then(({ data }) => {
            console.log(':::otherProfile data:', data);
            if (data.currentUser) { this.props.history.push('/'); }
            else {
                this.setState({
                    id: data.id,
                    first: data.first,
                    last: data.last,
                    image: data.imageurl,
                    bio: data.bio,
                    num: data.num
                })
                console.log(':::otherProfile state.num:', this.state.num);
            }
        }).catch(err => console.log('error axios otherprofile', err));

    }

    render() {
        return (
            <div className="other-prof-container">
                <h1>Other Profile</h1>
                <h2>{this.state.first} {this.state.last}</h2>
                <img src={this.state.image} alt={this.state.first} alt={this.state.last} />
                <p>{this.state.bio}</p>
                <FriendButton id={this.props.match.params.id} />
                {
                    (this.state.id > 0) &&
                    <p><Link to={`/user/${this.state.id - 1}`}>Show prev friend</Link></p>
                }
                {
                    (this.state.id < this.state.num) &&
                    <p><Link to={`/user/${this.state.id + 1}`}>Show next friend</Link></p>
                }
            </div>


        );
    }
}

export default OtherProfile;