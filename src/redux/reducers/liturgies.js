import {
  LITURGIES_FETCH,
  LITURGIES_PERSISTING,
  LITURGIES_PERSISTED,
  LITURGIES_SET,
  LITURGIES_ADD_BLOCK,
  LITURGIES_REMOVE_BLOCK,
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
    case LITURGIES_ADD_BLOCK: {
      const liturgy = state[action.id];
      liturgy.data.blocks.splice(action.position, 0, action.data);

      return {
        ...state,
        [action.id]: {
          ...liturgy,
        },
      };
    }
    case LITURGIES_REMOVE_BLOCK: {
      const liturgy = state[action.id];
      liturgy.data.blocks.splice(action.position, 1);

      return {
        ...state,
        [action.id]: {
          ...liturgy,
        },
      };
    }
    default: {
      return state;
    }
  }
}
