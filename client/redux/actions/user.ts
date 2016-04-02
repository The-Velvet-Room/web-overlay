import User from '../../models/User';

// REMOVE 
export const ADD_TEST_USER = 'ADD_TEST_USER';
export function addTestUser () {
  return { type: ADD_TEST_USER };
}

// REMOVE 
export const RESET_USERS = 'RESET_USERS';
export function resetUsers () {
  return { type: RESET_USERS };
}

export const SET_USERS = 'SET_USERS';
export function setUsers (users: Object) {
  return { type: SET_USERS, users };
}

export const ADD_OR_UPDATE_USER = 'ADD_OR_UPDATE_USER';
export function addOrUpdateUser (user: User) {
  return { type: ADD_OR_UPDATE_USER, user};
}