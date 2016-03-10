import * as actions from '../actions/player';
import objectAssign = require('object-assign');

export default function player(state:any = {}, action) {
  switch (action.type) {
    case actions.UPDATE_LEFT_PLAYER:
      return objectAssign({}, state, {
        leftPlayerId: action.id,
      });
    case actions.UPDATE_RIGHT_PLAYER:
      return objectAssign({}, state, {
        rightPlayerId: action.id,
      });
    case actions.SWAP_PLAYERS:
      const newLeftId = state.rightPlayerId;
      const newRightId = state.leftPlayer;
      return objectAssign({}, state, {
        leftPlayerId: newLeftId,
        rightPlayerId: newRightId,
      });
    default:
      return state;
  }
}