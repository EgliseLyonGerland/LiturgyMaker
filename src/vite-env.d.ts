/// <reference types="vite/client" />

declare module '@mui/material/styles' {
  interface Theme {}

  interface Palette {
    paper?: {
      background: string
      border: string
    }
  }
}

interface ImportMetaEnv {
  readonly VITE_SLIDESHOW_ENABLED: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
