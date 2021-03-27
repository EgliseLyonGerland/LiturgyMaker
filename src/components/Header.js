import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Link } from '@material-ui/core';

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

const Header = ({ links, onClick }) => {
  const classes = useStyles();

  const handleClick = (event, link) => {
    event.preventDefault();
    onClick(link);
  };

  return (
    <div className={classes.root}>
      <Box fontWeight="bold" fontSize="1.1em" mr={4}>
        LiturgyMaker
      </Box>

      {links.map((link, index) => (
        <Box key={index} mx={1}>
          <Link href="#" onClick={(event) => handleClick(event, link)}>
            {link.title}
          </Link>
        </Box>
      ))}
    </div>
  );
};

Header.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  ),
  onClick: PropTypes.func,
};

export default Header;
