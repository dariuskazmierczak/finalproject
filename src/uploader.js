import React, { Component } from 'react';
import ProfilePic from './profilepic';
import axios from './axios';


class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {}

        this.methodInUploader = this.methodInUploader.bind(this);
    }

    componentDidMount() {
        console.log('Uploader mounted')
    }

    methodInUploader() {
        console.log('running method in uploader');
        console.log('event.target.files[0]:', event.target.files[0]);

        this.setState({
            imageUrl: URL.createObjectURL(event.target.files[0]),
            file: event.target.files[0],
            name: event.target.files[0].name
        }, () => {
            console.log('callback this.state uploading image: ', this.state);

        });
    }

    closeModalInUploader() {
        this.props.toggleModal();
    }


    uploadImage() {
        var formData = new FormData();
        formData.append('file', this.state.file);
        formData.append('name', this.state.name);
        console.log('uploadImage this.state', this.state);
        console.log('upload image formdata', formData)

        axios.post('/upload', formData).then(({ data }) => {
            this.props.methodGetUrl(data.imageurl);
        }).catch(function (err) {
            console.log('err in POST', err)
        })

        //------------------
        //sending props to app
        //this.props.methodInApp(this.state.imageUrl);
        //this.props.toggleModal();
        //this.closeModalInUploader();
    }

    render() {
        return (
            <div className="modal">
                <div>
                    <p onClick={() => this.closeModalInUploader()}>X</p>
                    <h2>
                        Want to change or upload your image?
                    </h2>

                </div>
                <div className="modal-img-container">
                    <input type="file" id="image" name="image" accept="image/*" onChange={this.methodInUploader}
                    />
                    <img src={this.state.imageUrl} />
                </div>
                <button onClick={() => this.uploadImage()}>Confirm</button>
            </div>

        );
    }
}

export default Uploader;