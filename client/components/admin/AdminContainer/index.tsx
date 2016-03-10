import * as React from 'react';
import { connect } from 'react-redux';
import CommentatorContainer from '../CommentatorContainer';
import MatchContainer from '../MatchContainer';
import ActionContainer from '../ActionContainer';
import TournamentContainer from '../TournamentContainer';
import { updateOverlay } from '../../../redux/actions/admin';

interface Props extends React.Props<Admin> { 
  updateOverlay?: () => void,
}
interface State {}

const mapStateToProps = () => {
  return { };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateOverlay: () => {
      dispatch(updateOverlay());
    }
  }
}

class Admin extends React.Component<Props, State> {
  handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    this.props.updateOverlay();
  }

  render() {
    return (
      <div>
        <div>Admin Page</div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <TournamentContainer />
          <CommentatorContainer />
          <MatchContainer />
          <ActionContainer />
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
