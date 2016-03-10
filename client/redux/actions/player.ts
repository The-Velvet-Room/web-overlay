export const UPDATE_LEFT_PLAYER = 'UPDATE_LEFT_PLAYER';
export function updateLeftPlayer (id: string) {
  return { type: UPDATE_LEFT_PLAYER, id };
}

export const UPDATE_RIGHT_PLAYER = 'UPDATE_RIGHT_PLAYER';
export function updateRightPlayer (id: string) {
  return { type: UPDATE_RIGHT_PLAYER, id };
}

export const SWAP_PLAYERS = 'SWAP_PLAYERS';
export function swapPlayers () {
  return { type: SWAP_PLAYERS };
}
