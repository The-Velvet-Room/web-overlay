import * as actions from '../actions/commentator';
import objectAssign = require('object-assign');

export default function commentator(state:any = {}, action) {
  switch (action.type) {
    case actions.UPDATE_LEFT_COMMENTATOR:
      return objectAssign({}, state, {
        leftCommentatorId: action.id,
      });
    case actions.UPDATE_RIGHT_COMMENTATOR:
      return objectAssign({}, state, {
        rightCommentatorId: action.id,
      });
    default:
      return state;
  }
}