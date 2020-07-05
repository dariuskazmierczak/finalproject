import React, { Component } from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value }, () => console.log('this.state in loggedIn: ', this.state));
    }

    submit() {
        console.log('submit!');

        axios.post('/login', this.state)
            .then(({
                data
            }) => {
                console.log('data from sever:', data.success);
                if (data.success) {
                    location.replace('/');
                } else {
                    this.setState({
                        error: true
                    });
                }
            }).catch((err) => console.log(err));
        e.preventDefault();
    };

    render() {
        return (
            <div>
                <h1>
                    Login please
                </h1>

                {this.state.error && <div>Oops something went wrong! Are you registered?</div>}
                <input name="email" placeholder="email" type="email" onChange={e => this.handleChange(e)} />
                <input name="password" placeholder="password" type="password" onChange={e => this.handleChange(e)} />
                <button onClick={() => this.submit()}>Login</button>
                <Link to="/reset">Reset your password</Link>

            </div>
        );
    }

}
export default Login;