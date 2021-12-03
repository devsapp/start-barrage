import { Component } from 'react';
import * as uuid from 'uuid';
type Props = {
    baseUrl: string,
    onData: () => void
};
const barrageArray: any = [];
let ani: any = null;
// 存储实例
const store: any = {};

const defaultFontSize = 48;
class Barrage {

    context: any;
    params: any;
    opacity: any;
    x: any;
    y: any;
    moveX: any;
    constructor(canvas: any, context: any, obj: any, index: any) {
        let fontSize = obj.fontSize || defaultFontSize;
        this.x = window.innerWidth//canvas.width; // 开始都在边上

        this.y = obj.range[0] * canvas.height + (obj.range[1] - obj.range[0]) * canvas.height * Math.random() + 36;
        if (this.y < fontSize) {
            this.y = fontSize;
        } else if (this.y > canvas.height - fontSize) {
            this.y = canvas.height - fontSize;
        }
        this.moveX = 1 + Math.random() * 3;
        this.context = context;
        this.opacity = 0.8 + 0.2 * Math.random();
        this.params = obj;
    }
    draw() {

        const context = this.context;
        const params = this.params;
        // 根据此时x位置绘制文本
        context.strokeStyle = params.color;
        context.font = 'bold ' + (params.fontSize || defaultFontSize) + 'px "microsoft yahei", sans-serif';
        //context.fillStyle = params.color;
        context.fillStyle = 'rgba(255,255,255,' + this.opacity + ')';
        context.fillText(params.value, this.x, this.y);
        context.strokeText(params.value, this.x, this.y);
    }
}

const canvasBarrage = function (canvas: any) {
    if (!canvas) {
        return;
    }
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;


    // 绘制弹幕文本
    for (let index in store) {
        let i: any = index;
        let barrage = store[index];
        let currentFontSize = barrage.fontSize || defaultFontSize;
        // 位置变化
        barrage.x -= barrage.moveX;
        if (barrage.x < -1 * window.innerWidth * 1) { // 移除后不再变化
            // 移动到画布外部时候从左侧开始继续位移
            barrage.x = (1 + i * 0.1 / Math.random()) * canvas.width;
            barrage.y = (barrage.params.range[0] + (barrage.params.range[1] - barrage.params.range[0]) * Math.random()) * canvas.height;
            if (barrage.y < currentFontSize) {
                barrage.y = currentFontSize;
            } else if (barrage.y > canvas.height - currentFontSize) {
                barrage.y = canvas.height - currentFontSize;
            }
            barrage.moveX = 1 + Math.random() * 3;
        } else {
            // 根据新位置绘制圆圈圈
            barrage.draw();
        }
    }

}
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
        const currentDeviceId = window.localStorage.getItem('s-deviceId');
        this.deviceId = currentDeviceId || uuid.v4().replace(/-/g, '').substr(0, 8);
        window.localStorage.setItem('s-deviceId', this.deviceId);
        const now = new Date();
        this.reg = {
            method: 'GET',
            host: `${props.baseUrl}:8080`,
            querys: {
                'docId': 'devs',
                'type': 'screen',
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
        this.canvas = document.querySelector('#canvasBarrage');

        this.context = this.canvas.getContext('2d');
        this.init();

    }

    init = () => {
        const { baseUrl } = this.props;
        const ishttps = 'https:' == document.location.protocol ? true : false;
        const socketurl = ishttps ? 'wss:' : 'ws:';
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

         // 画布渲染
         const renderCanvas = () => {
            // 清除画布
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // 绘制画布上所有的圆圈圈
            canvasBarrage(this.canvas);
            // 继续渲染
            ani = window.requestAnimationFrame(renderCanvas);
        };

        if (event.data.startsWith('NF#')) {

            const msg = JSON.parse(event.data.substr(3));
            const barrageData = {
                value: msg.from + '说：' + msg.message,
                color: msg.color || 'blue',
                range: [0, 0.5]
            }
            barrageArray.push(barrageData);
            barrageArray.forEach((obj: any, index: any) => {
                if (!store[index]) {
                    store[index] = new Barrage(this.canvas, this.context, obj, index);
                };
            });
            if (ani) {
                window.cancelAnimationFrame(ani);
            }
            renderCanvas();
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
                <canvas id="canvasBarrage" style={{ height: window.innerHeight, width: '100%' }} height={window.innerHeight}></canvas>
            </div>
        );
    }
}

export default WebSocketConnection;
