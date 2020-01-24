import { RECITATIONS_FETCH } from '../actions/recitations';

const defaultState = {
  loaded: false,
  loading: false,
  data: [],
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case RECITATIONS_FETCH: {
      return {
        ...state,
        loading: action.loading,
        loaded: action.loaded,
        data: action.data,
      };
    }
    default: {
      return state;
    }
  }
}
