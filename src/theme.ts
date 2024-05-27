import type { PaletteMode } from '@mui/material'
import { alpha, createTheme, darken, lighten } from '@mui/material'
import { blue, pink } from '@mui/material/colors'

export const background = {
  light: '#f8f8f8',
  dark: '#00162d',
}

export const paper = {
  light: '#fff',
  dark: '#001e3c',
}

const defaultPalette = {
  primary: {
    main: blue[500],
  },
  secondary: {
    main: pink[500],
  },
}

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
    header: darken(paper.light, 0.07),
    border: alpha('#000', 0.03),
  },
}

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
    border: alpha('#fff', 0.08),
  },
}

export function buildTheme(mode: PaletteMode) {
  return {
    palette: {
      mode,
      ...defaultPalette,
      ...(mode === 'light' ? lightPalette : darkPalette),
    },
  }
}

export const lightTheme = createTheme(buildTheme('light'))
export const darkTheme = createTheme(buildTheme('dark'))
