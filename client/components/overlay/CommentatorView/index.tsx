import * as React from 'react'
import { CommentatorDisplay } from '../../../models/OverlayDisplay'

interface Props extends React.Props<CommentatorView> {
  commentatorData: CommentatorDisplay,
}
interface State { }

export default class CommentatorView extends React.Component<Props, State> {
  public render() {
    const display = [];
    for (const key in this.props.commentatorData) {
      display.push(<div key={this.props.commentatorData[key]}>{this.props.commentatorData[key]}</div>);
    }
    return (
      <div>
      {display}
      </div>
    );
  }
}
