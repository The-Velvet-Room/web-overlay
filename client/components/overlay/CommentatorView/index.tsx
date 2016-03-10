import * as React from 'react'
import { connect } from 'react-redux'

interface Props extends React.Props<CommentatorView> {
  commentators?: string,
}
interface State { text: string }

const mapStateToProps = (state) => {
  return { commentators: state.commentators.text };
}

class CommentatorView extends React.Component<Props, State> {
  public render() {
    return (
      <div>
      {this.props.commentators}
      </div>
    );
  }
}

export default connect(mapStateToProps)(CommentatorView);
