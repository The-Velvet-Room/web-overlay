import * as React from 'react';
import { connect } from 'react-redux';
import CommentatorContainer from '../CommentatorContainer';
import MatchContainer from '../MatchContainer';
import PlayerContainer from '../PlayerContainer';
import ActionContainer from '../ActionContainer';
import TournamentContainer from '../TournamentContainer';
import TabView from '../../utility/TabView';

interface Props extends React.Props<AdminContainer> { }
interface State { }

export default class AdminContainer extends React.Component<Props, State> {
  render () {
    return (
      <div className="admin-container">
        <div>Admin Page</div>
        <TabView names={['main', 'challonge', 'twitch', 'overlay']}>
          <div>
            <TournamentContainer />
            <CommentatorContainer />
            <PlayerContainer />
            <MatchContainer />
            <ActionContainer />
          </div>
          <div>
            challonge
          </div>
          <div>
            twitch
          </div>
          <div>
            overlay
          </div>
        </TabView>
      </div>
    );
  }
}