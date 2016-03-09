import * as React from 'react'
import { connect } from 'react-redux'

interface Props extends React.Props<PlayerView> {
    number: number,
    playerData?: Object,
}
interface State {}

const mapStateToProps = (state) => {
    return { playerData: state.players };
};

class PlayerView extends React.Component<Props, State> {
    public render() {
        if (!this.props.playerData[this.props.number - 1]) {
            return (
                <div></div>
            )
        }
        const player = this.props.playerData[this.props.number - 1];
        return (
        <div>
            {player.name}
        </div>
        )
    }
}

export default connect(mapStateToProps)(PlayerView);
