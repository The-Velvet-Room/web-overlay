import * as React from 'react'
import { connect } from 'react-redux'
import { OverlayDisplay } from '../../../models/OverlayDisplay';
import StoreData from '../../../models/StoreData';
import CommentatorView from '../CommentatorView';
import GameView from '../GameView';

interface Props extends React.Props<OverlayContainer> {
  overlayData: OverlayDisplay,
}
interface State {}

const mapStateToProps = (state: StoreData) => {
  return {
    overlayData: state.overlay,
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
      <CommentatorView commentatorData={this.props.overlayData.commentator} />
      <GameView gameData={this.props.overlayData.game} />
    </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverlayContainer)