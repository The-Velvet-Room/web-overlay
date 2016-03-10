import * as React from 'react';
import { connect } from 'react-redux';
import CommentatorContainer from '../CommentatorContainer';
import MatchContainer from '../MatchContainer';
import ActionContainer from '../ActionContainer';
import TournamentContainer from '../TournamentContainer';

interface Props extends React.Props<AdminContainer> { }
interface State { }

export default class AdminContainer extends React.Component<Props, State> {
  render () {
    return (
      <div className="admin-container">
        <div>Admin Page</div>
        <TournamentContainer />
        <CommentatorContainer />
        <MatchContainer />
        <ActionContainer />
      </div>
    );
  }
}