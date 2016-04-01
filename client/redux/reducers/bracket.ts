import * as actions from '../actions/bracket';
import { BracketData } from '../../models/AdminData';
import objectAssign = require('object-assign');

export default function twitch(state: BracketData = new BracketData(), action) {
  switch (action.type) {
    case actions.UPDATE_BRACKET_URL:
      return objectAssign({}, state, {
        url: action.url,
      });
    default:
      return state;
  }
}