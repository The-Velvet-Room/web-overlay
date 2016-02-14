import { combineReducers } from 'redux';
import * as actions from './actions';
import objectAssign = require('object-assign');

function commentators(state = '', action) {
    if (action.type === actions.UPDATE_COMMENTATORS) {
        return objectAssign({}, state, {
            text: action.text
        });
    }
    return state;
}

const app = combineReducers({
    commentators,
});

export default app;