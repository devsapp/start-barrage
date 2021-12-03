import { Component } from 'react';
import axios from 'axios';

import { Notification, Dropdown, Menu } from '@b-design/ui';
import { v4 as uuidv4 } from 'uuid';
import BarrageList from './barrage-list';
import BarrageInput from './barrage-input';
import BarrageTopbar from './barrage-topbar';
import './index.scss';
type Props = {

};
axios.defaults.baseURL = '/api';

class Screen extends Component<Props, any> {
    updateHeight: any;
    constructor(props: Props) {
        super(props);
        this.state = {
            barrageList: [],
            message: '',
            name: '',
            color: 'blue',
            colorLabel: '炫彩屏幕'
        }
    }

    componentDidMount = () => {
        let name = window.localStorage.getItem('devs-id');
        if (!name) {
            const uuid = uuidv4().replace('-', '').substr(0, 5);
            name = `devs-${uuid}`;
        }
        this.setState({
            name
        });
        window.localStorage.setItem('devs-id', name);
        this.updateHeight = () => {
            this.forceUpdate();
        }
        window.addEventListener('resize', this.updateHeight);


    }

    componentWillUnmount = () => {
        window.removeEventListener('resize', this.updateHeight);
    }
    setMessage = (message: any) => {
        this.setState({
            message
        })
    }

    sendMessage = () => {
        const { barrageList, message, name, color } = this.state;
        if (!message) {
            Notification.warning({
                title: '请输入字符'
            });
            return;
        }
        if (message.length > 120) {
            Notification.error({
                title: '弹幕字数不能超过120个'
            });
            return;
        }
        axios.post('/send', {
            fromId: name || '',
            fromName: name || '',
            message,
            color
        });
        const data = {
            message,
            id: Date.now()
        };
        barrageList.push(data);
        this.setState({
            barrageList,
            message: ''
        });


    }

    setName = (name: string) => {
        this.setState({
            name
        });
        window.localStorage.setItem('devs-id', name);
    }

    setColor = (color: string, colorLabel: string) => {
        this.setState({
            color,
            colorLabel
        })
    }

    render() {
        const { barrageList, message, name, colorLabel, color } = this.state;
        const menu = (
            <Menu>
                <Menu.Item style={{ backgroundColor: '#ec2d7a', color: '#fff' }} onClick={() => this.setColor('#ec2d7a', '藏花红')}>藏花红</Menu.Item>
                <Menu.Item style={{ backgroundColor: '#cc163a', color: '#fff' }} onClick={() => this.setColor('#cc163a', '尖晶红玉')}>尖晶红玉</Menu.Item>
                <Menu.Item style={{ backgroundColor: '#8076a3', color: '#fff' }} onClick={() => this.setColor('#8076a3', '藤萝紫')}>藤萝紫</Menu.Item>
                <Menu.Item style={{ backgroundColor: '#11659a', color: '#fff' }} onClick={() => this.setColor('#11659a', '搪瓷蓝')}>搪瓷蓝</Menu.Item>
                <Menu.Item style={{ backgroundColor: '#55bb8a', color: '#fff' }} onClick={() => this.setColor('#55bb8a', '麦苗绿')}>麦苗绿</Menu.Item>
            </Menu>
        );

        return (
            <div className="barrage-container" style={{ height: window.innerHeight }}>
                <div className="tool-tip">
                    <Dropdown trigger={<button className="tip-btn" style={{ backgroundColor: color, color: 'white' }}>{colorLabel}</button>} triggerType={["click"]} afterOpen={() => console.log('after open')}>
                        {menu}
                    </Dropdown>
                </div>
                <BarrageTopbar name={name} setName={this.setName} />
                <BarrageList barrageList={barrageList} />
                <BarrageInput onChange={this.setMessage} onSend={this.sendMessage} message={message} />
            </div>
        );
    }
}

export default Screen;
