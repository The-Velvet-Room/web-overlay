export const UPDATE_USERNAME = 'UPDATE_USERNAME';
export function updateUsername (name: string) {
  return { type: UPDATE_USERNAME, name };
}

export const UPDATE_TITLE = 'UPDATE_TITLE';
export function updateTitle (title: string) {
  return { type: UPDATE_TITLE, title };
}

export const UPDATE_GAME = 'UPDATE_GAME';
export function updateGame (game: string) {
  return { type: UPDATE_GAME, game };
}

export const UPDATE_CURRENT_VIEWERS = 'UPDATE_CURRENT_VIEWERS';
export function updateCurrentViewers (count: number) {
  return { type: UPDATE_CURRENT_VIEWERS, count };
}

export const UPDATE_PEAK_VIEWERS = 'UPDATE_PEAK_VIEWERS';
export function updatePeakViewers (count: number) {
  return { type: UPDATE_PEAK_VIEWERS, count };
}

export const UPDATE_FOLLOWERS = 'UPDATE_FOLLOWERS';
export function updateFollowers (count: number) {
  return { type: UPDATE_FOLLOWERS, count };
}

export const UPDATE_LATEST_FOLLOWER = 'UPDATE_LATEST_FOLLOWER';
export function updateLatestFollower (name: string) {
  return { type: UPDATE_LATEST_FOLLOWER, name };
}