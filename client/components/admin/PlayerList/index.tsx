import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions/player';
// import Player from '../Player';

interface Props extends React.Props<PlayerList> {
  playerList?: Array<Object>,
}
interface State { }

const mapStateToProps = (state) => {
  return { playerList: state.players };
}

class PlayerList extends React.Component<Props, State> {
  public render () {
    let list = this.props.playerList;
    while (list.length < 2) {
      list.push({});
    }
    return (
      <div>
      {list.map((player, index) => {
        return (
          <div key={index} />
        );
      })}
      </div>
    );
  }
}

export default connect(mapStateToProps)(PlayerList);