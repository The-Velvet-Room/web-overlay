import * as actions from '../actions/root';
import * as admin from '../../models/AdminData';
import * as overlay from '../../models/OverlayDisplay';
import StateData from '../../models/StateData';
import objectAssign = require('object-assign');

function overlayDisplayFromAdminData(state:StateData, data: admin.AdminData) {
  const commentators = new overlay.CommentatorDisplay();
  commentators.leftCommentator = state.users[data.commentators.leftCommentatorId];
  commentators.rightCommentator = state.users[data.commentators.rightCommentatorId];
  
  const match = new overlay.MatchDisplay();
  match.leftPort = data.match.leftPort;
  match.rightPort = data.match.rightPort;
  match.leftCharacter = data.match.leftCharacter;
  match.rightCharacter = data.match.rightCharacter;
  
  const players = new overlay.PlayerDisplay();
  players.leftPlayer = state.users[data.players.leftPlayerId];
  players.rightPlayer = state.users[data.players.rightPlayerId];
  
  const tournament = new overlay.TournamentDisplay();
  tournament.bracketInfo = data.tournament.bracketInfo;
  tournament.currentGame = data.tournament.currentGame;
  tournament.tournamentName = data.tournament.tournamentName;
  
  const display = new overlay.OverlayDisplay();
  display.commentators = commentators;
  display.match = match;
  display.players = players;
  display.tournament = tournament;
  
  return display;
}

export default function root(state:StateData = new StateData(), action) {
  switch (action.type) {
    case actions.CREATE_OVERLAY_DISPLAY:
      const newDisplay = overlayDisplayFromAdminData(state, state.admin);
      return objectAssign({}, state, {
        overlay: newDisplay
      });
    case actions.SET_OVERLAY_DISPLAY:
      return objectAssign({}, state, {
        overlay: action.overlay,
      });
    default:
      return state;
  }
}