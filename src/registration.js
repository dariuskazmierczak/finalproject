import React, { Component } from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange(e) {

        this.setState({
            [e.target.name]: e.target.value

        }, () => console.log('this.state: ', this.state));
    }

    submit() {
        console.log('about to submit!!!!');

        axios.post('/register', this.state).then(({ data }) => {
            console.log('data from server: ', data.success);
            if (data.success) {

                location.replace('/');
            } else {

                this.setState({
                    error: true
                });
            }
        }).catch(err => console.log('error ', err));
    }


    render() {
        return (
            <form className="registration-form">
                <h1>Please fill out the registration form</h1>
                {this.state.error && <div>Oops something went wrong!</div>}
                <input name="first" placeholder="first" onChange={e => this.handleChange(e)} />
                <input name="last" placeholder="last" onChange={e => this.handleChange(e)} />
                <input name="email" placeholder="email" type="email" onChange={e => this.handleChange(e)} />
                <input name="password" placeholder="password" type="password" onChange={e => this.handleChange(e)} />
                <button onClick={() => this.submit()}>Register</button>
                <Link to="/login">Login</Link>
            </form>

            //short for Fragments---doesn't add another div
            // <>
            //     <h1>I am Registration!!!</h1>
            // </>
        );
    }
}

export default Registration;