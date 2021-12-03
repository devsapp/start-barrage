import { Component } from 'react';
import { Input, Button, Icon } from '@b-design/ui';
import './index.scss';
type Props = {
    name: string,
    setName: (name: string) => void
};

class BarrageTopBar extends Component<Props, any> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isEdit: false,
            name: props.name
        }
    }

    componentDidMount = () => {

    }

    changeEdit = () => {
        this.setState({
            isEdit: true
        })
    }

    changeName = (name: any) => {
        this.setState({
            name
        });

    }

    resetName = () => {
        const { name } = this.state;
        this.props.setName(name);
        this.setState({
            isEdit: false,
        })
    }

    render() {
        const { isEdit } = this.state;
        const { name } = this.props;
        return (
            <div className="barrage-topbar-container">
                {isEdit ?
                    <div className="edit-container">
                        <Input defaultValue={name} onChange={this.changeName} className="name-input" />
                        <Button onClick={this.resetName} type="primary" size="small" className="name-btn">确定修改</Button>
                    </div> : <div className="edit-container">
                        <div className="name-tag">{name}</div>
                        <Icon type="edit" onClick={this.changeEdit} />
                    </div>}
            </div>
        );
    }
}

export default BarrageTopBar;
