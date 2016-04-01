export const UPDATE_BRACKET_URL = 'UPDATE_BRACKET_URL';
export function updateBracketUrl (url: string) {
  return { type: UPDATE_BRACKET_URL, url };
}