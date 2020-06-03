import ACTIONS from '../constants/action-types';
export function setCurScreent(data) {
  return {
    type: ACTIONS.SET_CUR_SCREENT,
    payload: { ...data },
  };
}
export function setUserInfo(data) {
  return {
    type: ACTIONS.SET_USER_INFO,
    payload: { ...data },
  };
}
export function setListClass(data) {
  return {
    type: ACTIONS.SET_LIST_CLASS,
    payload: { ...data },
  };
}
export function setCurRoom(data) {
  return {
    type: ACTIONS.SET_CUR_ROOM,
    payload: { ...data },
  };
}
export function logout() {
  return {
    type: ACTIONS.LOGOUT,
  };
}
