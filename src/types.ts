import rootReducer from './redux/slices';

export interface LiturgyDocument {
  id: number;
}

export interface RecitationDocument {
  id: string;
}

export interface LyricPart {
  type: 'verse' | 'chorus';
  text: string;
}

export interface SongDocument {
  id: string;
  title: string;
  authors: string;
  copyright: string;
  collection: string;
  translation: string;
  number: string;
  lyrics: LyricPart[];
}

export type RootState = ReturnType<typeof rootReducer>;
