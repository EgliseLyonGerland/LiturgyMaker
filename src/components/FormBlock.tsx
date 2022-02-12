import React, { useState } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

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
    <Box
      bgcolor="paper.background.main"
      border="solid 1px"
      borderRadius="4px"
      borderColor="paper.border"
      boxShadow="4px 4px 10px rgba(0,0,0,0.05)"
    >
      <Box
        height={72}
        pl={5}
        pr={3}
        display="flex"
        alignItems="center"
        bgcolor="paper.header"
        borderBottom="solid 1px"
        borderRadius="4px 4px 0 0"
        borderColor="paper.border"
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
            size="large"
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
