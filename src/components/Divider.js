import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { ButtonBase } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';

import { blockTypes } from '../config/global';

const useStyles = makeStyles(
  (theme) => ({
    root: {
      position: 'relative',
      height: 1,
      display: 'flex',
      alignItems: 'center',
    },
    inner: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.6,
      width: '100%',
      zIndex: 1,
      transition: theme.transitions.create('opacity'),

      '&:before, &:after': {
        content: '""',
        position: 'absolute',
        height: 1,
        backgroundImage:
          'linear-gradient(to right, #ccc 40%, rgba(255,255,255,0) 0%)',
        backgroundPosition: 'bottom',
        backgroundSize: [[8, 1]],
        backgroundRepeat: 'repeat-x',
        top: '50%',
      },

      '&:before': {
        left: 24,
        right: '50%',
        transform: 'translateX(-24px)',
      },

      '&:after': {
        left: '50%',
        right: 24,
        transform: 'translateX(24px)',
      },

      '&:hover': {
        opacity: 1,
      },
    },
    addButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      background: '#eee',
    },
  }),
  { name: 'Divider' },
);

const Divider = ({ onBlockSelected }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (block) => {
    handleClose();
    onBlockSelected(block);
  };

  return (
    <div className={classes.root}>
      <div className={classes.inner}>
        <ButtonBase
          className={classes.addButton}
          size="small"
          title="Ajouter un bloc"
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
          }}
        >
          <AddIcon htmlColor="#aaa" />
        </ButtonBase>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {Object.entries(blockTypes).map(([name, label]) => (
            <MenuItem
              key={name}
              onClick={() => {
                handleSelect(name);
              }}
            >
              {label}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </div>
  );
};

Divider.propTypes = {
  onBlockSelected: PropTypes.func,
};

export default Divider;
