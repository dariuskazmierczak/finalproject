import React, { Component } from 'react';
import ProfilePic from './profilepic';
import Profile from './profile';
import Uploader from './uploader';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import OtherProfile from './otherprofile';
import Logo from './logo';
import axios from './axios';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {

            uploaderIsVisible: false
        },
            this.toggleModal = this.toggleModal.bind(this);
        this.methodGetUrl = this.methodGetUrl.bind(this);
        this.methodInApp = this.methodInApp.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }

    componentDidMount() {
        console.log('mounted')
        //axios to get info about log in user(first, last, pic)...axios /user...and add to component setState...so we can pass info to another component in App

        axios.get('/user', this.state).then(({ data }) => {
            console.log('data_user', data)
            this.setState({
                first: data.first,
                last: data.last,
                id: data.id,
                imageUrl: data.imageurl,
                bio: data.bio
            });
            console.log('this.state: ', this.state)
        })
    }

    toggleModal() {
        console.log('togglemodal')
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible
        })
    }

    methodGetUrl(url) {
        this.setState({
            imageUrl: url
        })
        console.log('this.state.imageUrl:', this.state.imageUrl)
        console.log('this.state:', this.state)

        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible
        })
    };

    methodInApp(arg) {
        this.setState({
            imageUrl: arg
        })

    }

    updateBio(bio) {
        this.setState({
            bio: bio
        })
    }

    render() {
        return (
            <BrowserRouter>

                <div>
                    <Logo />

                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        imageUrl={this.state.imageUrl}
                        toggleModal={this.toggleModal}
                        size='s'
                    />
                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    first={this.state.first}
                                    last={this.state.last}
                                    imageUrl={this.state.imageUrl}
                                    bio={this.state.bio}
                                    updateBio={this.updateBio}
                                    toggleModal={this.toggleModal}
                                />
                            )}
                        />
                        <Route path="/user/:id" component={OtherProfile} />
                    </div>

                    {this.state.uploaderIsVisible && <Uploader
                        methodInApp={this.methodInApp}
                        toggleModal={this.toggleModal}
                    />}

                </div>
            </BrowserRouter>
        );
    }
}


export default App;