import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { normalize, schema } from 'normalizr';
import type firebase from 'firebase/app';
import { RecitationDocument, RootState } from '../../types';

export const recitationEntity = new schema.Entity<RecitationDocument>(
  'recitations',
);
export const recitationsEntity = new schema.Array(recitationEntity);

const recitationsAdapter = createEntityAdapter();

export const fetchRecitations = createAsyncThunk<
  any,
  string,
  { extra: { firebase: firebase.app.App } }
>('recitations/fetchRecitations', async (data, { extra: { firebase } }) => {
  const db = firebase.firestore();
  const { docs } = await db.collection('recitations').get();

  return normalize(
    docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    recitationsEntity,
  ).entities;
});

const recitationsSlice = createSlice({
  name: 'recitations',
  initialState: recitationsAdapter.getInitialState({
    status: 'idle',
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRecitations.fulfilled, (state, action) => {
      state.status = 'success';
      recitationsAdapter.upsertMany(state, action.payload.recitations);
    });
    builder.addCase(fetchRecitations.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(fetchRecitations.rejected, (state, action) => {
      state.status = 'fail';
    });
  },
});

export const {
  selectById: selectRecitationById,
  selectIds: selectRecitationIds,
  selectEntities: selectRecitationEntities,
  selectAll: selectAllRecitations,
  selectTotal: selectTotalRecitations,
} = recitationsAdapter.getSelectors<RootState>((state) => state.recitations);

export default recitationsSlice.reducer;
