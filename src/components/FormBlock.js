import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { blockTypes } from '../config/global';

const options = ['Remplir à partir de la semaine précédente'];

const useStyles = makeStyles(
  (theme) => ({
    root: {
      position: 'relative',
      padding: theme.spacing(8),
    },
    title: {
      marginBottom: theme.spacing(2),
    },
    more: {
      position: 'absolute',
      top: theme.spacing(2),
      right: theme.spacing(2),
    },
  }),
  { name: 'FormBlock' },
);

const FormBlock = ({ block, onFillFromLastWeekClicked, children }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  function handleToggle(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleClick() {
    handleClose();
    onFillFromLastWeekClicked();
  }

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="h6">
        {blockTypes[block.type]}
        {' \u00A0'}
        <Typography component="span" variant="subtitle1">
          {block.title}
        </Typography>
      </Typography>

      <Fragment>
        <IconButton
          className={classes.more}
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={!!anchorEl}
          onClose={handleClose}
        >
          {options.map((option) => (
            <MenuItem key={option} onClick={handleClick}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Fragment>

      {children}
    </div>
  );
};

FormBlock.propTypes = {
  block: PropTypes.shape({
    type: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  onFillFromLastWeekClicked: PropTypes.func,
  children: PropTypes.any,
};

export default FormBlock;
