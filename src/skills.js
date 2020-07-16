import React, { Component } from 'react';
/* import axios from './axios'; */
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setSkills } from "./actions";

class Skills extends Component {
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
            skills: this.state.skills,

        }

        console.log('about to submit!!!!', skills);

        this.props.dispatch(setSkills(skills));
    }

    render() {
        return (
            <form className="form">
                <h1>Skills</h1>
                {/*  {this.state.error && <div>An Error occured!</div>} */}

                <input name="skills" placeholder="Skills" onChange={e => this.handleChange(e)} />


                <button onClick={() => this.submit()}>Submit</button>

                <Link to="/experiene">Prev</Link>
                <Link to="/preview">Next</Link>
            </form>
        )
    }
}

const mapStateToProps = function (state) {
    return {
        skills: state.skills,

    }
}

export default connect(mapStateToProps)(Skills);