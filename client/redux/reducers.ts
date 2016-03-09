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

function players(state = [], action) {
    if (action.type === actions.UPDATE_PLAYERS) {
        return action.playerData;
    }
    if (action.type === actions.UPDATE_PLAYER_NAME) {
        return state.map((item, index) => {
            if (index === action.index) {
                return objectAssign({}, item, {name: action.name});
            }
            return item;
        });
    }
    if (action.type === actions.SWAP_PLAYERS) {
        const temp = state[action.index1];
        state[action.index1] = state[action.index2];
        state[action.index2] = temp;
        return objectAssign({}, state);
    }
    return state;
}

const app = combineReducers({
    commentators,
    players
});

export default app;