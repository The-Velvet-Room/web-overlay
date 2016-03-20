import * as actions from '../actions/tournament';
import { TournamentData } from '../../models/AdminData';
import objectAssign = require('object-assign');

export default function tournament(state: TournamentData = new TournamentData(), action) : TournamentData {
  switch (action.type) {
    case actions.UPDATE_CURRENT_GAME:
      return objectAssign({}, state, {
        currentGame: action.title,
      });
    case actions.UPDATE_TOURNAMENT_NAME:
      return objectAssign({}, state, {
        tournamentName: action.name,
      });
    case actions.UPDATE_BRACKET_INFO:
      return objectAssign({}, state, {
        bracketInfo: action.info,
      });
    default:
      return state;
  }
}
