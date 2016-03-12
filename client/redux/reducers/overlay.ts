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
  const commentator = new display.CommentatorDisplay();
  commentator.leftCommentator = state.users[adminData.commentators.leftCommentatorId];
  commentator.rightCommentator = state.users[adminData.commentators.rightCommentatorId];
  commentator.tournamentName = adminData.tournament.tournamentName;
  
  const game = new display.GameDisplay();
  game.leftPort = adminData.match.leftPort;
  game.rightPort = adminData.match.rightPort;
  game.leftCharacter = adminData.match.leftCharacter;
  game.rightCharacter = adminData.match.rightCharacter;
  game.leftPlayer = state.users[adminData.players.leftPlayerId];
  game.rightPlayer = state.users[adminData.players.rightPlayerId];
  game.leftStateKey = adminData.match.leftStateKey;
  game.rightStateKey = adminData.match.rightStateKey;
  
  game.bracketInfo = adminData.tournament.bracketInfo;
  game.currentGame = adminData.tournament.currentGame;
  game.tournamentName = adminData.tournament.tournamentName;
  
  const players = new display.IdleDisplay();
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