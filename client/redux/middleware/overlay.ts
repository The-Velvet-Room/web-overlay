import * as io from 'socket.io-client';
import * as actions from '../actions/root'

let socket: SocketIOClient.Socket = null;

export default (store: Redux.Store) => {
  const state = store.getState();
  socket = io('/overlay');
  
  socket.on('update overlay', (overlay) => {
    store.dispatch(actions.setOverlayDisplay(overlay));
  });

  return next => action => {
    const result = next(action);
    
    switch (action.type) {
      case actions.UPDATE_OVERLAY:
        const overlay = store.getState().overlay;
        socket.emit('update overlay', {
          overlay,
        });
        break;
      case actions.ADD_TEST_USER:
        socket.emit('add test user', {});
      default:
    }

    return result;
  }
}
