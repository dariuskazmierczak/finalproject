import React, { Component } from 'react';
/* import axios from './axios'; */
/* import { Link } from 'react-router-dom'; */


/* export default function Languages() { */
class Languages extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /*  handleChange(e) {
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
            <div className="lang-container">
                <h1>Languages</h1>
                <form className="lang-form">
                    {/* {this.state.error && <div>Oops something went wrong! Are you registered?</div>} */}
                    <input name="lang-input" placeholder="Language" type="text" onChange={e => this.handleChange(e)} />
                    <input name="password" placeholder="Level" type="password" onChange={e => this.handleChange(e)} />
                    <button onClick={() => this.submit()}>Login</button>
                    {/*  <Link to="/reset">Reset your password</Link>
                    <Link to="/register">Do You have account? Register now for free...</Link> */}
                </form>
            </div>

        )
    }
}

export default Languages;

//jeśli ktoś zna więcej niz jeden język potrzebna jest opcja tworzenia kolejnego pola ponizej ju wypełnionego