import * as React from 'react'
import { CommentatorDisplay } from '../../../models/OverlayDisplay'

interface Props extends React.Props<CommentatorView> {
  commentatorData: CommentatorDisplay,
}
interface State { }

export default class CommentatorView extends React.Component<Props, State> {
  public render() {
    return (
      <div>
      commentators
      </div>
    );
  }
}
