import * as actions from '../actions/root';
import admin from './admin';
import overlay from './overlay';
import user from './user';
import StoreData from '../../models/StoreData';
import objectAssign = require('object-assign');

export default function app(state: StoreData = new StoreData(), action) {
  switch (action.type) {
    default:
      return {
        admin: admin(state.admin, action),
        overlay: overlay(state.overlay, action, state),
        users: user(state.users, action),
      }
  }
}
