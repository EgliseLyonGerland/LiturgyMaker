import React from 'react';

import { Box, LinearProgress } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Header from './Header';

function MainLayout() {
  return (
    <div>
      <Box sx={{ position: 'sticky', top: '0', mb: 4, zIndex: 'appBar' }}>
        <Header
          links={[
            { title: 'Liturgies', path: '/' },
            { title: 'Chants', path: '/songs' },
          ]}
        />
        <LinearProgress sx={{ visibility: 'hidden' }} />
      </Box>

      <Outlet />
    </div>
  );
}

export default MainLayout;
