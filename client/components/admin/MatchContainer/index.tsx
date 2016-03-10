import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions/match';

interface Props extends React.Props<MatchContainer> {
  commentator?: string,
  updateCommentator?: (name: string) => void
}
interface State { text: string }

const mapStateToProps = (state) => {
  return { commentator: 'asd' };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateCommentator: (name: string) => {

    }
  }
}

class MatchContainer extends React.Component<Props, State> {
  constructor (props) {
    super(props);
    this.state = {text: ''};
  }

  componentWillReceiveProps (nextProps: Props) {
    this.setState({text: nextProps.commentator});
  }

  handleInputChange (e: React.FormEvent) {
    const text = (e.target as HTMLInputElement).value;
    this.props.updateCommentator(text);
    this.setState({text: text});
  }

  public render () {
    return (
      <div>
        <label htmlFor="commentators">Commentators</label>
        <input name="commentators" value={this.state.text} onChange={this.handleInputChange.bind(this)} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchContainer);
