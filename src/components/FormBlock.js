import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { Box } from '@material-ui/core';
import { blockTypes } from '../config/global';

const FormBlock = ({
  block,
  onRemoveBlockClicked,
  onFillFromLastWeekClicked,
  children,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  function handleToggle(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleClick(fn) {
    handleClose();
    fn();
  }

  return (
    <Box bgcolor="background.paper" borderRadius={16}>
      <Box
        height={72}
        pl={5}
        pr={3}
        display="flex"
        alignItems="center"
        bgcolor="background.dark"
        borderRadius="16px 16px 0 0"
      >
        <Typography variant="h6">
          {blockTypes[block.type]}
          {' \u00A0'}
          <Typography component="span" variant="subtitle1">
            {block.title}
          </Typography>
        </Typography>

        <Box ml="auto">
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleToggle}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={!!anchorEl}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleClick(onRemoveBlockClicked)}>
            Supprimer
          </MenuItem>
          <MenuItem onClick={() => handleClick(onFillFromLastWeekClicked)}>
            Remplir à partir de la semaine précédente
          </MenuItem>
        </Menu>
      </Box>
      <Box p={5} px={8}>
        {children}
      </Box>
    </Box>
  );
};

FormBlock.propTypes = {
  block: PropTypes.shape({
    type: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  onRemoveBlockClicked: PropTypes.func,
  onFillFromLastWeekClicked: PropTypes.func,
  children: PropTypes.any,
};

export default FormBlock;
