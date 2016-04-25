import * as actions from '../actions/user';
import { User } from '../../models/User';
import objectAssign = require('object-assign');

export default function user(state: Object = {}, action) : Object{
  switch (action.type) {
    case actions.SET_USERS:
      return action.users;
    default:
      return state;
  }
}
