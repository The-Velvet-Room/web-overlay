export const UPDATE_CURRENT_GAME = 'UPDATE_CURRENT_GAME';
export function updateCurrentGame (title: string) {
  return { type: UPDATE_CURRENT_GAME, title };
}

export const UPDATE_TOURNAMENT_NAME = 'UPDATE_TOURNAMENT_NAME';
export function updateTournamentName (name: string) {
  return { type: UPDATE_TOURNAMENT_NAME, name };
}

export const UPDATE_BRACKET_INFO = 'UPDATE_BRACKET_INFO';
export function updateBracketInfo (info: string) {
  return { type: UPDATE_BRACKET_INFO, info };
}
