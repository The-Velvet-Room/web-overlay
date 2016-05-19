import * as actions from '../actions/player';
import { PlayerData } from '../../models/AdminData';
import objectAssign = require('object-assign');

export default function player(state: PlayerData = new PlayerData(), action): PlayerData {
  switch (action.type) {
    case actions.UPDATE_LEFT_PLAYER:
      return objectAssign({}, state, {
        leftPlayer: action.user,
      });
    case actions.UPDATE_RIGHT_PLAYER:
      return objectAssign({}, state, {
        rightPlayer: action.user,
      });
    case actions.SWAP_PLAYERS:
      const newLeftPlayer = state.rightPlayer;
      const newRightPlayer = state.leftPlayer;
      return objectAssign({}, state, {
        leftPlayer: newLeftPlayer,
        rightPlayer: newRightPlayer,
      });
    default:
      return state;
  }
}
