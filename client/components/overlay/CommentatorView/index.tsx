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
      if (typeof this.props.commentatorData[key] === 'object') {
        display.push(<div key={this.props.commentatorData[key].id}>{this.props.commentatorData[key].firstName}</div>);
      } else {
        display.push(<div key={this.props.commentatorData[key]}>{this.props.commentatorData[key].toString()}</div>);
      }
    }
    return (
      <div>
      {display}
      </div>
    );
  }
}
