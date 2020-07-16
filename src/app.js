import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUser, setPersonal, userLogout } from "./actions";

import Logo from './logo';
import axios from './axios';

import Personal from './personal';
import Education from './education';
//import Experience from './content/experience';
import Skills from './skills';
//import Languages from './content/languages';
import Preview from './preview';

import download from 'js-file-download';



class App extends Component {
    constructor(props) {
        super(props);
        this.elemRef = React.createRef();
        this.state = {
            uploaderIsVisible: false
        },
            //this.toggleModal = this.toggleModal.bind(this);
            this.logOut = this.logOut.bind(this);

    }

    async componentDidMount()
    //method for initialize data in redux from database 
    {
        console.log('App mounted this.props.id:', this.props.id);


        //redux action for setting states of logged user id and email
        await this.props.dispatch(setUser());

        //check for old user data stored on database
        let { data } = await axios.post('/personal_get');
        console.log('App didmount personal_get from server: ', data);

        if (data)
        //fetch old data and set in store
        {
            await this.props.dispatch(setPersonal(data));
        }
        else
        //create new record and empty structure in store
        {
            let { data } = await axios.post('/personal_set');
            await this.props.dispatch(setPersonal(data));
        }

        console.log('App didmount redux store: ', this.props);

    }

    /* toggleModal() {
        console.log('togglemodal is running');
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible
        });
    } */

    async logOut(e) {
        //logout method
        e.preventDefault();


        await this.props.dispatch(userLogout());

        var logoutdone = await axios.post('/logout');

        if (logoutdone) { location.replace('/welcome#/login'); }

        console.log('bye...');
    }

    async createCV(e) {
        //create resume method
        e.preventDefault();

        //updating data to create resume
        let data = this.props.personal;
        //await axios.post('/personal_update', this.props.personal);
        //next forms data goes here

        //adding info about template
        data = { ...data, template: "template1.docx" };
        console.log('FINAL DATA FOR CREATING RESUME: ', data);

        //create and download resume
        const resp = await axios({
            url: '/generate',
            method: 'POST',
            responseType: 'blob',
            data
        })
        //console.log('data from server with file: ', resp.data);
        download(resp.data, 'cv.docx');

    }

    render() {
        return (
            <BrowserRouter>
                <div className="main">
                    <div className="main=l">
                        <div className="app-header-l">
                            <Logo />
                            <div className="nav-l">
                                <Link className="one" to="/personal"> PERSONAL</Link>
                                <Link className="two" to="/education"> EDUCATION</Link>

                            </div>
                        </div>
                        <div className="main-container-l">
                            <Route exact path='/personal' component={Personal} />
                            <Route exact path='/education' component={Education} />
                            <Route exact path='/skills' component={Skills} />
                            {/*   <Route exact path='/experience' component={Experience} />
                        <Route exact path='/skills' component={Skills} />
                        <Route exact path='/languages' component={Languages} /> */}
                        </div>
                    </div>
                    <div className="main-r">
                        <div className="app-header-r">
                            <div className="nav-r">
                                <Link className="three" to="/skills"> SKILLS</Link>
                            </div>
                        </div>
                        <div className="main-container-r">
                            {/*   <div className="div-left"></div>
                            <div className="div-right"></div> */}
                            <div className="preview-container">
                                <Preview />
                            </div>
                        </div>
                        <button className="logout" onClick={(e) => this.logOut(e)}>logout</button>
                        <button className="create" onClick={(e) => this.createCV(e)}>CREATE</button>

                    </div>
                </div>
            </BrowserRouter >
        );
    }
}

const mapStateToProps = function (state) {
    return {
        id: state.id,
        email: state.email,
        personal: state.personal
    }
}

export default connect(mapStateToProps)(App);
