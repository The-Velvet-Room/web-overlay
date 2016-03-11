import * as actions from '../actions/match';
import { MatchData } from '../../models/AdminData';
import objectAssign = require('object-assign');

export default function match(state: MatchData = new MatchData(), action) {
  switch (action.type) {
    case actions.UPDATE_LEFT_PORT:
      return objectAssign({}, state, {
        leftPort: action.port,
      });
    case actions.UPDATE_RIGHT_PORT:
      return objectAssign({}, state, {
        rightPort: action.port,
      });
    case actions.UPDATE_LEFT_CHARACTER:
      return objectAssign({}, state, {
        leftCharacter: action.character,
      });
    case actions.UPDATE_RIGHT_CHARACTER:
      return objectAssign({}, state, {
        rightCharacter: action.character,
      });
    case actions.UPDATE_LEFT_STATE_KEY:
      return objectAssign({}, state, {
        leftStateKey: action.stateKey,
      });
    case actions.UPDATE_RIGHT_STATE_KEY:
      return objectAssign({}, state, {
        rightStateKey: action.stateKey,
      });
    default:
      return state;
  }
}