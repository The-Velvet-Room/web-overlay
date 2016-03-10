import { AdminData } from '../../models/AdminData';

export const CREATE_OVERLAY_DISPLAY = 'CREATE_OVERLAY_DISPLAY';
export function createOverlayDisplay (data: AdminData) {
  return { type: CREATE_OVERLAY_DISPLAY, data };
}