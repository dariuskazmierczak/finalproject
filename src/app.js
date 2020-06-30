import React, { Component } from 'react';
import ProfilePic from './profilepic';
import Uploader from './uploader';
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
    }

    componentDidMount() {
        console.log('mounted')

        axios.get('/user', this.state).then(({ data }) => {
            console.log('getting data from user', data)
            this.setState({
                first: data.first,
                last: data.last,
                id: data.id,
                imageUrl: data.imageurl
            });
            console.log(' this.state: ', this.state)
        })
    }

    toggleModal() {
        console.log('togglemodal is running')
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible
        })
    }

    methodGetUrl(url) {
        this.setState({
            imageUrl: url
        })
        console.log('imageUrl in App:', this.state.imageUrl)
        console.log('this.state::', this.state)

        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible
        })
    };

    methodInApp(arg) {
        this.setState({
            imageUrl: arg
        })
    }

    render() {
        return (

            <div>
                <div>
                    <Logo />
                </div>
                <div onClick={() => this.toggleModal()}>
                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        imageUrl={this.state.imageUrl}
                    />
                </div>

                {this.state.uploaderIsVisible && <Uploader
                    methodInApp={this.methodInApp}
                    toggleModal={this.toggleModal}
                />}
                <div>
                </div>
            </div>

        );
    }
}

export default App;
