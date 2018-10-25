import { SET_QUERY_STRING } from '../types';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_QUERY_STRING:
      return { ...state, currentQueryString: action.payload };
    default:
      return state;
  }
};
