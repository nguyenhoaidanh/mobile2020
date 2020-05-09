import ACTIONS from '../constants/action-types';
export function setCurScreent(data) {
  return {
    type: ACTIONS.SET_CUR_SCREENT,
    payload: { ...data },
  };
}
