import ACTIONS from '../constants/action-types';
import AsyncStorage from '@react-native-community/async-storage';
const initialState = {
  loggedIn: false,
  userInfo: {},
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER_INFO: {
      const newUserInfo = { ...state.userInfo, ...action.payload.userInfo };
      AsyncStorage.setItem('@userInfo', JSON.stringify(newUserInfo));
      return {
        ...state,
        loggedIn: true,
        userInfo: newUserInfo,
      };
    }
    case ACTIONS.LOGOUT: {
      return {
        ...state,
        loggedIn: false,
        userInfo: {},
      };
    }
    case ACTIONS.LOGOUT: {
      return {
        ...initialState,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
