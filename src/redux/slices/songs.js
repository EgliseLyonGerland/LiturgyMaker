import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const defaultSong = {
  title: '',
  authors: '',
  copyright: '',
  collection: '',
  transaltion: '',
  lyrics: [],
};

export const fetchSongs = createAsyncThunk(
  'songs/fetchSongs',
  async (userId, { extra: { firebase } }, b, c) => {
    const db = firebase.firestore();
    const { docs } = await db.collection(`songs`).get();

    return docs.map((doc) => ({ id: doc.id, ...defaultSong, ...doc.data() }));
  },
);

const songsSlice = createSlice({
  name: 'songs',
  initialState: {
    entities: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: {
    [fetchSongs.fulfilled]: (state, action) => {
      state.entities = action.payload;
      state.status = 'success';
    },
    [fetchSongs.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchSongs.rejected]: (state, action) => {
      state.status = 'fail';
    },
  },
});

export default songsSlice.reducer;
