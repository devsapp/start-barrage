import { Component } from 'react';
import { Input, Button } from '@b-design/ui';
import './index.scss';
type Props = {
    message: string,
    onChange: (message: any) => void;
    onSend: () => void;
};

class BarrageInput extends Component<Props, any> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount = () => {

    }

    render() {
        const { onChange, onSend, message } = this.props;
        return (
            <div className="barrage-input-container">
                <Input className="barrage-input" onChange={(message) => onChange(message)} value={message} maxLength={120} showLimitHint cutString /> <Button className="barrage-btn" type="primary" onClick={onSend}>输入</Button>
            </div>
        );
    }
}

export default BarrageInput;
