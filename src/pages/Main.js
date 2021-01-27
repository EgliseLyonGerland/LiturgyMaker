import React, { Suspense, lazy } from 'react';
import { Box } from '@material-ui/core';
import { Switch, Route, useHistory } from 'react-router-dom';
import Header from '../components/Header';

const LiturgiesPage = lazy(() => import('./Liturgies'));
const SongsPage = lazy(() => import('./Songs'));

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

      <Box pt={12}>
        <Suspense fallback={<div />}>
          <Switch>
            <Route path="/" exact>
              <LiturgiesPage />
            </Route>
            <Route path="/songs" exact>
              <SongsPage />
            </Route>
          </Switch>
        </Suspense>
      </Box>
    </div>
  );
};

export default Main;
