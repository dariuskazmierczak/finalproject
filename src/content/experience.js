import React, { Component } from 'react';
/* import axios from './axios'; */
import { Link } from 'react-router-dom';

class Experience extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    /* handleChange(e) {
        //console.log('e.target.value:', e.target.value);
        //console.log('e.target.name: ', e.target.name);
        this.setState({
            [e.target.name]: e.target.value
            //is asynchronous, thats why the callback function bellow
        }, () => console.log('this.state: ', this.state));
    }

    submit() {
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
    } */


    render() {
        return (
            <form className="experience-form">
                <h1>Work Experience</h1>
                {/*  {this.state.error && <div>An Error occured!</div>} */}
                <label> Company Name: </label>
                <input name="company-name" /* placeholder="first" */ onChange={e => this.handleChange(e)} />
                <label> Job Title: </label>
                <input name="job-title" /* placeholder="last" */ onChange={e => this.handleChange(e)} />
                <label> Job Responsibilities: </label>
                <input name="job-respons" /* placeholder="last" */ onChange={e => this.handleChange(e)} />
                <label>Job Location: </label>
                <input name="job-location" /* placeholder="email"  */ type="text" onChange={e => this.handleChange(e)} />
                <label>Start Date: </label>
                <input name="start-date" /* placeholder="password" */ type="text" onChange={e => this.handleChange(e)} />
                <label> End Date: </label>
                <input name="end-date" /* placeholder="password" */ type="text" onChange={e => this.handleChange(e)} />
                <button onClick={() => this.submit()}>Submit</button>

                <Link to="/education">Prev</Link>
                <Link to="/skills">Next</Link>
            </form>
        )
    }
}

export default Experience;