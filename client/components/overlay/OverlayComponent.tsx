import * as React from 'react'
import CommentatorView from './CommentatorView'
import PlayerView from './PlayerView'

interface Props extends React.Props<Overlay> {}
interface State {}

export default class Overlay extends React.Component<Props, State> {
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
