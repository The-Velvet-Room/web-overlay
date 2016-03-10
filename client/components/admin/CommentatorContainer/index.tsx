import * as React from 'react';
import { connect } from 'react-redux';
import User from '../../../models/User';
import StateData from '../../../models/StateData';
import * as actions from '../../../redux/actions/commentator';

interface Props extends React.Props<CommentatorContainer> {
  leftCommentatorId?: string,
  rightCommentatorId?: string,
  updateLeftCommentator?: (name: string) => void,
  updateRightCommentator?: (name: string) => void,
}
interface State { text: string }

const mapStateToProps = (state: StateData) => {
  return {
    leftCommentatorId: state.admin.commentators.leftCommentatorId,
    rightCommentatorId: state.admin.commentators.rightCommentatorId,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateLeftCommentator: (name: string) => {
      dispatch(actions.updateLeftCommentator(name));
    },
    updateRightCommentator: (name: string) => {
      dispatch(actions.updateRightCommentator(name));
    }
  };
}

class CommentatorContainer extends React.Component<Props, State> {
  componentWillReceiveProps (nextProps: Props) {
    this.setState({text: nextProps});
  }
  
  handleInputChange = (e: React.FormEvent) => {
    const id = (e.target as HTMLSelectElement).value;
    e.target.
    this.props.updateCommentator(text);
    this.setState({text: text});
  }

  public render() {
    return (
      <div>
        <label htmlFor="leftCommentator">Commentators</label>
        <select name="leftCommentator" value={this.props.leftCommentatorId} onChange={this.handleInputChange} />
        <label htmlFor="rightCommentator">Commentators</label>
        <select name="rightCommentator" value={this.props.rightCommentatorId} onChange={this.handleInputChange} />
      </div>
    );
  }
}

export default connect(mapDispatchToProps)(CommentatorContainer);
