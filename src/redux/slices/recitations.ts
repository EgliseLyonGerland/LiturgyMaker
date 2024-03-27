import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { cloneDeep } from "lodash";
import { normalize, schema } from "normalizr";
import type { SetOptional } from "type-fest";

import { db } from "../../firebase";
import type { RecitationDocument, RootState } from "../../types";

export const recitationEntity = new schema.Entity<RecitationDocument>(
  "recitations",
);
export const recitationsEntity = new schema.Array(recitationEntity);

const recitationsAdapter = createEntityAdapter<RecitationDocument>();

export const fetchRecitations = createAsyncThunk(
  "recitations/fetchRecitations",
  async () => {
    const { docs } = await getDocs(query(collection(db, "recitations")));

    return normalize<
      RecitationDocument,
      {
        recitations: Record<string, RecitationDocument>;
      }
    >(
      docs.map((item) => ({ id: item.id, ...item.data() })),
      recitationsEntity,
    ).entities;
  },
);

export const persistRecitation = createAsyncThunk(
  "recitations/persistRecitation",
  async (recitation: SetOptional<RecitationDocument, "id">) => {
    if (!recitation.id) {
      const ref = await addDoc(collection(db, "recitations"), recitation);
      recitation.id = ref.id;
    } else {
      await setDoc(doc(db, "recitations", recitation.id), recitation);
    }

    return cloneDeep(recitation) as RecitationDocument;
  },
);

const recitationsSlice = createSlice({
  name: "recitations",
  initialState: recitationsAdapter.getInitialState({
    status: "idle",
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRecitations.fulfilled, (state, action) => {
      state.status = "success";
      recitationsAdapter.upsertMany(state, action.payload.recitations);
    });
    builder.addCase(fetchRecitations.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchRecitations.rejected, (state) => {
      state.status = "fail";
    });
    builder.addCase(persistRecitation.fulfilled, (state, action) => {
      recitationsAdapter.upsertOne(state, action.payload);
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
