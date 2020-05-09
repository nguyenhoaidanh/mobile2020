import ACTIONS from '../constants/action-types';
const initialState = {
  currentScreent: { icon: 'home', text: 'Home' },
  lastScreent: null,
  loading: false,
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.TEST:
    case ACTIONS.SET_CUR_SCREENT: {
      return {
        ...state,
        lastScreent: state.currentScreent,
        ...action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
