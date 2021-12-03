import { Component } from 'react';
import * as uuid from 'uuid';
type Props = {
    baseUrl: string,
    onData: (data: any) => void
};
const barrageArray: any = [];
let ani: any = null;
// 存储实例
const store: any = {};



class WebSocketConnection extends Component<Props, any> {
    protected deviceId: string = '';
    protected ws: any;
    protected hbStarted: boolean = false;
    protected registered: boolean = false;
    protected registerResp: boolean = false;
    protected reg: any;
    canvas: any;
    context: any;
    constructor(props: Props) {
        super(props);
        const currentDeviceId = window.localStorage.getItem('s-admin-deviceId');
        this.deviceId = currentDeviceId || uuid.v4().replace(/-/g, '').substr(0, 8);
        window.localStorage.setItem('s-admin-deviceId', this.deviceId);
        const now = new Date();
        this.reg = {
            method: 'GET',
            host: `${props.baseUrl}:8080`,
            querys: {
                'docId': 'devs',
                'type': 'admin',
                'userId': this.deviceId,
            },
            headers: {
                'x-ca-websocket_api_type': ['REGISTER'],
                'x-ca-seq': ['0'],
                'x-ca-nonce': [uuid.v4().toString()],
                'date': [now.toUTCString()],
                'x-ca-timestamp': [now.getTime().toString()],
                'CA_VERSION': ['1'],
            },
            path: '/r',
            body: '',
        };
    }

    componentDidMount = () => {
        this.init();

    }

    init = () => {
        const { baseUrl } = this.props;
        const ishttps = 'https:' == document.location.protocol ? true: false;
        const socketurl = ishttps ? 'wss:':'ws:';
        const socketConnectionUrl = `${socketurl}//${baseUrl}:8080`;
        const ws = new window.WebSocket(socketConnectionUrl);
        this.ws = ws;
        ws.onopen = this.openSocket;
        ws.onmessage = this.onMessage;
        ws.onclose = this.closeSocket;
    }

    openSocket = () => {

        this.ws.send('RG#' + this.deviceId);
    }

    closeSocket = () => {

    }

    onMessage = (event: any) => {
        console.log('data:', event.data);
        if (event.data.startsWith('NF#')) {

            const msg = JSON.parse(event.data.substr(3));
            
            this.props.onData(msg);
            return;
        }

        if (!this.hbStarted && event.data.startsWith('RO#')) {
            console.log('login successfully');
            if (!this.registered) {
                this.registered = true;
                this.ws.send(JSON.stringify(this.reg));
            }

            this.hbStarted = true;
            setInterval(() => {
                this.ws.send('H1');
            }, 15 * 1000);


            return;
        }


    }

    render() {

        return (
            <div>
            </div>
        );
    }
}

export default WebSocketConnection;
