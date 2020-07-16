import React from 'react';
import { HashRouter, Route } from 'react-router-dom';


import Registration from './registration';
import Login from './login';
import Reset from './reset';

export default function Welcome() {
    return (
        <div className="welcome-container">
            <div className="welcome-header">
                <div className="welcome-img">
                    <img src="../logo3.png" />
                </div>
            </div>
            <HashRouter>
                <div className="welcome-comp">
                    <Route exact path='/' component={Registration} />
                    <Route exact path='/register' component={Registration} />
                    <Route exact path='/login' component={Login} />
                    {/* <Route exact path='/reset' component={Reset} /> */}

                </div>
            </HashRouter>
        </div>
    )
}