import React from 'react';
import { Box } from '@material-ui/core';
import { Switch, Route, useHistory } from 'react-router-dom';
import Header from '../components/Header';
import LiturgiesPage from './Liturgies';
import SongsPage from './Songs';

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
        <Switch>
          <Route path="/" exact>
            <LiturgiesPage />
          </Route>
          <Route path="/songs" exact>
            <SongsPage />
          </Route>
        </Switch>
      </Box>
    </div>
  );
};

export default Main;
