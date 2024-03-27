import {
  Brightness4TwoTone,
  DarkModeTwoTone,
  LightModeTwoTone,
  SettingsBrightnessTwoTone,
} from "@mui/icons-material";
import type { SvgIcon } from "@mui/material";
import {
  IconButton,
  Popover,
  ToggleButtonGroup,
  ToggleButton,
  Box,
} from "@mui/material";
import * as React from "react";

import useDarkMode from "../libs/hooks/useDarkMode";

type Mode = "light" | "dark" | "system";

const options: { key: Mode; label: string; icon: typeof SvgIcon }[] = [
  {
    key: "light",
    label: "Clair",
    icon: LightModeTwoTone,
  },
  {
    key: "system",
    label: "Système",
    icon: SettingsBrightnessTwoTone,
  },
  {
    key: "dark",
    label: "Sombre",
    icon: DarkModeTwoTone,
  },
];

function ModeSwitcher() {
  const [, mode, setMode] = useDarkMode();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <IconButton aria-describedby={id} onClick={handleClick}>
        <Brightness4TwoTone sx={{ opacity: 0.7 }} />
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        id={id}
        onClose={handleClose}
        open={open}
      >
        <ToggleButtonGroup
          aria-label="Theme mode"
          exclusive
          size="small"
          value={mode}
        >
          {options.map(({ icon: Icon, ...option }) => (
            <ToggleButton
              aria-label="left aligned"
              key={option.key}
              onClick={() => setMode(option.key)}
              value={option.key}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: 1,
                }}
              >
                <Icon fontSize="small" sx={{ mr: 1 }} /> {option.label}
              </Box>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Popover>
    </>
  );
}

export default ModeSwitcher;
