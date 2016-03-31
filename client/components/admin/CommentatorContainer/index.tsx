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
    const optionsLeft = [];
    const optionsRight = [];
    const users = this.props.users;
    for (const prop in users) {
      if (users.hasOwnProperty(prop)) {
        const user = users[prop];
        const name = `${user.firstName} "${user.gamerTag}" ${user.lastName}`;
        if (user.id === this.props.leftCommentatorId) {
          optionsLeft.push(<option key={user.id} value={user.id} selected>{name}</option>);
        } else {
          optionsLeft.push(<option key={user.id} value={user.id}>{name}</option>);
        }
        
        if (user.id === this.props.rightCommentatorId) {
          optionsRight.push(<option key={user.id} value={user.id} selected>{name}</option>);
        } else {
          optionsRight.push(<option key={user.id} value={user.id}>{name}</option>);
        }
      }
    }
    
    return (
      <div>
        <label htmlFor="leftCommentator">L Commentator</label>
        <select 
          name="leftCommentator"
          data-callback="updateLeftCommentator"
          onChange={this.handleSelectorChange}
        >
          {optionsLeft}
        </select>
        <label htmlFor="rightCommentator">R Commentator</label>
        <select 
          name="rightCommentator"
          data-callback="updateRightCommentator"
          onChange={this.handleSelectorChange}
        >
          {optionsRight}
        </select>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentatorContainer);
