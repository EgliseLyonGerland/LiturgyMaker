import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { normalize, schema } from 'normalizr';
import { format, subDays } from 'date-fns';
import cloneDeep from 'lodash/cloneDeep';
import { createDefaultLiturgy } from '../../utils/defaults';
import migrate from '../../utils/migrate';

export const liturgyEntity = new schema.Entity('liturgies');
export const liturgiesEntity = new schema.Array(liturgyEntity);

const liturgiesAdapter = createEntityAdapter();

export const fetchLiturgy = createAsyncThunk(
  'liturgies/fetchLiturgy',
  async (date, { extra: { firebase } }) => {
    const id = format(date, 'yMMdd');
    const db = firebase.firestore();
    const doc = await db.doc(`liturgies/${id}`).get();

    let data;
    if (doc.exists) {
      data = migrate(doc.data());
    } else {
      data = createDefaultLiturgy({ date });
    }

    return normalize({ id, ...data }, liturgyEntity);
  },
);

export const persistLiturgy = createAsyncThunk(
  'liturgies/persistLiturgy',
  async (liturgy, { extra: { firebase } }) => {
    const { id, ...data } = liturgy;
    const db = firebase.firestore();

    await db.collection('liturgies').doc(id).set(data);

    return liturgy;
  },
);

export const fillBlockFromPreviousWeek = createAsyncThunk(
  'liturgies/fillBlockFromPreviousWeek',
  async ({ id, block: currentBlock }, { dispatch, getState }) => {
    const currentLiturgy = cloneDeep(selectLiturgyById(getState(), id));
    const currentDate = currentLiturgy.date;
    const previousDate = subDays(currentDate, 7);

    await dispatch(fetchLiturgy(previousDate));

    const previousId = format(previousDate, 'yMMdd');
    const previousLiturgy = selectLiturgyById(getState(), previousId);

    if (!previousLiturgy) {
      return null;
    }

    const currentBlockIndex = currentLiturgy.blocks.findIndex(
      (block) => block.id === currentBlock.id,
    );
    const currentBlockNumber = currentLiturgy.blocks
      .filter((block) => block.type === currentBlock.type)
      .findIndex((block) => block.id === currentBlock.id);

    const sameTypeBlocks = previousLiturgy.blocks.filter(
      (block) => block.type === currentBlock.type,
    );

    if (sameTypeBlocks.length === 0) {
      return null;
    }

    const previousBlock =
      sameTypeBlocks[currentBlockNumber] || sameTypeBlocks.pop();

    currentLiturgy.blocks[currentBlockIndex].data = cloneDeep(
      previousBlock.data,
    );

    return dispatch(setLiturgy(currentLiturgy));
  },
);

const liturgiesSlice = createSlice({
  name: 'liturgies',
  initialState: liturgiesAdapter.getInitialState(),
  reducers: {
    setLiturgy(state, action) {
      const { id, ...changes } = action.payload;
      liturgiesAdapter.updateOne(state, { id, changes });
    },
    addLiturgyBlock(state, action) {
      const { id, index, data } = action.payload;
      state.entities[id].blocks.splice(index, 0, data);
    },
    removeLiturgyBlock(state, action) {
      console.log(action);
      const { id, index } = action.payload;
      state.entities[id].blocks.splice(index, 1);
    },
  },
  extraReducers: {
    [fetchLiturgy.fulfilled]: (state, action) => {
      liturgiesAdapter.upsertMany(state, action.payload.entities.liturgies);
    },
    [persistLiturgy.fulfilled]: (state, action) => {
      const { id, ...changes } = action.payload;
      liturgiesAdapter.updateOne(state, { id, changes });
    },
  },
});

export const {
  selectById: selectLiturgyById,
  selectIds: selectLiturgyIds,
  selectEntities: selectLiturgyEntities,
  selectAll: selectAllLiturgies,
  selectTotal: selectTotalLiturgies,
} = liturgiesAdapter.getSelectors((state) => state.liturgies);

export const {
  setLiturgy,
  addLiturgyBlock,
  removeLiturgyBlock,
} = liturgiesSlice.actions;

export default liturgiesSlice.reducer;
