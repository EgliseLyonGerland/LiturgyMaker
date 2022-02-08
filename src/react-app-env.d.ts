/// <reference types="react-scripts" />

declare module 'superagent-jsonp';

declare module '@mui/material/styles' {
  interface Theme {}

  interface Palette {
    paper?: {
      background: string;
      border: string;
    };
  }
}
