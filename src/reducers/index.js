import { combineReducers } from 'redux';
import userReducer from './user';
import appReducer from './app';

export default combineReducers({
  user: userReducer,
  app: appReducer,
});
