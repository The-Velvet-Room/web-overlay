import * as React from 'react';
import { connect } from 'react-redux';
import * as root from '../../../redux/actions/root';
import './style.scss';

interface Props extends React.Props<ActionContainer> {
    updateOverlay?: () => void,
    addTestUser?: () => void,
}
interface State {}

const mapDispatchToProps = (dispatch) => {
  return {
    updateOverlay: () => {
      dispatch(root.updateOverlay());
    },
    addTestUser: () => {
      dispatch(root.addTestUser());  
    },
  };
}

class ActionContainer extends React.Component<Props, State> {
  addTestUser = () => {
    
  }
  
  public render() {
    return (
      <div className="class1">
        <button className="class2" onClick={this.props.updateOverlay}>Update Overlay</button>
        <button className="class2" onClick={this.addTestUser}>add test user</button>
      </div>
    );
  }
}

export default connect(mapDispatchToProps)(ActionContainer);
