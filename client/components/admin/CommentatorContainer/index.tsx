import * as React from 'react';
import { connect } from 'react-redux';
import User from '../../../models/User';
import StoreData from '../../../models/StoreData';
import * as actions from '../../../redux/actions/commentator';

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
  handleSelectorChange = (e: React.FormEvent) => {
    // callback is from the 'callback' data attribute of the select element and matches a prop on the component
    const target = (e.target as HTMLSelectElement);
    const callback = target.dataset['callback'];
    const value = (target.options[target.selectedIndex] as HTMLOptionElement).value;
    this.props[callback](value);
  }

  public render() {
    const options = [];
    const users = this.props.users;
    for (const key in users) {
      if (users.hasOwnProperty(key)) {
        const user = users[key];
        const name = `${user.firstName} "${user.gamerTag}" ${user.lastName}`;
        options.push(
          <option
            key={user.id}
            value={user.id}
          >
            {name}
          </option>
        );
      }
    }
    
    return (
      <div>
        <label htmlFor="leftCommentator">L Commentator</label>
        <select 
          name="leftCommentator"
          data-callback="updateLeftCommentator"
          defaultValue={this.props.leftCommentatorId}
          onChange={this.handleSelectorChange}
        >
          {options}
        </select>
        <label htmlFor="rightCommentator">R Commentator</label>
        <select 
          name="rightCommentator"
          data-callback="updateRightCommentator"
          defaultValue={this.props.rightCommentatorId}
          onChange={this.handleSelectorChange}
        >
          {options}
        </select>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentatorContainer);
