import React, { Component } from 'react';
import { socket } from './socket';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addNewChatMsg, getLastChatMessages } from './actions';

import { connect } from 'react-redux';
//mport moment from 'moment';
//import OnlineUsers from './OnlineUsers';

//export default function Chat() 
class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        console.log('chat component mounted');
        socket.emit('chatMessages');
        //const chatMessages = this.props.chatMessages;
        console.log('here are my last 10 messages: ', this.props.chatMessages);
    }

    componentDidUpdate() {


    }

    keyCheck(e) {
        console.log('key pressed:', e.key);
        if (e.key == 'Enter') {
            e.preventDefault();
            socket.emit('getNewMessage', e.target.value);
            e.target.value = '';
        }
    }

    render() {
        return (
            <div className="chat-container">
                <h1 className="chat-title">
                    Chit-Chat</h1>
                {/* <div className="chat-messages-container" ref={elemRef}> */}
                <div className="chat-msg-container">
                    {
                        this.props.chatMessages &&
                        this.props.chatMessages.map((elem, idx) => {
                            return (
                                <div className="chat-msg" key={idx}>
                                    <div className="image3">
                                        <Link to={`/user/${elem.id}`} ><img src={elem.imageurl} /></Link>
                                    </div>
                                    <div className="chat-info-msg">
                                        <div className="msg-desc">
                                            <h3>{elem.first} {elem.last}</h3>
                                            <h4>({elem.created_at})</h4>
                                        </div>
                                        <p>{elem.text_message}</p>

                                    </div>
                                </div>
                            )
                        })
                    }

                    <textarea placeholder="add you message here" spellCheck="false" rows="12" cols="60" wrap="hard" onKeyDown={this.keyCheck}></textarea>
                </div>
            </div>
        )
    };
}

const mapStateToProps = function (state) {
    return {
        chatMessages: state.chatMessages
    }
}

export default connect(mapStateToProps)(Chat);

/*import React, { useEffect, useRef } from 'react';
import { socket } from './socket';
import { useSelector } from 'react-redux';
import e from 'express';

export default function Chat() {

    const elemRef = useRef();

    const chatMessages = useSelector(state => state && state.chatMessages);
    //console.log('Here are my last 10 chat');

    const keyCheck = e => (
        //console.log('value', e.target.value);
        //console.log('key pressed', e.key);

        if (e.key === 'Enter') {
        e.preventDefault();

        socket.emit('My amazing chat message', e.target.value);
        e.target.value = "";
        //console.log('our message:', e.target.value);
    }
    );

    useEffect(() => {
        console.log('that hooks component has mounted');
        console.log('elemRef:', elemRef);
        console.log('scroll Top:', element.current.scrollTop);
        console.log();
        console.log();

        element.current.scrollTop = element.current.scrollHeight - element.current.clientHeight;
    }, []; //it has to be modyfiy every time when run the chat messages
    //first retrieving
})
retunr {
    <div>
        <p className='Chat-title'> Welcome to chat</p>
        <div className='Chat-messages=container' ref={elemRef}>

            <p>Chat message will go here</p>
            <p>Chat message will go here</p>
            <p>Chat message will go here</p>
            <p>Chat message will go here</p>
            <p>Chat message will go here</p>
            <p>Chat message will go here</p>
            <p>Chat message will go here</p>
            <p>Chat message will go here</p>
            <p>Chat message will go here</p>


        </div>
        <textarea placeholder=""
        </div>
    }
}*/