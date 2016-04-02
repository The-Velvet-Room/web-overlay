import * as React from 'react';
import { GameDisplay } from '../../../models/OverlayDisplay';

interface Props extends React.Props<GameView> {
  gameData: GameDisplay,
}
interface State {}

export default class GameView extends React.Component<Props, State> {
  public render() {
    const display = [];
    for (const key in this.props.gameData) {
      display.push(<div key={this.props.gameData[key]}>{this.props.gameData[key]}</div>);
    }
    return (
      <div>
      {display}
      </div>
    );
  }
}
