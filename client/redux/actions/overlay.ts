import { OverlayDisplay } from '../../models/OverlayDisplay';

export const UPDATE_OVERLAY_DISPLAY = 'UPDATE_OVERLAY_DISPLAY';
export function updateOverlayDisplay () {
  return { type: UPDATE_OVERLAY_DISPLAY };
}

export const SET_OVERLAY_DISPLAY = 'SET_OVERLAY_DISPLAY';
export function setOverlayDisplay (overlay: OverlayDisplay) {
  return { type: SET_OVERLAY_DISPLAY, overlay };
}

export const CREATE_OVERLAY_DISPLAY_FROM_ADMIN_DATA = 'CREATE_OVERLAY_DISPLAY_FROM_ADMIN_DATA';
export function createOverlayDisplayFromAdminData () {
  return { type: CREATE_OVERLAY_DISPLAY_FROM_ADMIN_DATA };
}