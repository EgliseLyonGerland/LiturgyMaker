import { Box } from "@mui/material";
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

import MainLayout from "../components/MainLayout";
import { getNextLiturgyId } from "../utils/liturgy";

const LiturgyEditPage = lazy(() => import("./LiturgyEdit"));
const SongsPage = lazy(() => import("./Songs"));
const SongEditPage = lazy(() => import("./SongEdit"));
const RecitationsPage = lazy(() => import("./Recitations"));
const RecitationEditPage = lazy(() => import("./RecitationEdit"));
const SlideshowPage = lazy(() => import("./Slideshow"));

function Suspensed({ children }: { children: JSX.Element }) {
  return (
    <Suspense
      fallback={
        <Box display="flex" justifyContent="center" m={5}>
          <BeatLoader color="#DDD" />
        </Box>
      }
    >
      {children}
    </Suspense>
  );
}

function Main() {
  return (
    <Routes>
      <Route
        element={<Navigate to={`/liturgies/${getNextLiturgyId()}/edit`} />}
        index
      />
      <Route element={<SlideshowPage />} path="/slideshow" />

      <Route
        element={
          <Suspensed>
            <MainLayout />
          </Suspensed>
        }
      >
        <Route
          element={
            <Suspensed>
              <LiturgyEditPage />
            </Suspensed>
          }
          path="/liturgies/:liturgyId/edit"
        />
        <Route
          element={
            <Suspensed>
              <SongsPage />
            </Suspensed>
          }
          path="/songs"
        />
        <Route
          element={
            <Suspensed>
              <SongEditPage />
            </Suspensed>
          }
          path="/songs/:songId/edit"
        />
        <Route
          element={
            <Suspensed>
              <SongEditPage />
            </Suspensed>
          }
          path="/songs/new"
        />
        <Route
          element={
            <Suspensed>
              <RecitationsPage />
            </Suspensed>
          }
          path="/recitations"
        />
        <Route
          element={
            <Suspensed>
              <RecitationEditPage />
            </Suspensed>
          }
          path="/recitations/:recitationId/edit"
        />
        <Route
          element={
            <Suspensed>
              <RecitationEditPage />
            </Suspensed>
          }
          path="/recitations/new"
        />
      </Route>
    </Routes>
  );
}

export default Main;
