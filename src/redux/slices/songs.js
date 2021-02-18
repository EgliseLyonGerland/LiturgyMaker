import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { normalize, schema } from 'normalizr';

const defaultSong = {
  title: '',
  authors: '',
  copyright: '',
  collection: '',
  translation: '',
  number: '',
  lyrics: [],
};

function stringOrNull(value) {
  return `${value || ''}`.trim() || null;
}
function numberOrNull(value) {
  return parseInt(value, 10) || null;
}

function prepare(data) {
  return {
    title: data.title,
    authors: stringOrNull(data.authors),
    copyright: stringOrNull(data.copyright),
    collection: stringOrNull(data.collection),
    translation: stringOrNull(data.translation),
    number: numberOrNull(data.number),
    lyrics: data.lyrics || [],
  };
}

export const songEntity = new schema.Entity('songs');
export const songsEntity = new schema.Array(songEntity);

const songsAdapter = createEntityAdapter();

export const fetchSongs = createAsyncThunk(
  'songs/fetchSongs',
  async (data, { extra: { firebase } }) => {
    const db = firebase.firestore();
    const { docs } = await db.collection('songs').get();

    return normalize(
      docs.map((doc) => ({ id: doc.id, ...defaultSong, ...doc.data() })),
      songsEntity,
    ).entities;
  },
);

export const persistSong = createAsyncThunk(
  'songs/persistSong',
  async (song, { extra: { firebase } }) => {
    const { id, ...data } = song;
    const db = firebase.firestore();

    console.log(prepare(data));
    await db.collection('songs').doc(id).set(prepare(data));

    return song;
  },
);

const songsSlice = createSlice({
  name: 'songs',
  initialState: songsAdapter.getInitialState({
    status: 'idle',
  }),
  reducers: {},
  extraReducers: {
    [fetchSongs.fulfilled]: (state, action) => {
      state.status = 'success';
      songsAdapter.upsertMany(state, action.payload.songs);
    },
    [fetchSongs.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchSongs.rejected]: (state, action) => {
      state.status = 'fail';
    },
    [persistSong.fulfilled]: (state, action) => {
      const { id, ...changes } = action.payload;
      songsAdapter.updateOne(state, { id, changes });
    },
  },
});

export const {
  selectById: selectSongById,
  selectIds: selectSongIds,
  selectEntities: selectSongEntities,
  selectAll: selectAllSongs,
  selectTotal: selectTotalSongs,
} = songsAdapter.getSelectors((state) => state.songs);

export default songsSlice.reducer;
