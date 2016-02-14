import * as React from 'react'
import { connect } from 'react-redux'
import Commentators from './CommentatorsComponent'
import { updateOverlay } from '../../redux/actions'

interface Props extends React.Props<Admin> { updateOverlay?: () => void }
interface State {}

const mapStateToProps = () => {
    return { };
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateOverlay: () => {
            dispatch(updateOverlay());
        }
    }
}

class Admin extends React.Component<Props, State> {
    handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        this.props.updateOverlay();
    }

    render() {
        return (
            <div>
                <div>Admin Page</div>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <Commentators />
                </form>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
