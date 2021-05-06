import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ButtonBase } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import classnames from 'classnames';

import { blockTypes } from '../config/global';

const useStyles = makeStyles(
  (theme) => ({
    root: {
      position: 'relative',
      height: 1,
      display: 'flex',
      alignItems: 'center',
      margin: theme.spacing(4, 0),
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
          'linear-gradient(to right, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0) 0%)',
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

      '&:hover:not($disabled)': {
        opacity: 1,
      },
    },
    disabled: {},
    addButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      background: 'rgba(255,255,255,0.1)',
    },
  }),
  { name: 'Divider' },
);

const Divider: React.FC<{
  onBlockSelected(block: string): void;
  disabled?: boolean;
}> = ({ onBlockSelected, disabled = false }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (block: string) => {
    handleClose();
    onBlockSelected(block);
  };

  return (
    <div className={classes.root}>
      <div
        className={classnames(classes.inner, { [classes.disabled]: disabled })}
      >
        <ButtonBase
          className={classes.addButton}
          title="Ajouter un bloc"
          disabled={disabled}
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

export default Divider;
