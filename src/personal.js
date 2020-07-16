import React, { Component } from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setPersonal } from "./actions";

class Personal extends Component {
    constructor(props) {
        super(props);
        this.elemRef = React.createRef();
        this.state = {};
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        console.log("1. Component personal didmount this.props.personal:", this.props.personal);

        var elems = document.querySelectorAll('input');
        //console.log("elems:", elems);

        for (var key in this.props.personal) {
            //console.log("key:", key);
            //console.log("personal key:", this.props.personal[key]);
            for (var i = 0; i < elems.length; i++) {
                //console.log("input name:", elems[i].name);
                if (elems[i].name == key) {
                    elems[i].value = this.props.personal[key];
                    //this.setState({[elems[i].name]: this.props.personal[key]});
                }
            }
        }

        console.log("2. Component personal didmount this.props.personal:", this.props.personal);
        console.log("2. Component personal didmount this.state:", this.state);
    }

    componentDidUpdate(prevProps) {
        console.log("Component personal UPDATE personal props obj:", this.props.personal);
        var elems = document.querySelectorAll('input');
        //console.log("elems:", elems);

        for (var key in this.props.personal) {
            //console.log("key:", key);
            //console.log("personal key:", this.props.personal[key]);
            for (var i = 0; i < elems.length; i++) {
                //console.log("input name:", elems[i].name);
                if (elems[i].name == key) {
                    elems[i].value = this.props.personal[key];
                }
            }
        }

        console.log("2. Component personal update this.props.personal:", this.props.personal);
        console.log("2. Component personal update this.state:", this.state);
    }

    handleChange(e) {
        //updating states method
        //this.setState({[e.target.name]: e.target.value});
    }

    async submit(e) {
        //submit states to redux store method
        e.preventDefault();

        console.log("::::::::::::::SUBMIT:::::::");

        var personalUpdate = {};

        var elems = document.querySelectorAll('input');
        for (var key in this.props.personal) {
            //console.log("dla props.personal:", key);
            for (var i = 0; i < elems.length; i++) {
                if (elems[i].name == key) {
                    //console.log("SETING STATE", elems[i].name);
                    //console.log("VALUE:", elems[i].value);
                    personalUpdate[elems[i].name] = elems[i].value;
                    //this.setState({[elems[i].name]: elems[i].value});
                    //console.log("---------------------------------");
                }
            }
        }

        /* let personalUpdate = 
        {
            first: this.state.first,
            last: this.state.last,
            email: this.state.last,
            phone: this.state.phone,
            location: this.state.location,
            jobcategory: this.state.jobcategory
        }  */

        console.log('about to submit!!!!', personalUpdate);
        await this.props.dispatch(setPersonal(personalUpdate));
        await axios.post('/personal_update', this.props.personal);
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
                        <button className="submit" onClick={(e) => this.submit(e)}>Submit</button>

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
        personal: state.personal
    }
}

export default connect(mapStateToProps)(Personal);