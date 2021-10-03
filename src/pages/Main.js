import React, { Suspense, lazy } from 'react';

import { Box } from '@material-ui/core';
import { Switch, Route, useHistory, Redirect } from 'react-router-dom';

import Header from '../components/Header';
import { getNextLiturgyId } from '../utils/liturgy';

const LiturgyEditPage = lazy(() => import('./LiturgyEdit'));
const SongsPage = lazy(() => import('./Songs'));
const SongEditPage = lazy(() => import('./SongEdit'));

const Main = () => {
  const history = useHistory();

  return (
    <div>
      <Header
        links={[
          { title: 'Liturgies', path: '/' },
          { title: 'Chants', path: '/songs' },
        ]}
        onClick={(link) => history.push(link.path)}
      />

      <Box pt={12} pb={12}>
        <Suspense fallback={<div />}>
          <Switch>
            <Route path="/" exact>
              <Redirect to={`/liturgies/${getNextLiturgyId()}/edit`} />
            </Route>
            <Route path="/liturgies/:liturgyId/edit" exact>
              <LiturgyEditPage />
            </Route>
            <Route path="/songs" exact>
              <SongsPage />
            </Route>
            <Route path="/songs/:songId/edit" exact>
              <SongEditPage />
            </Route>
          </Switch>
        </Suspense>
      </Box>
    </div>
  );
};

export default Main;
