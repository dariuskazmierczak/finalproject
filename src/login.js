import React, { Component } from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value

            //is asynchronous, thats why the callback function bellow
        }, () => console.log('this.state in loggedIn: ', this.state));
    }

    submit() {
        console.log('about to submit')
        //get this.state info and send it to server with axios
        axios.post('/login', this.state).then(({ data }) => {
            console.log('data.success: ', data.success);

            if (data.success) {
                //log user into app
                //location.replace('/logo')
                console.log('data_server: ', data);
                console.log('login succeed!!');
                location.replace('/')
            } else {
                //div pop-up 'something went wrong'
                console.log('login went wrong');
                this.setState({
                    error: true
                });
            }
        }).catch(err => console.log('error ', err))
    }


    render() {
        return (
            <div>
                <h1>
                    /
                </h1>
                <form className="login-form">
                    {this.state.error && <div>Oops something went wrong! Are you registered?</div>}
                    <input name="email" placeholder="email" type="email" onChange={e => this.handleChange(e)} />
                    <input name="password" placeholder="password" type="password" onChange={e => this.handleChange(e)} />
                    <button onClick={() => this.submit()}>Login</button>
                    <Link to="/reset">Reset your password</Link>
                    <Link to="/register">Do You have account? Register now for free...</Link>
                </form>
            </div>
        );
    }
}

export default Login;