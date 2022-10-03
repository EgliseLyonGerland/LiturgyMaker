import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Header from './Header';

function MainLayout() {
  return (
    <>
      <Header
        links={[
          { title: 'Liturgies', path: '/' },
          { title: 'Chants', path: '/songs' },
          { title: 'Récitations', path: '/recitations' },
        ]}
      />

      <Box sx={{ mt: 4, mb: '50vh' }}>
        <Outlet />
      </Box>
    </>
  );
}

export default MainLayout;
