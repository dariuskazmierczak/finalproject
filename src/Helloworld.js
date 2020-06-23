import React from "react";
import Name from './Name';

//it is a function component and returning the div (this div here is a js-JSX - it is js that looks like html)
/*function HelloWorld() {
    return ( <
        div > Hello, World! < /div>
    );
}*/
//class component can have state; function comonents do not have state
export default class HelloWorld extends React.Component {
    constructor() {
        super();
        this.state = {
            first: "Bob",
        };
        this.handleClick - this.handleClick.Click.bind(this);
    }

    componentDidMount() {
        //componentDidMOunt is the React equivlent of Vue's mounted method
        //this.setState is how we update state

        this.setState({
            first: "Vanilla"
        },
            () => console.log('this.state:', this.state)
        );
    }

    handleClick() {
        //console.log("handleClick is running!");
        this.setState({
            first: "Ziggy",
        });
    }

    /*Solution ! <
        p onClick = {
            () =>
            this.handleClick()
        } > */
    /*Solution 2 in constructionr: this.handleClick - this.handleClick.Click.bind(this) */

    render() {
        return <div class='container'>
            <h1> Hi, {
                this.state.first
            } </h1> <p onClick={
                this.handleClick
            }>I 'm a p tag!</p><Name first={
                this.state.first
            } /> </div>;
    }
}
//this refers to the class. After we create our own methods this. is loosing its meaning

//state is equivalent for data. All gona be with data it gona be do with state