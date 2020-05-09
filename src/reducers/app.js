import { actions } from '../constants/action-types';
const initialState = {
  loggedIn: false,
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.TEST: {
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
