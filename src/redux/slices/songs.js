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

    await db.collection('songs').doc(id).set(data);

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
