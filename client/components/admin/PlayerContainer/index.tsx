import * as React from 'react';
import * as actions from '../../../redux/actions/player';
import { connect } from 'react-redux';
import StateData from '../../../models/StateData';

interface Props extends React.Props<PlayerContainer> {
  leftPlayerId?: string,
  rightPlayerId?: string,
  users?: Object,
  updateLeftPlayer?: () => void,
  updateRightPlayer?: () => void,
}
interface State { }

const mapStateToProps = (state: StateData) => {
  return {
    leftPlayerId: state.admin.players.leftPlayerId,
    rightPlayerId: state.admin.players.rightPlayerId,
    users: state.users,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateLeftPlayer: (id: string) => {
      dispatch(actions.updateLeftPlayer(id));
    },
    updateRightPlayer: (id: string) => {
      dispatch(actions.updateRightPlayer(id));
    }
  };
}

class PlayerContainer extends React.Component<Props, State> {
  handleSelectorChange = (e: React.FormEvent) => {
    const target = (e.target as HTMLSelectElement);
    const callback = target.dataset['callback'];
    this.props[callback](target.options[target.selectedIndex].value)
  }

  public render() {
    const optionsLeft = [];
    const optionsRight = [];
    const users = this.props.users;
    for (const prop in users) {
      if (users.hasOwnProperty(prop)) {
        const user = users[prop];
        const name = `${user.firstName} "${user.gamerTag}" ${user.lastName}`;
        if (user.id === this.props.leftPlayerId) {
          optionsLeft.push(<option key={user.id} value={user.id} selected>{name}</option>);
        } else {
          optionsLeft.push(<option key={user.id} value={user.id}>{name}</option>);
        }
        
        if (user.id === this.props.rightPlayerId) {
          optionsRight.push(<option key={user.id} value={user.id} selected>{name}</option>);
        } else {
          optionsRight.push(<option key={user.id} value={user.id}>{name}</option>);
        }
      }
    }
    
    return (
      <div>
        <label htmlFor="leftPlayer">L Player</label>
        <select 
          name="leftPlayer"
          data-callback="updateLeftPlayer"
          onChange={this.handleSelectorChange}
        >
          {optionsLeft}
        </select>
        <label htmlFor="rightPlayer">R Player</label>
        <select 
          name="rightPlayer"
          data-callback="updateRightPlayer"
          onChange={this.handleSelectorChange}
        >
          {optionsRight}
        </select>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerContainer);
