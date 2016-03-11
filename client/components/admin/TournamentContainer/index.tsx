import * as React from 'react';
import * as actions from '../../../redux/actions/tournament';
import { connect } from 'react-redux';
import { TournamentData } from '../../../models/AdminData';
import { CONSTANT_GAMES } from '../../../../public/javascripts/constants/constants';
import StateData from '../../../models/StateData';

interface Props extends React.Props<TournamentContainer> {
  data?: TournamentData,
  updateCurrentGame?: (title: string) => void,
  updateTournamentName?: (name: string) => void,
  updateBracketInfo?: (info: string) => void,
}
interface State { }

const mapStateToProps = (state: StateData) => {
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
  
  handleInputChange = (e: React.FormEvent) => {
    // callback is from the 'callback' data attribute of the select element and matches a prop on the component
    const target = (e.target as HTMLInputElement);
    const callback = target.dataset['callback'];
    this.props[callback](target.value);
  }

  public render() {
    return (
      <div>
        <label htmlFor="currentGame">Current Game</label>
        <select 
          name="currentGame"
          data-callback="updateCurrentGame"
          onChange={this.handleSelectorChange}
        >
        {
          CONSTANT_GAMES.map(game => {
            if (game === this.props.data.currentGame) {
              return <option key={game} value={game} selected>{game}</option>;
            }
            
            return <option key={game} value={game}>{game}</option>
          })
        }
        </select>   
          
        <label htmlFor="tournamentName">Tournament Name</label>
        <input 
          name="tournamentName"
          data-callback="updateTournamentName"
          value={this.props.data.tournamentName}
          onChange={this.handleInputChange}
        >
        </input>
        
        <label htmlFor="bracketInfo">BracketInfo</label>
        <input 
          name="bracketInfo"
          data-callback="updateBracketInfo"
          value={this.props.data.bracketInfo}
          onChange={this.handleInputChange}
        >
        </input>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TournamentContainer);
