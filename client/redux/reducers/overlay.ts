import * as actions from '../actions/overlay';
import * as display from '../../models/OverlayDisplay';
import { AdminData } from '../../models/AdminData';
import StateData from '../../models/StateData';
import objectAssign = require('object-assign');

export default function overlay(state: display.OverlayDisplay = new display.OverlayDisplay(), action, root: StateData) {
  switch (action.type) {
    case actions.SET_OVERLAY_DISPLAY:
      return objectAssign({}, state, {
        commentators: action.overlay.commentators,
        match: action.overlay.match,
        players: action.overlay.players,
        tournament: action.overlay.tournament,
      });
    case actions.CREATE_OVERLAY_DISPLAY_FROM_ADMIN_DATA:
      return createOverlayDisplayFromAdminData(root, root.admin);
    default:
      return state;
  }
}

function createOverlayDisplayFromAdminData(state: StateData, adminData: AdminData) {
  const commentators = new display.CommentatorDisplay();
  commentators.leftCommentator = state.users[adminData.commentators.leftCommentatorId];
  commentators.rightCommentator = state.users[adminData.commentators.rightCommentatorId];
  
  const match = new display.MatchDisplay();
  match.leftPort = adminData.match.leftPort;
  match.rightPort = adminData.match.rightPort;
  match.leftCharacter = adminData.match.leftCharacter;
  match.rightCharacter = adminData.match.rightCharacter;
  
  const players = new display.PlayerDisplay();
  players.leftPlayer = state.users[adminData.players.leftPlayerId];
  players.rightPlayer = state.users[adminData.players.rightPlayerId];
  
  const tournament = new display.TournamentDisplay();
  tournament.bracketInfo = adminData.tournament.bracketInfo;
  tournament.currentGame = adminData.tournament.currentGame;
  tournament.tournamentName = adminData.tournament.tournamentName;
  
  const newDisplay = new display.OverlayDisplay();
  newDisplay.commentators = commentators;
  newDisplay.match = match;
  newDisplay.players = players;
  newDisplay.tournament = tournament;
  
  return newDisplay;
}