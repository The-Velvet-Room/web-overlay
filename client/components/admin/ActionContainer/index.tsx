import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions/admin';
import './style.scss';

interface Props extends React.Props<ActionContainer> {
    updateOverlay?: () => void,
}
interface State {}

const mapDispatchToProps = (dispatch) => {
  return {
    updateOverlay: () => {
      dispatch(actions.updateOverlay());
    }
  }
}

class ActionContainer extends React.Component<Props, State> {
  public render() {
    return (
      <div className="class1">
        <button className="class2" onClick={this.props.updateOverlay}>Update Overlay</button>
      </div>
    );
  }
}

export default connect(mapDispatchToProps)(ActionContainer);
