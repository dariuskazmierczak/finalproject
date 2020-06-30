import React, { Component } from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.signup = this.signup.bind(this);
        this.state = {
            email: "",
            password: ""

        };
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        <Redirect to="/registration" />;
    }

    login(e) {
        e.preventDefault();
        fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch((error) => {
            alert(error);
        });
    }

    signup(e) {
        e.preventDefault();
        fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch((error) => {
            alert(error);
        });
    }

    submit() {
        console.log('submit!');

        axios.post('/login', this.state)
            .then(({
                data
            }) => {
                console.log('data from sever:', data);
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
            <div className="login-form">
                <h1>Login</h1>
                <form onSubmit={this.submitForm}>

                    <input name="email" placeholder="email" onChange={e => this.handleChange(e)}
                    />

                    <div>
                        <label for="exampleInputPassword1">Password: </label>
                        <br />
                        {/* Margin issue when showing and hiding password */}
                        <PasswordMask
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                            name="password"
                            id="exampleInputPassword1"
                            placeholder="**********"
                        />
                    </div>
                    <br />
                    <button
                        type="submit"
                        className="button"
                        onClick={this.login}
                        onSubmit={this.handleSubmit}>Login</button>

                    <Link className="button-inv" to="/register">Login</Link>
                </form>
            </div>

        );
    }


}
export default Login;