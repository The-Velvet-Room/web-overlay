import * as React from 'react';
import * as actions from '../../../redux/actions/tournament';
import { connect } from 'react-redux';
import { TournamentData } from '../../../models/AdminData';
import { CONSTANT_GAMES } from '../../../../public/javascripts/constants/constants';
import Input from '../../utility/Input';
import StoreData from '../../../models/StoreData';
import SelectOption from '../../../models/SelectOption';
import Select from '../../utility/Select';

interface Props extends React.Props<TournamentContainer> {
  data?: TournamentData,
  updateCurrentGame?: (title: string) => void,
  updateTournamentName?: (name: string) => void,
  updateBracketInfo?: (info: string) => void,
}
interface State { }

const mapStateToProps = (state: StoreData) => {
  return {
    data: state.admin.tournament,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateCurrentGame: (title: string) => {
      dispatch(actions.updateCurrentGame(title));
    },
    updateTournamentName: (name: string) => {
      dispatch(actions.updateTournamentName(name));
    },
    updateBracketInfo: (info: string) => {
      dispatch(actions.updateBracketInfo(info));
    },
  };
}

class TournamentContainer extends React.Component<Props, State> {
  handleSelectorChange = (e: React.FormEvent) => {
    // callback is from the 'callback' data attribute of the select element and matches a prop on the component
    const target = (e.target as HTMLSelectElement);
    const callback = target.dataset['callback'];
    const value = (target.options[target.selectedIndex] as HTMLOptionElement).value;
    this.props[callback](value);
  }

  public render() {
    const options = CONSTANT_GAMES.map(game => {
      return new SelectOption(game);
    })

    return (
      <div>
        <Select
          options={options}
          defaultValue={this.props.data.currentGame}
          onChange={this.props.updateCurrentGame}
          label="Left Port"
        />

        <Input
          defaultValue={this.props.data.tournamentName}
          onChange={this.props.updateTournamentName}
          label="Tournament Name"
        />

        <Input
          defaultValue={this.props.data.bracketInfo}
          onChange={this.props.updateBracketInfo}
          label="Bracket Info"
        />

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TournamentContainer);
