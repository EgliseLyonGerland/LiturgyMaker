import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { normalize, schema } from 'normalizr';

import { auth, db } from '../../firebase';
import type { LiturgyDocument, RootState } from '../../types';
import { createDefaultLiturgy } from '../../utils/defaults';
import migrate from '../../utils/migrate';

export const liturgyEntity = new schema.Entity<LiturgyDocument>('liturgies');
export const liturgiesEntity = new schema.Array(liturgyEntity);

const liturgiesAdapter = createEntityAdapter<LiturgyDocument>();

export const fetchLiturgy = createAsyncThunk(
  'liturgies/fetchLiturgy',
  async (id: string) => {
    const liturgy = await getDoc(doc(db, 'liturgies', id));

    let data;
    if (liturgy.exists()) {
      data = migrate(liturgy.data() as LiturgyDocument);
    } else {
      data = createDefaultLiturgy(id);
    }

    return normalize<
      any,
      {
        liturgies: Record<string, LiturgyDocument>;
      }
    >({ id, ...data }, liturgyEntity);
  },
);

export const persistLiturgy = createAsyncThunk(
  'liturgies/persistLiturgy',
  async (liturgy: LiturgyDocument) => {
    const { id, ...data } = liturgy;
    data.uid = auth.currentUser?.uid || '';

    await setDoc(doc(db, 'liturgies', `${id}`), data);

    return liturgy;
  },
);

const liturgiesSlice = createSlice({
  name: 'liturgies',
  initialState: liturgiesAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLiturgy.fulfilled, (state, action) => {
      liturgiesAdapter.upsertMany(state, action.payload.entities.liturgies);
    });
    builder.addCase(persistLiturgy.fulfilled, (state, action) => {
      const { id, ...changes } = action.payload;
      liturgiesAdapter.updateOne(state, { id, changes });
    });
  },
});

export const {
  selectById: selectLiturgyById,
  selectIds: selectLiturgyIds,
  selectEntities: selectLiturgyEntities,
  selectAll: selectAllLiturgies,
  selectTotal: selectTotalLiturgies,
} = liturgiesAdapter.getSelectors<RootState>((state) => state.liturgies);

export default liturgiesSlice.reducer;
