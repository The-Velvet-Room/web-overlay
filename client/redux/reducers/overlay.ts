import * as actions from '../actions/overlay';
import { OverlayDisplay, CommentatorDisplay, GameDisplay, IdleDisplay } from '../../models/OverlayDisplay';
import { AdminData } from '../../models/AdminData';
import StoreData from '../../models/StoreData';
import objectAssign = require('object-assign');

export default function overlay(state: OverlayDisplay = new OverlayDisplay(), action, root: StoreData) {
  switch (action.type) {
    case actions.SET_OVERLAY_DISPLAY:
      return objectAssign({}, state, {
        commentator: action.overlay.commentator,
        game: action.overlay.game,
        idle: action.overlay.idle,
      });
    case actions.CREATE_OVERLAY_DISPLAY_FROM_ADMIN_DATA:
      return createOverlayDisplayFromAdminData(root, root.admin);
    default:
      return state;
  }
}

function createOverlayDisplayFromAdminData(state: StoreData, adminData: AdminData) {
  const commentator = new CommentatorDisplay();
  commentator.leftCommentator = state.users[adminData.commentators.leftCommentatorId];
  commentator.rightCommentator = state.users[adminData.commentators.rightCommentatorId];

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

// TODO: 100% must be a better way to fill in interfaces. This might as well
// not even use typescript. Leaving it for now.
function resolveInterfaces(newDisplay: OverlayDisplay, adminData: AdminData) {
  Object.getOwnPropertyNames(newDisplay).forEach(key => {
    const theProp = newDisplay[key];
      if (theProp.ITournamentData) {
        theProp.bracketInfo = adminData.tournament.bracketInfo;
        theProp.currentGame = adminData.tournament.currentGame;
        theProp.tournamentName = adminData.tournament.tournamentName;
      }
  })
}
