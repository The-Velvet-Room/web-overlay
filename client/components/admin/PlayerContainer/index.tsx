import * as React from 'react';
import * as actions from '../../../redux/actions/player';
import { connect } from 'react-redux';
import StoreData from '../../../models/StoreData';
import SelectOption from '../../../models/SelectOption';
import Select from '../../utility/Select';
import SearchSelect from '../../utility/SearchSelect';
import { User, DbUser } from '../../../models/User';

interface Props extends React.Props<PlayerContainer> {
  leftPlayer?: User,
  rightPlayer?: User,
  updateLeftPlayer?: () => void,
  updateRightPlayer?: () => void,
}
interface State { }

const mapStateToProps = (state: StoreData) => {
  return {
    leftPlayer: state.admin.players.leftPlayer,
    rightPlayer: state.admin.players.rightPlayer,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateLeftPlayer: (user: DbUser) => {
      dispatch(actions.updateLeftPlayer(new User(user)));
    },
    updateRightPlayer: (user: DbUser) => {
      dispatch(actions.updateRightPlayer(new User(user)));
    }
  };
}

class PlayerContainer extends React.Component<Props, State> {
  public render() {
    return (
      <div>
        <SearchSelect
          onSelect={this.props.updateLeftPlayer}
          defaultValue={this.props.leftPlayer}
          url="https://db.thevelvetroom.tv/api/v1/players/search?query="
          label='Left Player'
          optionFormat='{FirstName} "{Nickname}" {LastName}'
        />

        <SearchSelect
          onSelect={this.props.updateRightPlayer}
          defaultValue={this.props.rightPlayer}
          url="https://db.thevelvetroom.tv/api/v1/players/search?query="
          label='Right Player'
          optionFormat='{FirstName} "{Nickname}" {LastName}'
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerContainer);
