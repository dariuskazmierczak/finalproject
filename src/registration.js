import React, {
    Component
} from 'react';

import axios from './axios';
import { Link } from "react-router-dom";

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first: " ",
            last: " ",
            email: " ",
            password: " ",

        }
        //this.handleChange = this.handleChange.bind(this);
        //this.postRegistration = this.postRegistration.bind(this);
        //code not to cookie; we gonna store i db. we have to create a new table. Email adress and timestamp.

        //email should be store in state in some component

        ///conditional rendering
        //step is from state default value (axios post req)
    }

    handleChange(e) {
        console.log('e.target.value:', e.target.value);
        console.log('e.target.name:', e.target.name);
        this.setState({
            [e.target.name]: e.target.value
        }, () => console.log("this.state:", this.state));
    }

    submit() {
        console.log('submit!!!');
        e.preventDefault();
        axios.post('/register', this.state)
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
    }

    render() {
        return (<>
            <h1> Please register here </h1>  {
                this.state.error && <div> </div>}
            <div className="register-form">
                <input name="first" placeholder="first" onChange={e => this.handleChange(e)} />

                <input name="last" placeholder="last" onChange={e => this.handleChange(e)} />

                <input name="email" placeholder="email" onChange={e => this.handleChange(e)} />

                <input name="password" placeholder="password" type="password" onChange={e => this.handleChange(e)} />

                <button onClick={() => this.submit()}>Register</button>

                <Link className="link-log" to="/login">Login</Link>
            </div>
        </>
        );
    }
}

export default Registration;

//if wrap in the form preventDefault