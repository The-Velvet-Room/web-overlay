import * as React from 'react';
import * as actions from '../../../redux/actions/twitch';
import { connect } from 'react-redux';
import { TwitchData } from '../../../models/AdminData';
import { CONSTANT_GAMES } from '../../../../public/javascripts/constants/constants';
import StoreData from '../../../models/StoreData';

interface Props extends React.Props<TwitchContainer> {
  data?: TwitchData,
  updateUsername?: (name: string) => void,
  updateTitle?: (title: string) => void,
  updateGame?: (game: string) => void,
  updateCurrentViewers?: (count: number) => void,
  updatePeakViewers?: (count: number) => void,
  updateFollowers?: (count: number) => void,
  updateLatestFollower?: (name: string) => void,
}
interface State { }

const mapStateToProps = (state: StoreData) => {
  return {
    data: state.admin.twitch,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUsername: (name: string) => {
      dispatch(actions.updateUsername(name));
    },
    updateTitle: (title: string) => {
      dispatch(actions.updateTitle(name));
    },
    updateGame: (game: string) => {
      dispatch(actions.updateGame(name));
    },
    updateCurrentViewers: (count: number) => {
      dispatch(actions.updateCurrentViewers(count));
    },
    updatePeakViewers: (count: number) => {
      dispatch(actions.updatePeakViewers(count));
    },
    updateFollowers: (count: number) => {
      dispatch(actions.updateFollowers(count));
    },
    updateLatestFollower: (name: string) => {
      dispatch(actions.updateLatestFollower(name));
    },
  };
}

class TwitchContainer extends React.Component<Props, State> {
  handleInputChange = (e: React.FormEvent) => {
    // callback is from the 'callback' data attribute of the input element and matches a prop on the component
    const target = (e.target as HTMLInputElement);
    const callback = target.dataset['callback'];
    this.props[callback](target.value);
  }

  public render() {
    return (
      <div>
        <label htmlFor="tournamentName">Tournament Name</label>
        <input 
          name="tournamentName"
          data-callback="updateTournamentName"
          value={this.props.data.tournamentName}
          onChange={this.handleInputChange}
        >
        </input>
        
        <label htmlFor="tournamentName">Tournament Name</label>
        <input 
          name="tournamentName"
          data-callback="updateTournamentName"
          value={this.props.data.tournamentName}
          onChange={this.handleInputChange}
        >
        </input>
        
        <label htmlFor="tournamentName">Tournament Name</label>
        <input 
          name="tournamentName"
          data-callback="updateTournamentName"
          value={this.props.data.tournamentName}
          onChange={this.handleInputChange}
        >
        </input>
        
        <label htmlFor="tournamentName">Tournament Name</label>
        <input 
          name="tournamentName"
          data-callback="updateTournamentName"
          value={this.props.data.tournamentName}
          onChange={this.handleInputChange}
        >
        </input>
        
        <label htmlFor="tournamentName">Tournament Name</label>
        <input 
          name="tournamentName"
          data-callback="updateTournamentName"
          value={this.props.data.tournamentName}
          onChange={this.handleInputChange}
        >
        </input>
        
        <label htmlFor="tournamentName">Tournament Name</label>
        <input 
          name="tournamentName"
          data-callback="updateTournamentName"
          value={this.props.data.tournamentName}
          onChange={this.handleInputChange}
        >
        </input>
        
        <label htmlFor="tournamentName">Tournament Name</label>
        <input 
          name="tournamentName"
          data-callback="updateTournamentName"
          value={this.props.data.tournamentName}
          onChange={this.handleInputChange}
        >
        </input>
        <p>
        <input type="submit"/>
        </p>
        <button id="twitch-log-out">Log Out</button>
        <button id="twitch-reset">Reset Peak Viewers</button>
        <button id="twitch-process-followers">Process Follower Queue</button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TwitchContainer);
