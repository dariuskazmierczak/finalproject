import React from "react";
import ReactDOM from "react-dom";

import Welcome from "./welcome";
import App from "./app";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";


const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });
const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(reduxPromise))
);

let elem;
const userIsLoggedIn = location.pathname != "/welcome";

if (!userIsLoggedIn) {
    elem = <Welcome />;
} else {
    //establish socket connection with the server 
    //init(store);
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main"));