import * as React from 'react'
import { connect } from 'react-redux'
import { OverlayDisplay } from '../../../models/OverlayDisplay';
import StateData from '../../../models/StateData';
import CommentatorView from '../CommentatorView'
import PlayerView from '../PlayerView'

interface Props extends React.Props<OverlayContainer> {
  data: OverlayDisplay,
}
interface State {}

const mapStateToProps = (state: StateData) => {
  return {
    data: state.overlay,
  };
}

const mapDispatchToProps = (dispatch) => {
  return { };
}

class OverlayContainer extends React.Component<Props, State> {
  public render () {
    return (
    <div>
      <div>Web overlay</div>
      <CommentatorView />
    </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverlayContainer)