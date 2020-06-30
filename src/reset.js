import React, { Component } from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';


class Reset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: 1
        }
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        }, () => console.log('this.state: ', this.state));
    }

    submit() {
        console.log('submit_reset');
        axios.post('/reset/start', this.state).then(data => {
            console.log('data_after_reset: ', data);
            console.log('data.success: ', data);
            if (data) {
                this.setState({
                    display: 2
                });
                console.log('this.state.display: 3', this.state.display)
            } else {
                this.setState({
                    error: true
                });
            }

        }).catch(err => console.log('error inserting secretCode', err));
    }

    submitVer() {
        axios.post('/reset/verify', this.state).then(({ data }) => {
            console.log('verifying code');
            if (data.success) {
                console.log('display: 3')
                this.setState({
                    display: 3
                });
            } else {
                this.setState({
                    error: true
                });
            }

        })

    }

    getCurrentDisplay() {
        const display = this.state.display;
        if (display === 1) {
            return (
                <div >
                    <h1>Please write your email adress</h1>
                    <input name="email" placeholder="email" type="email" onChange={e => this.handleChange(e)} />
                    <button onClick={() => this.submit()}>Send</button>
                </div>
            )
        } else if (display === 2) {
            return (
                <div>
                    <p>Please enter your code</p>
                    <input name="code" key="code" placeholder="code" onChange={e => this.handleChange(e)} />
                    <p>Please enter your new password</p>
                    <input name="password" placeholder="password" type="password" onChange={e => this.handleChange(e)} />
                    <button onClick={() => this.submitVer()}>Send</button>
                </div>
            )
        } else if (display === 3) {
            return (
                <div>
                    <h3>Password changed</h3>
                    <Link to="/login">Login</Link>
                </div>
            )

        }

    }



    render() {
        return (
            <div>
                {this.state.error && <div>An error occured! Please try again</div>}
                {this.getCurrentDisplay()}
            </div >
        );
    }
}

export default Reset;



// getCurrentDisplay(){
//     const step= this.state.step;
//     if (step===1){
//         return (
//             div---show first display
//         )
//     } else if(step===2) {

//     }

// }