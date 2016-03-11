import { AdminData } from '../../models/AdminData';

export const UPDATE_ADMIN_DATA = 'UPDATE_ADMIN_DATA';
export function updateAdminData () {
  return { type: UPDATE_ADMIN_DATA };
}

export const SET_ADMIN_DATA = 'SET_ADMIN_DATA';
export function setAdminData (adminData: AdminData) {
  return { type: SET_ADMIN_DATA, adminData };
}