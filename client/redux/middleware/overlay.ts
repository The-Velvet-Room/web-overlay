import * as io from 'socket.io-client';
import * as actions from '../actions'

let socket: SocketIOClient.Socket = null;

export default (store: Redux.Store) => {
    socket = io('/overlay');

    socket.on('update overlay', (data) => {
        store.dispatch(actions.receiveCommentator(data.commentators));
    });

    return next => action => {
        const result = next(action);

        if (action.type === actions.UPDATE_OVERLAY) {
            const commentators = store.getState().commentators.name;
            socket.emit('update overlay', { 'commentators': commentators });
        }

        return result;
    }
}
