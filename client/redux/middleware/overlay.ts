import * as io from 'socket.io-client';
import * as adminActions from '../actions/admin';
import * as overlayActions from '../actions/overlay';
import * as userActions from '../actions/user';
import { AdminData } from '../../models/AdminData';
import { User } from '../../../client/models/User';
import StoreData from '../../models/StoreData';
import objectAssign = require('object-assign');

let overlaySocket: SocketIOClient.Socket = null;
let adminSocket: SocketIOClient.Socket = null;
let userSocket: SocketIOClient.Socket = null;

export default (store: Redux.Store) => {
  overlaySocket = io('/overlay');
  adminSocket = io('/admin');
  userSocket = io('/user');

  adminSocket.on('refresh admin', (adminData) => {
    store.dispatch(adminActions.setAdminData(adminData));
  });

  overlaySocket.on('refresh overlay', (overlay) => {
    store.dispatch(overlayActions.setOverlayDisplay(overlay));
  });

  userSocket.on('refresh users', (users) => {
    store.dispatch(userActions.setUsers(users));
  });

  return next => action => {
    const result = next(action);

    switch (action.type) {
      case adminActions.UPDATE_ADMIN_DATA:
        adminSocket.emit('update admin', store.getState().admin);
        break;

      case overlayActions.UPDATE_OVERLAY_DISPLAY:
        overlaySocket.emit('update overlay', store.getState().overlay)
        break;

      case userActions.RESET_USERS:
        userSocket.emit('reset users');
        break;

      case userActions.ADD_OR_UPDATE_USER:
        userSocket.emit('update user', action.user);
      default:
    }

    return result;
  }
}
