import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUser } from "./actions";

import Logo from './logo';
import axios from './axios';

import Personal from './personal';
import Education from './education';
import Skills from './Skills';
//import Experience from './content/experience';
//mport Skills from './content/skills';
//import Languages from './content/languages';
import Preview from './preview';

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

    componentDidMount() {
        console.log('mounted');

        //redux action for setting states of logged user id and email
        this.props.dispatch(setUser());


    }

    /* toggleModal() {
        console.log('togglemodal is running');
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible
        });
    } */

    logOut(e) {
        e.preventDefault();
        console.log('logout is running');
        this.setState({
            id: null
        });
        axios.post('/logout').then(() => {
            location.replace('/welcome#/login');
        });
    }

    async createCV(e) {
        e.preventDefault();
        var { data } = await axios.post('/personal', this.props.personal);
        console.log('data from server: ', data);
        data = { ...data, template: "template1.docx" };
        console.log('data from server with template: ', data);
        await axios.post('/generate', data);
        //console.log('data from server: ', data);
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
                            <div className="main-container-r">
                                {/* <Preview /> */}
                            </div>
                        </div>
                        <button className="logout" onClick={() => this.logOut()}>logout</button>

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

