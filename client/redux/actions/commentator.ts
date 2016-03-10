export const UPDATE_LEFT_COMMENTATOR = 'UPDATE_LEFT_COMMENTATOR';
export function updateLeftCommentator (id: string) {
  return { type: UPDATE_LEFT_COMMENTATOR, id };
}

export const UPDATE_RIGHT_COMMENTATOR = 'UPDATE_RIGHT_COMMENTATOR';
export function updateRightCommentator (id: string) {
  return { type: UPDATE_RIGHT_COMMENTATOR, id };
}