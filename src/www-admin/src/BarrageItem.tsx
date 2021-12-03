import { Component } from 'react';
import { Input, Button } from '@b-design/ui';
import './barrage.scss';
type Props = {
    data: any,
    updateCheckStatus: (id: any, status: any) => void;
};


function BarrageItem(props: Props) {
    return (
        <div className="barrage-item-container">
            <div className="barrage-item-top">
                <div className="basic-info">
                    <div className="item"> <span>弹幕编号：</span><span>{props.data.id}</span></div>
                    <div className="item"> <span>弹幕作者：</span><span>{props.data.fromName}</span></div>
                </div>
                <div className="barrage-content">
                    {props.data.message}
                </div>
            </div>
            <div className="barrage-item-bottom">
                <Button type="primary" className="btn" onClick={() => props.updateCheckStatus(props.data.id, 1)}>通过</Button>
                <Button className="btn" onClick={() => props.updateCheckStatus(props.data.id, 2)} >拒绝</Button>
            </div>
        </div>
    );
}

export default BarrageItem;

