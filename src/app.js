import React, { Component } from 'react';
import ProfilePic from './profilepic';
/* import Profile from './profile'; */
import Uploader from './uploader';
import { BrowserRouter, Route, Link } from 'react-router-dom';
/* import OtherProfile from './otherprofile';
import FindPeople from './findpeople';
import Friends from './friends'; */
import Content from './content/content';
import Logo from './logo';
/* import Chat from './chat'; */
import axios from './axios';

import Personal from './content/personal';
import Education from './content/education';
import Experience from './content/experience';
import Skills from './content/skills';
import Languages from './content/languages';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false
        },
            this.toggleModal = this.toggleModal.bind(this);
        this.logOut = this.logOut.bind(this);
        this.methodGetUrl = this.methodGetUrl.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }

    componentDidMount() {
        console.log('mounted');
        //axios to get info about log in user(first, last, pic)...axios /user...and add to component setState...so we can pass info to another component in App

        axios.post('/user', this.state).then(({ data }) => {
            console.log('getting data from user', data);
            this.setState({
                first: data.first,
                last: data.last,
                id: data.id,
                imageUrl: data.imageurl,
                bio: data.bio
            });
            console.log(' this.state: ', this.state);
        });
    }

    toggleModal() {
        console.log('togglemodal is running');
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible
        });
    }

    logOut() {
        console.log('logout is running');
        this.setState({
            id: null
        });
        axios.post('/logout').then(() => {
            location.replace('/welcome#/login');
        });
    }

    methodGetUrl(url) {
        this.setState({
            imageUrl: url,
            uploaderIsVisible: !this.state.uploaderIsVisible
        });
        console.log('imageUrl in App:', this.state.imageUrl);
        console.log('this.state::', this.state);
    };


    updateBio(bio) {
        this.setState({
            bio: bio
        });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="main">
                    <div className="app-header">
                        <Logo />
                        <div className="nav">
                            <Link className="one" to="/education">Education</Link>
                            <Link className="two" to="/experience"> Experience</Link>
                            <Link className="three" to="/skills"> Skills</Link>
                            <Link className="logout" to="/logut">Logout</Link>
                        </div>
                        {/* <div className="prof-pic">
                        <ProfilePic
                            first={this.state.first}
                            last={this.state.last}
                            imageUrl={this.state.imageUrl}
                            toggleModal={this.toggleModal}
                            logOut={this.logOut}
                            size='s'
                        />
                    </div> */}
                    </div>
                    <div className="main-container">
                        <Route exact path='/personal' component={Personal} />
                        <Route exact path='/experience' component={Experience} />
                        <Route exact path='/education' component={Education} />
                        <Route exact path='/skills' component={Skills} />
                        <Route exact path='/languages' component={Languages} />

                    </div>

                </div>

            </BrowserRouter >
        );
    }
}



export default App;