import React, { useState } from 'react';

import { Box } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';

interface Props {
  title: string;
  subtitle: string;
  disabled: boolean;
  children: React.ReactNode;
  onRemoveBlockClicked(): void;
  onFillFromLastWeekClicked(): void;
}

function FormBlock({
  title,
  subtitle = '',
  disabled = false,
  onRemoveBlockClicked,
  onFillFromLastWeekClicked,
  children,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  function handleClose() {
    setAnchorEl(null);
  }

  function handleClick(fn: () => void) {
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
        bgcolor="tertiary.dark"
        borderRadius="16px 16px 0 0"
      >
        <Typography variant="h6">
          {title}
          {' \u00A0'}
          <Typography component="span" variant="subtitle1">
            {subtitle}
          </Typography>
        </Typography>

        <Box ml="auto">
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            disabled={disabled}
            onClick={(event) => {
              setAnchorEl(event.currentTarget);
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={!!anchorEl}
          onClose={() => handleClose()}
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
}

export default FormBlock;
