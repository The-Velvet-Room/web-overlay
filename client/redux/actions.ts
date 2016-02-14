export const UPDATE_COMMENTATORS = 'UPDATE_COMMENTATORS';
export function updateCommentators(text: string) {
    return { type: UPDATE_COMMENTATORS, text };
}

export const UPDATE_OVERLAY = 'UPDATE_OVERLAY';
export function updateOverlay() {
    return { type: UPDATE_OVERLAY };
}
