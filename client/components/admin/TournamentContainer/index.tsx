import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions/tournament';

interface Props extends React.Props<TournamentContainer> {
  currentGame?: string,
  tournamentName?: string,
  bracketInfo?: string,
}
interface State {}

export default class TournamentContainer extends React.Component<Props, State> {
  handleInputChange = (e: React.FormEvent) => {
    const text = (e.target as HTMLInputElement).value;

    this.setState({text: text});
  }

  public render () {
    return (
      <div>
        <label htmlFor="currentGame">Commentators</label>
        <input name="commentators" value={this.props.tournamentName} onChange={this.handleInputChange} />
      </div>
    );
  }
}
