import { AdminData } from '../../models/AdminData';
import { OverlayDisplay } from '../../models/OverlayDisplay';

export const UPDATE_OVERLAY = 'UPDATE_OVERLAY';
export function updateOverlay () {
  return { type: UPDATE_OVERLAY };
}

export const CREATE_OVERLAY_DISPLAY = 'CREATE_OVERLAY_DISPLAY';
export function createOverlayDisplay () {
  return { type: CREATE_OVERLAY_DISPLAY };
}

export const SET_OVERLAY_DISPLAY = 'SET_OVERLAY_DISPLAY';
export function setOverlayDisplay (overlay: OverlayDisplay) {
  return { type: SET_OVERLAY_DISPLAY, overlay };
}

export const ADD_TEST_USER = 'ADD_TEST_USER';
export function addTestUser () {
  return { type: ADD_TEST_USER };
}