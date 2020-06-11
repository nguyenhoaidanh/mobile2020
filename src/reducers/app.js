import ACTIONS from '../constants/action-types';
const initialState = {
  currentScreent: { icon: null, title: 'BK Attendance', to: '/' },
  currentRoom: {},
  currentClass: {},
  lastScreent: [],
  loading: false,
  listClass: [],
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_LIST_CLASS:
      return {
        ...state,
        listClass: action.payload.listClass,
      };
    case ACTIONS.SET_CUR_SCREENT: {
      const lastScreent = state.lastScreent;
      lastScreent.push(state.currentScreent);
      return {
        ...state,
        lastScreent,
        ...action.payload,
      };
    }
    case ACTIONS.GO_BACK: {
      const cur = state.lastScreent.pop();
      if (cur)
        return {
          ...state,
          lastScreent: state.lastScreent,
          currentScreent: cur,
        };
      return {
        ...state,
      };
    }
    case ACTIONS.SET_CUR_ROOM: {
      return {
        ...state,
        currentRoom: { ...state.currentRoom, ...action.payload.currentRoom },
      };
    }
    case ACTIONS.SET_CUR_CLASS: {
      return {
        ...state,
        currentClass: { ...state.currentClass, ...action.payload.currentClass },
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
