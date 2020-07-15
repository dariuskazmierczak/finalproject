import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import Logo from './logo';
import axios from './axios';

import Personal from './content/personal';
import Education from './content/education';
//import Experience from './content/experience';
//mport Skills from './content/skills';
//import Languages from './content/languages';
import Preview from './preview';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false
        },
            this.toggleModal = this.toggleModal.bind(this);
        this.logOut = this.logOut.bind(this);
        //this.methodGetUrl = this.methodGetUrl.bind(this);
        //this.updateBio = this.updateBio.bind(this);
    }

    componentDidMount() {
        console.log('mounted');

        //axios to get info about log in user(first, last, pic)...axios /user...and add to component setState...so we can pass info to another component in App

        axios.post('/user').then(({ data }) => {
            console.log('getting data from user', data);
            this.setState({
                id: data.id,
                email: data.email
                //tu moze byc modal checkbox
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

    /* methodGetUrl(url) {
        this.setState({
            imageUrl: url,
            uploaderIsVisible: !this.state.uploaderIsVisible
        });
        console.log('imageUrl in App:', this.state.imageUrl);
        console.log('this.state::', this.state);
    };
 */

    /* updateBio(bio) {
        this.setState({
            bio: bio
        });
    } */

    render() {
        return (
            <BrowserRouter>
                <div className="main">
                    <div className="app-header">
                        <Logo />
                        <div className="nav">
                            <Link className="one" to="/personal"> Personal</Link>
                            <Link className="two" to="/education"> Education</Link>
                            <button className="logout" onClick={() => this.logOut()}>Logout</button>
                        </div>

                    </div>
                    <div className="main-container">
                        <Preview />
                        <Route exact path='/personal' component={Personal} />
                        <Route exact path='/education' component={Education} />
                        {/* 
                        <Route exact path='/experience' component={Experience} />
                        <Route exact path='/skills' component={Skills} />
                        <Route exact path='/languages' component={Languages} /> */}
                    </div>
                </div>
            </BrowserRouter >
        );
    }
}

const mapStateToProps = function (state) {
    return {
        id: state.id,
        email: state.email
    }
}

export default App;

