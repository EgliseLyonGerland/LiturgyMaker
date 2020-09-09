import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const options = ['Remplir à partir de la semaine précédente'];

const useStyles = makeStyles(
  (theme) => ({
    root: {
      position: 'relative',
      padding: theme.spacing(6, 8),
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

const FormBlock = ({
  title = null,
  displayMenu = false,
  onFillFromLastWeekClicked,
  children,
}) => {
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
      {title && (
        <Typography className={classes.title} variant="h6">
          {title}
        </Typography>
      )}

      {displayMenu && (
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
      )}

      {children}
    </div>
  );
};

FormBlock.propTypes = {
  title: PropTypes.string,
  displayMenu: PropTypes.bool,
  onFillFromLastWeekClicked: PropTypes.func,
  children: PropTypes.any,
};

export default FormBlock;
