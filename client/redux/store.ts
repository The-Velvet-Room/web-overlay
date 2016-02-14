import { createStore, applyMiddleware } from 'redux';
import app from './reducers';
import overlayMiddleware from './middleware/overlay';

const logger = store => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
}

const store = createStore(app, applyMiddleware(logger, overlayMiddleware));

export default store;