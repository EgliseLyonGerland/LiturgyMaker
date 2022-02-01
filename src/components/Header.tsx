import React from 'react';

import { Box, Link, useTheme } from '@mui/material';
import { NavLink } from 'react-router-dom';

interface Props {
  links: HeaderLink[];
}

interface HeaderLink {
  title: string;
  path: string;
}

function Header({ links }: Props) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: theme.palette.tertiary.dark,
        height: 60,
        top: 0,
        left: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 5),
      }}
    >
      <Box fontWeight="bold" fontSize="1.1em" mr={4}>
        LiturgyMaker
      </Box>

      {links.map((link, index) => (
        <Box key={index} mx={1}>
          <Link component={NavLink} to={link.path} underline="hover">
            {link.title}
          </Link>
        </Box>
      ))}
    </Box>
  );
}

export default Header;
