import React, { Component } from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.submit = this.submit.bind(this);
        this.handleChange1 = this.handleChange1.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
    }

    handleChange1(e) {
        this.setState({
            email: e.target.value

            //is asynchronous, thats why the callback function bellow
        }, () => console.log('states in loggedIn: ', this.state));
    }

    handleChange2(e) {
        this.setState({
            password: e.target.value

            //is asynchronous, thats why the callback function bellow
        }, () => console.log('states in loggedIn: ', this.state));
    }

    submit(e) {
        e.preventDefault();
        console.log('about to submit', this.state);

        //get this.state info and send it to server with axios
        axios.post('/login', this.state).then(({ data }) => {
            //axios.post('/login').then((ans) => {if (ans) {console.log('data: ');}
            console.log('data: ', data);
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
        }).catch(err => {
            console.log('error w axios', err);
            this.setState({
                error: true
            });

        })
    }

    render() {
        return (
            <div className="register-form">
                <form className="form">
                    {this.state.error && <div>Oops something went wrong! Are you registered?</div>}
                    <input name="email" placeholder="email" type="email" onChange={e => this.handleChange1(e)} />
                    <input name="password" placeholder="password" type="password" onChange={e => this.handleChange2(e)} />
                    <button className="log-button" onClick={(e) => this.submit(e)}>Login</button>
                    <div className="error">
                        {/* <Link to="/reset">Reset your password </Link> */}
                        <Link to="/register">Do You have account? Register now for free...</Link>
                    </div>
                </form>
            </div >
        );
    }
}

export default Login;