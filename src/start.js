import React from 'react';
import ReactDOM from 'react-dom';
//import HelloWorld from "./HelloWorld";
import Welcome from './welcome';
import App from './app';

import Registration from './registration';

let elem;
const userIsLoggedIn = location.pathname != '/welcome'; //truthy or falsy

if (!userIsLoggedIn) {
    elem = < Welcome />;
} else {
    //elem = <h1> I will be the main social network app! </h1>;
    elem = < App />;
}


ReactDOM.render(
    elem, document.querySelector('main')
);


//React render can only be once called per project!!!
//ReactDOM.render(< HelloWorld />,
  //  document.querySelector('main')
//);