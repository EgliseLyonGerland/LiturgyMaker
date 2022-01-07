import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { collection, doc, getDocs, query, setDoc } from 'firebase/firestore';
import { normalize, schema } from 'normalizr';

import { db } from '../../firebase';
import type { SongDocument, RootState } from '../../types';

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

export const fetchSongs = createAsyncThunk('songs/fetchSongs', async () => {
  const { docs } = await getDocs(query(collection(db, 'songs')));

  return normalize<
    any,
    {
      songs: Record<string, SongDocument>;
    }
  >(
    docs.map((item) => ({ ...defaultSong, id: item.id, ...item.data() })),
    songsEntity,
  ).entities;
});

export const persistSong = createAsyncThunk(
  'songs/persistSong',
  async (song: SongDocument) => {
    const { id, ...data } = song;

    await setDoc(doc(db, 'songs', id), data);

    return song;
  },
);

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
    builder.addCase(fetchSongs.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchSongs.rejected, (state) => {
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
