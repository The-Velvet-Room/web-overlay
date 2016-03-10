import { combineReducers } from 'redux';
import commentators from './commentator';
import match from './match';
import players from './player';
import tournament from './tournament';

const admin = combineReducers({
  commentators,
  match,
  players,
  tournament,
});

export default admin;