import * as React from 'react';
import * as actions from '../../../redux/actions/commentator';
import { connect } from 'react-redux';
import User from '../../../models/User';
import StoreData from '../../../models/StoreData';
import SelectOption from '../../../models/SelectOption';
import Select from '../../utility/Select';

interface Props extends React.Props<CommentatorContainer> {
  leftCommentatorId?: string,
  rightCommentatorId?: string,
  users?: Object,
  updateLeftCommentator?: (name: string) => void,
  updateRightCommentator?: (name: string) => void,
}
interface State { text: string }

const mapStateToProps = (state: StoreData) => {
  return {
    leftCommentatorId: state.admin.commentators.leftCommentatorId,
    rightCommentatorId: state.admin.commentators.rightCommentatorId,
    users: state.users,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateLeftCommentator: (id: string) => {
      dispatch(actions.updateLeftCommentator(id));
    },
    updateRightCommentator: (id: string) => {
      dispatch(actions.updateRightCommentator(id));
    }
  };
}

class CommentatorContainer extends React.Component<Props, State> {
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
          defaultValue={this.props.leftCommentatorId}
          onChange={this.props.updateLeftCommentator}
          label="Left Commentator"
        />

        <Select
          options={options}
          defaultValue={this.props.rightCommentatorId}
          onChange={this.props.updateRightCommentator}
          label="Right Commentator"
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentatorContainer);
