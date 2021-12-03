import { Component } from 'react';
import Message from '../../../components/Message';
import './index.scss';
type Props = {
    barrageList: Array<any>
};

class BarrageList extends Component<Props, any> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount = () => {

    }

    render() {
        const { barrageList } = this.props;
        return (
            <div className="barrage-list-container" style={{ overflowY: 'auto' }}>
                <div className="barrage-list-content">
                    {
                        barrageList.map((barrage) => {
                            return <div key={barrage.id}>
                                <Message message={barrage.message} />
                            </div>
                        })
                    }
                </div>
            </div>
        );
    }
}

export default BarrageList;
