import { SONGS_FETCH } from '../actions/songs';

const defaultState = {
  loaded: false,
  loading: false,
  data: [],
};

const defaultSong = {
  title: '',
  authors: '',
  copyright: '',
  collection: '',
  transaltion: '',
  lyrics: [],
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case SONGS_FETCH: {
      return {
        ...state,
        loading: action.loading,
        loaded: action.loaded,
        data: action.data.map((datum) => ({
          ...defaultSong,
          ...datum,
        })),
      };
    }
    default: {
      return state;
    }
  }
}
