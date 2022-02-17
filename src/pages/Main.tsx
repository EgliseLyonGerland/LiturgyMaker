import React, { Suspense, lazy } from 'react';

import { Box } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';

import MainLayout from '../components/MainLayout';
import { getNextLiturgyId } from '../utils/liturgy';

const LiturgyEditPage = lazy(() => import('./LiturgyEdit'));
const SongsPage = lazy(() => import('./Songs'));
const SongEditPage = lazy(() => import('./SongEdit'));
const SlideshowPage = lazy(() => import('./Slideshow'));

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
      <Route path="/slideshow" element={<SlideshowPage />} />

      <Route
        element={
          <Suspensed>
            <MainLayout />
          </Suspensed>
        }
      >
        <Route
          path="/liturgies/:liturgyId/edit"
          element={
            <Suspensed>
              <LiturgyEditPage />
            </Suspensed>
          }
        />
        <Route
          path="/songs"
          element={
            <Suspensed>
              <SongsPage />
            </Suspensed>
          }
        />
        <Route
          path="/songs/:songId/edit"
          element={
            <Suspensed>
              <SongEditPage />
            </Suspensed>
          }
        />
        <Route
          path="/songs/new"
          element={
            <Suspensed>
              <SongEditPage />
            </Suspensed>
          }
        />
      </Route>
    </Routes>
  );
}

export default Main;
