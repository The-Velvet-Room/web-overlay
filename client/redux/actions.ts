export const UPDATE_COMMENTATORS = 'UPDATE_COMMENTATORS';
export function updateCommentators(text: string) {
    return { type: UPDATE_COMMENTATORS, text };
}

export const UPDATE_PLAYERS = 'UPDATE_PLAYERS';
export function updatePlayers(playerData: Array<any>) {
    return { type: UPDATE_PLAYERS, playerData };
}

export const UPDATE_PLAYER_NAME = 'UPDATE_PLAYER_NAME';
export function updatePlayerName(index: number, name: string) {
    return { type: UPDATE_PLAYER_NAME, index, name };
}

export const SWAP_PLAYERS = 'SWAP_PLAYERS';
export function swapPlayers(index1: number, index2: number) {
    return { type: SWAP_PLAYERS, index1, index2 };
}

export const UPDATE_OVERLAY = 'UPDATE_OVERLAY';
export function updateOverlay() {
    return { type: UPDATE_OVERLAY };
}
