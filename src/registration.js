import React, {
    Component
} from 'react';

import axios from './axios';
import { Link } from "react-router-dom";

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        }, () => console.log("this.state:", this.state));
    }

    submit() {
        console.log('submit');
        e.preventDefault();
        axios.post('/register', this.state)
            .then(({
                data
            }) => {
                console.log('data:', data);
                if (data.success) {
                    location.replace('/');
                } else {
                    this.setState({
                        error: true
                    });
                }
            }).catch((err) => console.log(err));
    };

    render() {
        return (
            <div className="register-form">
                <h1> Please register here </h1>
                {this.state.error && <div>An error occured!</div>}

                <input name="first" placeholder="first" onChange={e => this.handleChange(e)} />

                <input name="last" placeholder="last" onChange={e => this.handleChange(e)} />

                <input name="email" placeholder="email" onChange={e => this.handleChange(e)} />

                <input name="password" placeholder="password" type="password" onChange={e => this.handleChange(e)} />

                <button onClick={() => this.submit()}>Register</button>

                <Link className="link-log" to="/login">Login</Link>
            </div>
            //<> </>
        );
    }
}


export default Registration;