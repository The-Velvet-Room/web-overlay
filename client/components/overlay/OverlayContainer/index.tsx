import * as React from 'react'
import { connect } from 'react-redux'
import CommentatorView from '../CommentatorView'
import PlayerView from '../PlayerView'

interface Props extends React.Props<OverlayContainer> {}
interface State {}

class OverlayContainer extends React.Component<Props, State> {
  public render() {
    return (
    <div>
      <div>Web overlay</div>
      <CommentatorView />
      <PlayerView number={1} />
      <PlayerView number={2} />
    </div>
    )
  }
}

export default connect()(OverlayContainer)