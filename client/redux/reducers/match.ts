import * as actions from '../actions/match';
import objectAssign = require('object-assign');

export default function match(state:any = {}, action) {
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
    default:
      return state;
  }
}