import * as actions from '../actions/commentator';
import { CommentatorData } from '../../models/AdminData';
import objectAssign = require('object-assign');

export default function commentator(state: CommentatorData = new CommentatorData(), action) {
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