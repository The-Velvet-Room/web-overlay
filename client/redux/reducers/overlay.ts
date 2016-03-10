import * as actions from '../actions/overlay';
import objectAssign = require('object-assign');
import * as data from '../../models/AdminData';
import * as display from '../../models/OverlayDisplay';

function overlayDisplayFromAdminData(data: data.AdminData) {
  display.CommentatorDisplay
}

//const initialData = new OverlayDisplay();

export default function overlay(state:display.OverlayDisplay = new display.OverlayDisplay(), action) {
  switch (action.type) {
    case actions.CREATE_OVERLAY_DISPLAY:
      const newDisplay = overlayDisplayFromAdminData(action.data);
      return objectAssign({}, state, newDisplay);
    default:
      return state;
  }
}