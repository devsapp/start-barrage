import { Component } from 'react';
import { Input, Button } from '@b-design/ui';
import './index.scss';
type Props = {
    message: string
};


function Message(props: Props) {
    return (
        <div className="message-container">
            <div className="message-item">
                {props.message}
            </div>
            <div className="avator">

            </div>
        </div>
    );
}

export default Message;

