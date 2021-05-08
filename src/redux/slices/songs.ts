import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { normalize, schema } from 'normalizr';
import type firebase from 'firebase/app';
import { SongDocument, RootState } from '../../types';

const defaultSong: SongDocument = {
  id: '',
  title: '',
  aka: '',
  authors: '',
  copyright: '',
  collection: '',
  translation: '',
  number: '',
  lyrics: [],
};

export const songEntity = new schema.Entity('songs');
export const songsEntity = new schema.Array(songEntity);

const songsAdapter = createEntityAdapter<SongDocument>();

export const fetchSongs = createAsyncThunk<
  any,
  string,
  { extra: { firebase: firebase.app.App } }
>('songs/fetchSongs', async (data, { extra: { firebase } }) => {
  const db = firebase.firestore();
  const { docs } = await db.collection('songs').get();

  return normalize(
    docs.map((doc) => ({ ...defaultSong, id: doc.id, ...doc.data() })),
    songsEntity,
  ).entities;
});

export const persistSong = createAsyncThunk<
  any,
  SongDocument,
  { extra: { firebase: firebase.app.App } }
>('songs/persistSong', async (song, { extra: { firebase } }) => {
  const { id, ...data } = song;
  const db = firebase.firestore();

  await db.collection('songs').doc(id).set(data);

  return song;
});

const songsSlice = createSlice({
  name: 'songs',
  initialState: songsAdapter.getInitialState({
    status: 'idle',
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSongs.fulfilled, (state, action) => {
      state.status = 'success';
      songsAdapter.upsertMany(state, action.payload.songs);
    });
    builder.addCase(fetchSongs.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(fetchSongs.rejected, (state, action) => {
      state.status = 'fail';
    });
    builder.addCase(persistSong.fulfilled, (state, action) => {
      const { id, ...changes } = action.payload;
      songsAdapter.updateOne(state, { id, changes });
    });
  },
});

export const {
  selectById: selectSongById,
  selectIds: selectSongIds,
  selectEntities: selectSongEntities,
  selectAll: selectAllSongs,
  selectTotal: selectTotalSongs,
} = songsAdapter.getSelectors<RootState>((state) => state.songs);

export default songsSlice.reducer;
