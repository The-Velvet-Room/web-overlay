import * as React from 'react'

interface Props extends React.Props<CommentatorView> {

}
interface State { text: string }

export default class CommentatorView extends React.Component<Props, State> {
  public render() {
    return (
      <div>
      commentators
      </div>
    );
  }
}
