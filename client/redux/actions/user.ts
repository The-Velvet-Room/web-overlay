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
export function setUsers (users: Array<User>) {
  return { type: SET_USERS, users };
}