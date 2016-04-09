import * as React from 'react';
import * as actions from '../../../redux/actions/bracket';
import { connect } from 'react-redux';
import { BracketData } from '../../../models/AdminData';
import StoreData from '../../../models/StoreData';

interface Props extends React.Props<BracketContainer> {
  data?: BracketData,
  updateBracketUrl?: (name: string) => void,
}
interface State { }

const mapStateToProps = (state: StoreData) => {
  return {
    data: state.admin.bracket,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateBracketUrl: (url: string) => {
      dispatch(actions.updateBracketUrl(url));
    },
  };
}

class BracketContainer extends React.Component<Props, State> {
  handleInputChange = (e: React.FormEvent) => {
    // callback is from the 'callback' data attribute of the input element and matches a prop on the component
    const target = (e.target as HTMLInputElement);
    const callback = target.dataset['callback'];
    this.props[callback](target.value);
  }

  public render() {
    return (
      <div>
        <p>
        <input type="submit"/>
        </p>
        <button id="twitch-log-out">Log Out</button>
        <button id="twitch-reset">Reset Peak Viewers</button>
        <button id="twitch-process-followers">Process Follower Queue</button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BracketContainer);
