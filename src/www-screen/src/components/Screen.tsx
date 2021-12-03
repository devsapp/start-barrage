import { Component } from 'react';
import WebSocketConnection from './WebSocketConnection';
type Props = {

};
const baseUrl = ''; // 本地调试的时候可以设置
class Screen extends Component<Props, any> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount = () => {

    }

    render() {

        return (
            <div>
                <div style={{ fontSize: '24px', color: 'white', position: 'absolute', left: 0, right: 0, textAlign: 'center', bottom: 60 }}>
                    <div style={{ marginBottom: 12, fontWeight: 'bold' }}>欢迎扫描屏幕下二维码，跟阿里云 Serverless 发弹幕互动</div>
                    <img src="https://img.alicdn.com/imgextra/i4/O1CN01RPyWwn1hVCg03f6Xc_!!6000000004282-2-tps-354-360.png" style={{ width: 240, height: 240 }} />
                </div>
                <WebSocketConnection baseUrl={baseUrl || window.location.host} onData={() => { }} />
            </div>
        );
    }
}

export default Screen;
