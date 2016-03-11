export const UPDATE_LEFT_PORT = 'UPDATE_LEFT_PORT';
export function updateLeftPort (port: string) {
  return { type: UPDATE_LEFT_PORT, port };
}

export const UPDATE_RIGHT_PORT = 'UPDATE_RIGHT_PORT';
export function updateRightPort (port: string) {
  return { type: UPDATE_RIGHT_PORT, port };
}

export const UPDATE_LEFT_CHARACTER = 'UPDATE_LEFT_CHARACTER';
export function updateLeftCharacter (character: string) {
  return { type: UPDATE_LEFT_CHARACTER, character };
}

export const UPDATE_RIGHT_CHARACTER = 'UPDATE_RIGHT_CHARACTER';
export function updateRightCharacter (character: string) {
  return { type: UPDATE_RIGHT_CHARACTER, character };
}

export const UPDATE_LEFT_STATE_KEY = 'UPDATE_LEFT_STATE';
export function updateLeftStateKey (stateKey: string) {
  return { type: UPDATE_LEFT_STATE_KEY, stateKey };
}

export const UPDATE_RIGHT_STATE_KEY = 'UPDATE_RIGHT_STATE';
export function updateRightStateKey (stateKey: string) {
  return { type: UPDATE_RIGHT_STATE_KEY, stateKey };
}