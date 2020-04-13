import {SET_MOBILE_NAV_VISIBILITY} from '../actions/layoutActions'

export default function reducer(state = {
  mobileNavVisibility: false
}, action) {
  switch (action.type) {
    case SET_MOBILE_NAV_VISIBILITY:
      return {
        ...state,
        mobileNavVisibility: action.visibility
      };
    default:
  }
  return state;
}