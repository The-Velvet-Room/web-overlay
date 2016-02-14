import * as React from 'react'
import { connect } from 'react-redux'
import { updateCommentators } from '../../redux/actions'

interface Props extends React.Props<CommentatorView> {
    commentator?: string,
}
interface State { text: string }

const mapStateToProps = (state) => {
    return { commentator: state.commentators.name };
}

class CommentatorView extends React.Component<Props, State> {
    public render() {
        return (
            <div>
            {this.props.commentator}
            </div>
        );
    }
}

export default connect(mapStateToProps)(CommentatorView);
