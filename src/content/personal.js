import React, { Component } from 'react';
/* import axios from './axios'; */
import { Link } from 'react-router-dom';

class Personal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    handleChange(e) {
        //console.log('e.target.value:', e.target.value);
        //console.log('e.target.name: ', e.target.name);
        this.setState({
            [e.target.name]: e.target.value
            //is asynchronous, thats why the callback function bellow
        }, () => console.log('this.state: ', this.state));
    }

    /*submit() {
        console.log('about to submit!!!!');
        //get this.state info and send it to server with axios
        axios.post('/register', this.state).then(({ data }) => {
            console.log('data from server: ', data.success);
            if (data.success) {
                //log user into app
                location.replace('/');
            } else {
                //div pop-up 'something went wrong'
                this.setState({
                    error: true
                });
            }
        }).catch(err => console.log('error ', err));
    }
 */

    render() {
        return (
            <div className="wrapper">
                <h1>Personal data</h1>
                <div className="description">
                    <h3>Please add Your Contact Information and Personal Details</h3>
                </div>
                <form className="personal-data-form">

                    {/*  {this.state.error && <div>An Error occured!</div>} */}
                    <label> First Name: </label>
                    <input name="first" /* placeholder="first" */ onChange={e => this.handleChange(e)} />
                    <label> Last Name: </label>
                    <input name="last" /* placeholder="last" */ onChange={e => this.handleChange(e)} />
                    <label>Email adress: </label>
                    <input name="email" /* placeholder="email"  */ type="email" onChange={e => this.handleChange(e)} />
                    <label> Phone Number: </label>
                    <input name="phone" /* placeholder="password" */ type="text" onChange={e => this.handleChange(e)} />
                    <label> Location: </label>
                    <input name="location" /* placeholder="password" */ type="text" onChange={e => this.handleChange(e)} />
                    <label> Job Category: </label>
                    <input name="jobcategory" /* placeholder="password" */ type="text" onChange={e => this.handleChange(e)} />
                    <button onClick={() => this.submit()}>Submit</button>


                </form>
                <div className="links">
                    <Link to="/personal">Prev</Link>
                    <Link to="/experience">Next</Link>
                </div>
            </div>
        )
    }
}

export default Personal;