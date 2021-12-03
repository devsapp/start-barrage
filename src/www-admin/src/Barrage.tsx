import { Component } from 'react';
import axios from 'axios';
import { Input, Button, Select, Table, Dialog } from '@b-design/ui';
import WebSocketConnection from './WebSocketConnection';
import BarrageItem from './BarrageItem';
import './barrage.scss';
const ControllStatus = [{
    label: '无控制',
    value: 0
}, {
    label: '设置过滤字段',
    value: 1
},
{
    label: '设置管理员拦截',
    value: 2
}]
type Props = {

};
const baseUrl = ''; // 本地调试的时候可以设置固定值
axios.defaults.baseURL = '/api';
class Barrage extends Component<Props, any> {
    constructor(props: Props) {
        super(props);
        this.state = {
            barrages: [],
            status: 0,
            filterWords: []
        }
    }

    componentDidMount = async () => {
        await this.getBarragesList();
        await this.getControlStatus();

    }

    getBarragesList = async () => {
        const result: any = await axios.get('/barrage');
        const data = result.data;
        const barrages = Object.keys(data).map((key) => data[key]).filter(item => item.checkStatus === 0);
        this.setState({
            barrages
        })
    }

    getControlStatus = async () => {
        const result: any = await axios.get('/status');

        const data = result.data;
        this.setState({
            status: data.status || 0,
            filterWords: data.filterWords || []
        })

    }
    updateCheckStatus = async (id: any, checkStatus: any) => {
        const result = await axios.put(`/barrage/${id}`, { checkStatus });

        await this.getBarragesList();
    }

    changeControl = (status: any) => {
        this.setState({
            status
        })
    }

    confirmUpdate = async () => {
        Dialog.confirm({
            content: '确认修改配置？',
            onOk: async () => {
                const { status, filterWords } = this.state;
                const result: any = await axios.post('/status', {
                    status,
                    filterWords
                });
                console.log(result)
            }
        })

    }

    setBarrageList = (data: any) => {
        const { barrages } = this.state;
        barrages.push(data);
        this.setState({
            barrages
        })
    }

    renderOption = (value: any, index: any, data: any) => {
        return <div>
            <a href="javascript:void(0)" style={{ marginRight: 10 }} onClick={() => {
                this.updateCheckStatus(value, 1);
            }}>通过</a>
            <a href="javascript:void(0)" style={{ marginRight: 10 }} onClick={() => {
                this.updateCheckStatus(value, 2);
            }}>拒绝</a>
        </div>
    }

    render() {
        const { barrages, status } = this.state;
        return (
            <div className="barrage-list-container" style={{ paddingTop: 60, overflowY: 'auto' }}>
                <WebSocketConnection baseUrl={baseUrl || window.location.host} onData={(data) => this.setBarrageList(data)} />
                <div className="control-container">
                    <span className="control-span">当前控制状态: </span> <Select dataSource={ControllStatus} value={status} onChange={this.changeControl} style={{ marginRight: 20 }} />
                    <Button type="primary" onClick={this.confirmUpdate}>确认修改</Button>
                </div>
               
                <div className="barrage-list">
                    {/* <div style={{ marginBottom: 20 }}>弹幕列表</div> */}
                    {barrages.map((barrage: any) => {
                        return <BarrageItem data={barrage} key={barrage.id} updateCheckStatus={this.updateCheckStatus}/>
                    })}
                    {/* <Table dataSource={barrages} primaryKey="id">
                        <Table.Column title="弹幕编号" dataIndex="id" alignHeader="center" />
                        <Table.Column title="弹幕作者" dataIndex="fromName" alignHeader="center" />
                        <Table.Column title="弹幕内容" dataIndex="message" alignHeader="center" />
                        <Table.Column title="操作" dataIndex="id" cell={this.renderOption} alignHeader="center" />
                    </Table> */}
                </div>
            </div>
        );
    }
}

export default Barrage;
