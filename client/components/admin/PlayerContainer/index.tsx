import * as React from 'react';
import * as actions from '../../../redux/actions/player';
import { connect } from 'react-redux';
import StoreData from '../../../models/StoreData';
import SelectOption from '../../../models/SelectOption';
import Select from '../../utility/Select';
import SearchSelect from '../../utility/SearchSelect';

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
    Object.getOwnPropertyNames(this.props.users).forEach(key => {
      const user = this.props.users[key];
      const name = `${user.firstName} "${user.gamerTag}" ${user.lastName}`;
      options.push(new SelectOption(name, user.id));
    });

    return (
      <div>
        <Select
          options={options}
          defaultValue={this.props.leftPlayerId}
          onChange={this.props.updateLeftPlayer}
          label="Left Player"
        />
        
        <SearchSelect
          onSelect={() => {}}
          url="https://db.t0asterb0t.com/api/v1/players/search.json?query="
          label='Test Player'
          optionFormat='{firstName} "{nickName}" {lastName}'
        />

        <Select
          options={options}
          defaultValue={this.props.rightPlayerId}
          onChange={this.props.updateRightPlayer}
          label="Right Player"
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerContainer);
