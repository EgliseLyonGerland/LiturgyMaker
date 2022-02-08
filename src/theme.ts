import type { PaletteMode } from '@mui/material';
import { alpha, darken, lighten } from '@mui/material';
import { blue, pink } from '@mui/material/colors';

const background = {
  light: '#f8f8f8',
  dark: '#00162d',
};
const paper = {
  light: '#fff',
  dark: '#001e3c',
};

const defaultPalette = {
  primary: {
    main: blue[500],
  },
  secondary: {
    main: pink[500],
  },
};

const lightPalette = {
  text: {
    primary: lighten(paper.dark, 0.1),
    secondary: lighten(paper.dark, 0.5),
  },
  background: {
    default: background.light,
    paper: paper.light,
  },
  paper: {
    background: {
      light: lighten(paper.light, 0.1),
      main: paper.light,
      dark: darken(paper.light, 0.1),
    },
    header: lighten(paper.dark, 0.1),
    headerText: '#fff',
    border: 'transparent',
  },
};

const darkPalette = {
  background: {
    default: background.dark,
    paper: paper.dark,
  },
  paper: {
    background: {
      light: lighten(paper.dark, 0.1),
      main: paper.dark,
      dark: darken(paper.dark, 0.1),
    },
    header: darken(paper.dark, 0.1),
    headerText: '#fff',
    border: alpha('#fff', 0.08),
  },
};

export default (mode: PaletteMode) => ({
  palette: {
    mode,
    ...defaultPalette,
    ...(mode === 'light' ? lightPalette : darkPalette),
  },
});
