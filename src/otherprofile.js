import React, { Component } from 'react';
import axios from './axios';

class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        console.log('otherProfile this.props.match.params.id:', this.props.match.params.id);
        let data1 = { id: this.props.match.params.id };
        axios.post('/otherUser', data1).then(({ data }) => {
            console.log('data in otheruser', data);
            if (data.currentUser) { this.props.history.push('/'); }
            else {
                this.setState({
                    id: data.id,
                    first: data.first,
                    last: data.last,
                    image: data.imageurl,
                    bio: data.bio
                }).catch(err => console.log('error setState otherprofile', err));
            }
        }).catch(err => console.log('error axios otherprofile', err));
    }
    render() {
        return (
            <div className="other_prof_container">
                <h1>Other Profile</h1>
                <h2>{this.state.first} {this.state.last}</h2>
                <img src={this.state.image} alt={this.state.first} alt={this.state.last} />
                <p>{this.state.bio}</p>
            </div>


        );
    }
}

export default OtherProfile;