import * as React from 'react';
import { GameDisplay } from '../../../models/OverlayDisplay';

interface Props extends React.Props<GameView> {
  gameData: GameDisplay,
}
interface State {}

export default class GameView extends React.Component<Props, State> {
  public render() {
    return <div></div>;
  }
}
