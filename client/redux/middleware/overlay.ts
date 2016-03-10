import * as io from 'socket.io-client';
import * as actions from '../actions/admin'

let socket: SocketIOClient.Socket = null;

export default (store: Redux.Store) => {
    socket = io('/overlay');

    socket.on('update overlay', (data) => {
        // if (data.commentators) {
        //     store.dispatch(actions.updateCommentators(data.commentators));
        // }
        // if (data.players) {
        //     store.dispatch(actions.updatePlayers(data.players));
        // }
    });

    return next => action => {
        const result = next(action);
        
        // switch (action.type) {
        //   case actions.UPDATE_OVERLAY:
        //     store.dispatch(actions.createOverlayDisplay());
        //     break;
        //   case actions.CREATE_OVERLAY_DISPLAY:
            
        // }

        if (action.type === actions.UPDATE_OVERLAY) {
          
            const commentators = store.getState().commentators.text;
            const players = store.getState().players;
            socket.emit('update overlay', {
                commentators,
                players
            });
        }

        return result;
    }
}
