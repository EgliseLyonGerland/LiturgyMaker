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
import { SetOptional } from "type-fest";

import { db } from "../../firebase";
import type { SongDocument, RootState } from "../../types";

const defaultSong: SongDocument = {
  id: "",
  title: "",
  aka: "",
  authors: "",
  copyright: "",
  collection: "",
  translation: "",
  number: "",
  previewUrl: "",
  lyrics: [],
};

export const songEntity = new schema.Entity("songs");
export const songsEntity = new schema.Array(songEntity);

const songsAdapter = createEntityAdapter<SongDocument>();

export const fetchSongs = createAsyncThunk("songs/fetchSongs", async () => {
  const { docs } = await getDocs(query(collection(db, "songs")));

  return normalize<
    SongDocument,
    {
      songs: Record<string, SongDocument>;
    }
  >(
    docs.map((item) => ({ ...defaultSong, id: item.id, ...item.data() })),
    songsEntity,
  ).entities;
});

export const persistSong = createAsyncThunk(
  "songs/persistSong",
  async (song: SetOptional<SongDocument, "id">) => {
    if (!song.id) {
      const ref = await addDoc(collection(db, "songs"), song);
      song.id = ref.id;
    } else {
      await setDoc(doc(db, "songs", song.id), song);
    }

    return cloneDeep(song) as SongDocument;
  },
);

const songsSlice = createSlice({
  name: "songs",
  initialState: songsAdapter.getInitialState({
    status: "idle",
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSongs.fulfilled, (state, action) => {
      state.status = "success";
      songsAdapter.upsertMany(state, action.payload.songs);
    });
    builder.addCase(fetchSongs.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchSongs.rejected, (state) => {
      state.status = "fail";
    });
    builder.addCase(persistSong.fulfilled, (state, action) => {
      songsAdapter.upsertOne(state, action.payload);
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
