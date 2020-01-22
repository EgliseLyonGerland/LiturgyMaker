import { SONGS_FETCH } from '../actions/songs';

const defaultState = {
  loaded: false,
  loading: false,
  data: [],
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case SONGS_FETCH: {
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
