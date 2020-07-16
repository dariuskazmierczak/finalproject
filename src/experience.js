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
            <div className="wrapper">
                <h1>Work Experience</h1>
                <div className="description">
                    <h3>Please add Your Contact Information and Personal Details</h3>
                </div>
                <form className="form">

                    {/*  {this.state.error && <div>An Error occured!</div>} */}
                    {/* <label> Company Name: </label> */}
                    <input name="company-name" required autocomplete="off" placeholder="Company Name" onChange={e => this.handleChange(e)} />
                    {/* <label> Job Title: </label> */}
                    <input name="job-title" required autocomplete="off" placeholder="Job Title" onChange={e => this.handleChange(e)} />
                    {/* <label> Job Responsibilities: </label> */}
                    <input name="job-respons" required autocomplete="off" placeholder="Job Responsibilities" onChange={e => this.handleChange(e)} />
                    {/* <label>City: </label> */}
                    <input name="city" required autocomplete="off" placeholder="City" type="text" onChange={e => this.handleChange(e)} />
                    {/* <label>Country: </label> */}
                    <input name="country" required autocomplete="off" placeholder="Country" type="text" onChange={e => this.handleChange(e)} />
                    <div className="date">
                        {/* <label> Start Date: </label> */}
                        <input className="start-date" name="start-date" required autocomplete="off" placeholder="Start Date" type="text" onChange={e => this.handleChange(e)} />
                        {/* <label> End Date: </label> */}
                        <input className="start-date" name="end-date" required autocomplete="off" placeholder="End Date" type="text" onChange={e => this.handleChange(e)} />
                    </div>
                    <div className="btn">
                        <button className="submit" onClick={() => this.submit()}>Submit</button>
                        <div className="links">
                            <button className="link-left"><Link to="/personal">Education</Link></button>
                            <button className="link-right"><Link to="/experience">Skills</Link></button>
                        </div>
                    </div>

                </form>
                {/*  <div className="links">
                    <button className="link-left"><Link to="/personal">Education</Link></button>
                    <button className="link-right"><Link to="/experience">Skills</Link></button>
                </div> */}
            </div>

        )
    }
}

export default Experience;