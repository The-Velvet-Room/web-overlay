import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions/player';

interface Props extends React.Props<PlayerContainer> {
  playerData: any,
  index: number,
  updatePlayerName?: (index: number, name: string) => void
}
interface State { name: string }

const mapStateToProps = (state) => {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {
    updatePlayerName: (index: number, name: string) => {

    }
  }
}

class PlayerContainer extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {name: ''};
  }

  componentWillReceiveProps(nextProps: Props) {
    console.log('nextProps' + JSON.stringify(nextProps));
    this.setState({name: nextProps.playerData.name});
  }

  handleInputChange(e: React.FormEvent) {
    const text = (e.target as HTMLInputElement).value;
    this.props.updatePlayerName(this.props.index, text);
    this.setState({name: text});
  }

  public render() {
    return (
      <div>
        <h3>Player {this.props.index + 1}</h3>
        <label htmlFor="playerName">Name</label>
        <input name="playerName" value={this.state.name} onChange={this.handleInputChange.bind(this)} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerContainer);
