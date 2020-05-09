import { combineReducers } from 'redux';
import userReducer from './user';
import teacherReducer from './teacher';
import appReducer from './app';

export default combineReducers({
  user: userReducer,
  teacher: teacherReducer,
  app: appReducer,
});
