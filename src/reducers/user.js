import ACTIONS from '../constants/action-types';
const initialState = {
  loggedIn: true,
  userInfo: {},
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.TEST: {
      return {
        ...state,
        loggedIn: action.loggedIn,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
