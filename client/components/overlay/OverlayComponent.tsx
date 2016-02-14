import * as React from 'react'
import CommentatorView from './CommentatorView'

interface Props extends React.Props<App> {}
interface State {}

export default class App extends React.Component<Props, State> {
    public render() {
        return (
        <div>
            <div>Web overlay</div>
            <CommentatorView />
        </div>
        )
    }
}