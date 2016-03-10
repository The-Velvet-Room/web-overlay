import { combineReducers } from 'redux';
import admin from './admin';
import overlay from './overlay';

const app = combineReducers({
  admin,
  overlay,
});

export default app;