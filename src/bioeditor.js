import React, { Component } from 'react';
import axios from './axios';

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
        console.log('props in inputBio: ', this.props.bio);
    }

    toggleTextarea() {
        this.setState({
            textAreaIsVisible: !this.state.textAreaIsVisible,
            buttonIsVisible: !this.state.buttonIsVisible
        })
    }

    inputBio(event) {
        console.log('event in inputBio: ', event.target.value)
        this.setState({
            [event.target.name]: event.target.value
        }, () => console.log('this.state in inputBio: ', this.state));
        this.props.updateBio(event.target.value);
    }

    saveBio(event) {
        console.log("this.state in saveBio event:", this.state);
        axios.post('/bioediting', this.state).then(({ data }) => {
            console.log('data from server: ', data)
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
        // if (!this.props.bio) {
        //     return;
        // }
        return (
            <div className="bioEdit">
                {
                    this.state.buttonIsVisible &&
                    (
                        this.props.bio ?
                            <button className="btn-bio" onClick={() => this.toggleTextarea()}>Edit your Bio</button>
                            :
                            <button className="btn-bio" onClick={() => this.toggleTextarea()}>Add your Bio</button>
                    )
                }

                {
                    this.state.textAreaIsVisible ?
                        <div className="textarea">
                            <textarea id="bioediting" name="biotext" rows="10" cols="50" onChange={this.inputBio}>{this.props.bio}</textarea>
                            <button onClick={() => this.saveBio()}>Save</button>
                        </div>
                        :
                        <p>{this.props.bio}</p>
                }

            </div>

        );
    }
}

export default BioEditor;