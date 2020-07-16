import React, { Component } from 'react';
//import axios from '../axios'; 
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setPersonal } from "./actions";

class Personal extends Component {
    constructor(props) {
        super(props);
        this.elemRef = React.createRef();
        this.state = {};
    }

    componentDidMount() {
        /* let personal = 
        {
            first: this.props.first,
            last: this.props.last,
            email: this.props.last,
            phone: this.props.phone,
            location: this.props.location,
            jobcategory: this.props.jobcategory
        } 
        
        this.props.dispatch(setPersonal(personal)); */

    }

    handleChange(e) {
        //console.log('e.target.value:', e.target.value);
        //console.log('e.target.name: ', e.target.name);
        this.setState({
            [e.target.name]: e.target.value
            //is asynchronous, thats why the callback function bellow
        }, () => console.log('this.state: ', this.state));
    }

    submit(e) {
        e.preventDefault();
        console.log('about to submit!!!!');

        let personal =
        {
            first: this.state.first,
            last: this.state.last,
            email: this.state.last,
            phone: this.state.phone,
            location: this.state.location,
            jobcategory: this.state.jobcategory
        }

        console.log('about to submit!!!!', personal);

        this.props.dispatch(setPersonal(personal));
    }

    render() {
        return (
            <div className="wrapper">
                <h1>Personal data</h1>
                <div className="description">
                    <h3>Please add Your Contact Information and Personal Details</h3>
                </div>
                <form className="form">

                    {/*  {this.state.error && <div>An Error occured!</div>} */}
                    {/* <label> First Name: </label> */}
                    <input name="first" placeholder="First Name" onChange={e => this.handleChange(e)} />
                    {/* <label> Last Name: </label> */}
                    <input name="last" placeholder="Last Name" onChange={e => this.handleChange(e)} />
                    {/* <label>Email: </label> */}
                    <input name="email" placeholder="Email" type="email" onChange={e => this.handleChange(e)} />
                    {/* <label> Phone Number: </label> */}
                    <input name="phone" placeholder="Phone Number" type="tel" onChange={e => this.handleChange(e)} />
                    {/* <label> Location: </label> */}
                    <input name="location" placeholder="Location" type="text" onChange={e => this.handleChange(e)} />
                    {/* <label> Job Category: </label> */}
                    <input name="jobcategory" placeholder="Job Category" type="text" onChange={e => this.handleChange(e)} />
                    <div className="btn">
                        <button className="submit" onClick={() => this.submit()}>Submit</button>

                    </div>

                </form>

            </div>
        )
    }
}

const mapStateToProps = function (state) {
    return {
        first: state.first,
        last: state.last,
        email: state.last,
        phone: state.phone,
        location: state.location,
        jobcategory: state.jobcategory
    }
}

export default connect(mapStateToProps)(Personal);