import { AdminData } from '../../models/AdminData';
import * as actions from '../actions/admin';
import commentators from './commentator';
import match from './match';
import players from './player';
import tournament from './tournament';
import objectAssign = require('object-assign');

export default function admin(state: AdminData = new AdminData(), action) : AdminData {
  switch (action.type) {
    case actions.SET_ADMIN_DATA:
      return objectAssign({}, state, {
        commentators: action.adminData.commentators,
        match: action.adminData.match,
        players: action.adminData.players,
        tournament: action.adminData.tournament,
      });
    default:
      return {
        commentators: commentators(state.commentators, action),
        match: match(state.match, action),
        players: players(state.players, action),
        tournament: tournament(state.tournament, action),
      }
  }
}
