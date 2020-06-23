import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Registration from './registration';
import Login from './login';


export default function Welcome() {
    return (
        <div>
            <h1> Welcome </h1>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route exact path="/login" component={Login} />
                </div>
            </HashRouter>



            <h3>If you have a account you can <a href="">login</a></h3>
        </div>
    );
}