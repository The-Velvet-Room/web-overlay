import * as actions from '../actions/overlay';
import { OverlayDisplay, CommentatorDisplay, GameDisplay, IdleDisplay, ITournamentData } from '../../models/OverlayDisplay';
import { AdminData } from '../../models/AdminData';
import StateData from '../../models/StateData';
import objectAssign = require('object-assign');

export default function overlay(state: OverlayDisplay = new OverlayDisplay(), action, root: StateData) : OverlayDisplay {
  switch (action.type) {
    case actions.SET_OVERLAY_DISPLAY:
      return objectAssign(new OverlayDisplay(), state, {
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

function createOverlayDisplayFromAdminData(state: StateData, adminData: AdminData) : OverlayDisplay {
  const commentator = new CommentatorDisplay();
  commentator.leftCommentator = state.users[adminData.commentators.leftCommentatorId];
  commentator.rightCommentator = state.users[adminData.commentators.rightCommentatorId];
  commentator.tournamentName = adminData.tournament.tournamentName;

  const game = new GameDisplay();
  game.leftPort = adminData.match.leftPort;
  game.rightPort = adminData.match.rightPort;
  game.leftCharacter = adminData.match.leftCharacter;
  game.rightCharacter = adminData.match.rightCharacter;
  game.leftPlayer = state.users[adminData.players.leftPlayerId];
  game.rightPlayer = state.users[adminData.players.rightPlayerId];
  game.leftStateKey = adminData.match.leftStateKey;
  game.rightStateKey = adminData.match.rightStateKey;

  const idle = new IdleDisplay();

  const newDisplay = new OverlayDisplay();
  newDisplay.commentator = commentator;
  newDisplay.game = game;
  newDisplay.idle = idle;

  resolveInterfaces(newDisplay, adminData);
  return newDisplay;
}

function resolveInterfaces(display: OverlayDisplay, adminData: AdminData) {
  Object.getOwnPropertyNames(display).forEach(key => {
    const theProp = display[key];
      if (theProp.ITournamentData) {
        theProp.bracketInfo = adminData.tournament.bracketInfo;
        theProp.currentGame = adminData.tournament.currentGame;
        theProp.tournamentName = adminData.tournament.tournamentName;
      }
  })
}
