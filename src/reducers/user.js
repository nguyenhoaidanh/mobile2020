import ACTIONS from '../constants/action-types';
const initialState = {
  loggedIn: false,
  userInfo: {},
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER_INFO: {
      return {
        ...state,
        loggedIn: true,
        userInfo: action.payload.userInfo,
      };
    }
    case ACTIONS.LOGOUT: {
      return {
        ...state,
        loggedIn: false,
        userInfo: {},
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
