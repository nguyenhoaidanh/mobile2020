import ACTIONS from '../constants/action-types';
const initialState = {
  currentScreent: { icon: null, title: 'BK Attendance' },
  currentRoom: {},
  currentClass: {},
  lastScreent: {},
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
      return {
        ...state,
        lastScreent: state.currentScreent,
        ...action.payload,
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
    default: {
      return state;
    }
  }
};

export default reducer;
