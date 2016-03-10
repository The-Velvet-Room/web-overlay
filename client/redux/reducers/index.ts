import admin from './admin';
import root from './root';
import StateData from '../../models/StateData';

export default function app(state:StateData = new StateData(), action) {
  return {
    admin: admin(state.admin, action),
    root: root(state, action),
  }
}