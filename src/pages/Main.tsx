import React, { Suspense, lazy } from 'react';

import { Box } from '@material-ui/core';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import { getNextLiturgyId } from '../utils/liturgy';

const LiturgyEditPage = lazy(() => import('./LiturgyEdit'));
const SongsPage = lazy(() => import('./Songs'));
const SongEditPage = lazy(() => import('./SongEdit'));
const SlideshowPage = lazy(() => import('./Slideshow'));

const Main = () => {
  const navigate = useNavigate();

  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={`/liturgies/${getNextLiturgyId()}/edit`} />}
        ></Route>
        <Route path="/slideshow" element={<SlideshowPage />} />

        <Route
          path="*"
          element={
            <Box pt={12} pb={12}>
              <Header
                links={[
                  { title: 'Liturgies', path: '/' },
                  { title: 'Chants', path: '/songs' },
                ]}
                onClick={(link) => navigate(link.path)}
              />

              <Routes>
                <Route
                  path="/liturgies/:liturgyId/edit"
                  element={<LiturgyEditPage />}
                />
                <Route path="/songs" element={<SongsPage />} />
                <Route path="/songs/:songId/edit" element={<SongEditPage />} />
              </Routes>
            </Box>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default Main;
