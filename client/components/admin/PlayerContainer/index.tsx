import * as React from 'react';
import * as actions from '../../../redux/actions/player';
import { connect } from 'react-redux';
import StoreData from '../../../models/StoreData';

interface Props extends React.Props<PlayerContainer> {
  leftPlayerId?: string,
  rightPlayerId?: string,
  users?: Object,
  updateLeftPlayer?: () => void,
  updateRightPlayer?: () => void,
}
interface State { }

const mapStateToProps = (state: StoreData) => {
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
    // callback is from the 'callback' data attribute of the select element and matches a prop on the component
    const target = (e.target as HTMLSelectElement);
    const callback = target.dataset['callback'];
    const value = (target.options[target.selectedIndex] as HTMLOptionElement).value;
    this.props[callback](value);
  }

  public render() {
    const options = [];
    const users = this.props.users;
    for (const key in users) {
      if (users.hasOwnProperty(key)) {
        const user = users[key];
        const name = `${user.firstName} "${user.gamerTag}" ${user.lastName}`;
        options.push(
          <option key={user.id} value={user.id}>{name}</option>
        );
      }
    }
    
    return (
      <div>
        <label htmlFor="leftPlayer">L Player</label>
        <select 
          name="leftPlayer"
          data-callback="updateLeftPlayer"
          defaultValue={this.props.leftPlayerId}
          onChange={this.handleSelectorChange}
        >
          {options}
        </select>
        <label htmlFor="rightPlayer">R Player</label>
        <select 
          name="rightPlayer"
          data-callback="updateRightPlayer"
          defaultValue={this.props.rightPlayerId}
          onChange={this.handleSelectorChange}
        >
          {options}
        </select>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerContainer);
