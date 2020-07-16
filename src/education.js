import React, { Component } from 'react';
/* import axios from './axios'; */
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setEducation } from "./actions";

class Education extends Component {
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

    /*  submit(e) {
         e.preventDefault();
         console.log('about to submit!!!!');
 
         let education =
         {
             school_name: this.state.school_name,
             school_location: this.state.school_location,
             degree: this.state.degree,
             start_date: this.state.start_date,
             end_date: this.state.end_date,
         }
 
         console.log('about to submit!!!!', education);
 
         this.props.dispatch(setEducation(education));
     } */


    render() {
        return (
            <div className="wrapper">
                <h1>Education</h1>
                <div className="description">
                    <h3>Please write the essential information about your education</h3>
                </div>
                <form className="form">
                    {/*  {this.state.error && <div>An Error occured!</div>} */}
                    <div className="inputbox">
                        {/* <label> School Name:</label> */}
                        <input name="school_name" required autoComplete="off" placeholder="School Name" onChange={e => this.handleChange(e)} />
                    </div>
                    <div className="inputbox">
                        {/* <label> School location: </label> */}
                        <input name="school_location" required autoComplete="off" placeholder="School location" onChange={e => this.handleChange(e)} />
                    </div>
                    <div className="inputbox">
                        {/* <label>Degree: </label> */}
                        <input name="degree" required autoComplete="off" placeholder="Degree" type="text" onChange={e => this.handleChange(e)} />
                    </div>
                    <div className="date">
                        {/* <label> Start Date: </label> */}
                        <input className="start-date" name="start_date" required autoComplete="off" placeholder="Start Date" type="text" onChange={e => this.handleChange(e)} />
                        {/* <label> End Date: </label> */}
                        <input className="start-date" name="end_date" required autoComplete="off" placeholder="End Date" type="text" onChange={e => this.handleChange(e)} />
                    </div>
                    <div className="btn">
                        <button className="submit" onClick={() => this.submit()}>Submit</button>

                    </div>
                </form>

            </div>
        )
    }
}

/* const mapStateToProps = function (state) {
    return {
        school_name: this.state.school_name,
        school_location: this.state.school_location,
        degree: this.state.degree,
        start_date: this.state.start_date,
        end_date: this.state.end_date,
    }
}

export default connect(mapStateToProps)(Education); */

export default Education;