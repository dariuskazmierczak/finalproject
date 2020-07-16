import React, { Component } from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async handleChange(e) {
        await this.setState(
            {
                [e.target.name]: e.target.value
            });
        if (
            this.state.email &&
            this.state.password
        ) {
            this.setState({ formReady: true });
        }
        else {
            this.setState({ formReady: false });
        }

    }

    submit(e) {
        e.preventDefault();
        console.log('about to submit!!!!');

        axios.post('/register', this.state).then(({ data }) => {
            console.log('data from server: ', data.success);
            if (data.success) {
                location.replace('/');
            }
            else {
                this.setState({
                    error: true
                });
            }
        }).catch(err => console.log('error ', err));
    }


    render() {
        return (
            <div>
                <form className="form">
                    {this.state.error && <div>Oops something went wrong!</div>}
                    <input name="email" placeholder="email" type="email" onChange={e => this.handleChange(e)} />
                    <input name="password" placeholder="password" type="password" onChange={e => this.handleChange(e)} />
                    <button disabled={!this.state.formReady} onClick={e => this.submit(e)}>Register</button>
                    <Link to="/login">Login</Link>
                </form>
            </div>


        );
    }
}

export default Registration;