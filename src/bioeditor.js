import React, { Component } from 'react';
import axios from './axios';

/*class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'Please write an essay about your favorite DOM element.'
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        alert('An essay was submitted: ' + this.state.value);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Essay:
            <textarea value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default BioEditor;*/

class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textAreaIsVisible: false,
            buttonIsVisible: true
        }

        this.inputBio = this.inputBio.bind(this);
        this.saveBio = this.saveBio.bind(this);
    }

    componentDidMount() {
        this.setState({})
        console.log('this.props.bio: ', this.props.bio)
    }

    toggleTextarea() {
        this.setState({
            textAreaIsVisible: !this.state.textAreaIsVisible,
            buttonIsVisible: !this.state.buttonIsVisible
        })
    }

    inputBio(event) {
        console.log('event.target.value_bio: ', event.target.value)
        this.setState({
            [event.target.name]: event.target.value
        }, () => console.log('this.state_bio: ', this.state));
        this.props.updateBio(event.target.value);
    }

    saveBio(event) {
        console.log("event", event);
        axios.post('/bioediting', this.state).then(({ data }) => {
            console.log('data_server: ', data)
            this.setState({
                bio: data.bio
            })
            this.setState({
                textAreaIsVisible: !this.state.textAreaIsVisible,
                buttonIsVisible: !this.state.buttonIsVisible
            })
            this.props.updateBio(this.state.bio);

        }).catch(err => console.log('error ', err))
    }

    render() {

        return (
            <div className="bioEdit">
                {
                    this.state.buttonIsVisible && (
                        this.props.bio ?
                            <button className="btnedit" onClick={() => this.toggleTextarea()}>Edit</button>
                            :
                            <button className="btnadd" onClick={() => this.toggleTextarea()}>Add</button>
                    )

                }
                {
                    this.state.textAreaIsVisible ?
                        <div className="textarea">
                            <textarea id="bioediting" name="biotext" rows="10" cols="50" onChange={this.inputBio}></textarea>
                            <button className="btnbio-save" onClick={() => this.saveBio()}>Save</button>
                        </div>
                        :
                        <p>{this.props.bio}</p>
                }

            </div>

        );
    }
}

export default BioEditor;