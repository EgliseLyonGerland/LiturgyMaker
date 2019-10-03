import {
  LITURGIES_FETCH,
  LITURGIES_PERSISTING,
  LITURGIES_PERSISTED,
  LITURGIES_SET,
} from '../actions/liturgies';

const defaultState = {};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case LITURGIES_FETCH: {
      return {
        ...state,
        [action.id]: {
          id: action.id,
          persisted: true,
          persisting: false,
          loading: action.loading,
          data: action.data,
        },
      };
    }
    case LITURGIES_SET: {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          persisted: false,
          persisting: false,
          data: action.data,
        },
      };
    }
    case LITURGIES_PERSISTED: {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          persisted: true,
          persisting: false,
        },
      };
    }
    case LITURGIES_PERSISTING: {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          persisted: false,
          persisting: true,
        },
      };
    }
    default: {
      return state;
    }
  }
}
