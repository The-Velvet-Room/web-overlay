import * as React from 'react';
import { connect } from 'react-redux';
import * as adminActions from '../../../redux/actions/admin';
import * as overlayActions from '../../../redux/actions/overlay';
import * as userActions from '../../../redux/actions/user';
import './style.scss';

interface Props extends React.Props<ActionContainer> {
  updateAdminData?: () => void,
  createOverlayDisplayFromAdminData?: () => void,
  updateOverlayDisplay?: () => void,
  addTestUser?: () => void,
  resetUsers?: () => void,
}
interface State {}

const mapStateToProps = (state) => { 
  return { };
}
const mapDispatchToProps = (dispatch) => {
  return {
    updateAdminData: () => {
      dispatch(adminActions.updateAdminData());
    },
    createOverlayDisplayFromAdminData: () => {
      dispatch(overlayActions.createOverlayDisplayFromAdminData());
    },
    updateOverlayDisplay: () => {
      dispatch(overlayActions.updateOverlayDisplay());
    },
    addTestUser: () => {
      dispatch(userActions.addTestUser());  
    },
    resetUsers: () => {
      dispatch(userActions.resetUsers());  
    },
  };
}

class ActionContainer extends React.Component<Props, State> {
  handleUpdateOverlay = () => {
    this.props.updateAdminData();
    this.props.createOverlayDisplayFromAdminData();
    this.props.updateOverlayDisplay();
  }
  addTestUser = () => {
    this.props.addTestUser();
  }
  
  resetUsers = () => {
    this.props.resetUsers();
  }
  
  public render () {
    return (
      <div className="class1">
        <button className="class2" onClick={this.handleUpdateOverlay}>Update Overlay</button>
        <button className="class2" onClick={this.addTestUser}>add test user</button>
        <button className="class2" onClick={this.resetUsers}>resetUsers</button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionContainer);
