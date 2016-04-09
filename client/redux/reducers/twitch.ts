import * as actions from '../actions/twitch';
import { TwitchData } from '../../models/AdminData';
import objectAssign = require('object-assign');

export default function twitch(state: TwitchData = new TwitchData(), action) {
  switch (action.type) {
    case actions.UPDATE_USERNAME:
      return objectAssign({}, state, {
        username: action.name,
      });
    case actions.UPDATE_TITLE:
      return objectAssign({}, state, {
        title: action.title,
      });
    case actions.UPDATE_GAME:
      return objectAssign({}, state, {
        game: action.game,
      });
    case actions.UPDATE_CURRENT_VIEWERS:
      return objectAssign({}, state, {
        currentViewers: action.count,
      });
    case actions.UPDATE_PEAK_VIEWERS:
      return objectAssign({}, state, {
        peakViewers: action.count,
      });
    case actions.UPDATE_FOLLOWERS:
      return objectAssign({}, state, {
        followers: action.count,
      });
    case actions.UPDATE_LATEST_FOLLOWER:
      return objectAssign({}, state, {
        latestFollower: action.name,
      });
    default:
      return state;
  }
}