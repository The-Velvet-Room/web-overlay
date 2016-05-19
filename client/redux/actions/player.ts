import { User } from '../../models/User';

export const UPDATE_LEFT_PLAYER = 'UPDATE_LEFT_PLAYER';
export function updateLeftPlayer (user: User) {
  return { type: UPDATE_LEFT_PLAYER, user };
}

export const UPDATE_RIGHT_PLAYER = 'UPDATE_RIGHT_PLAYER';
export function updateRightPlayer (user: User) {
  return { type: UPDATE_RIGHT_PLAYER, user };
}

export const SWAP_PLAYERS = 'SWAP_PLAYERS';
export function swapPlayers () {
  return { type: SWAP_PLAYERS };
}
