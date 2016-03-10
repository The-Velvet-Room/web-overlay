export const UPDATE_LEFT_PORT = 'UPDATE_LEFT_PORT';
export function updateLeftPort (port: number) {
  return { type: UPDATE_LEFT_PORT, port };
}

export const UPDATE_RIGHT_PORT = 'UPDATE_RIGHT_PORT';
export function updateRightPort (port: number) {
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