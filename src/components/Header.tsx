import React from 'react';

import { Box, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles(
  (theme) => ({
    root: {
      background: theme.palette.tertiary.dark,
      position: 'fixed',
      width: '100%',
      height: 60,
      top: 0,
      left: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 5),
    },
  }),
  { name: 'Header' },
);

interface Props {
  links: HeaderLink[];
}

interface HeaderLink {
  title: string;
  path: string;
}

function Header({ links }: Props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box fontWeight="bold" fontSize="1.1em" mr={4}>
        LiturgyMaker
      </Box>

      {links.map((link, index) => (
        <Box key={index} mx={1}>
          <Link component={NavLink} to={link.path}>
            {link.title}
          </Link>
        </Box>
      ))}
    </div>
  );
}

export default Header;
