import type rootReducer from './redux/slices';

export type RootState = ReturnType<typeof rootReducer>;

export type BlockType =
  | 'announcements'
  | 'reading'
  | 'section'
  | 'sermon'
  | 'songs'
  | 'recitation'
  | 'openDoors';

export interface AnnouncementsItem {
  title: string;
  detail: string;
}

export interface AnnouncementsBlockData {
  items: AnnouncementsItem[];
}

export interface OpenDoorsBlockData {
  title: string;
  detail: string;
  prayerTopics: { text: string }[];
}

export interface ReadingBlockData {
  bibleRefs: {
    id: string;
    excerpt: string;
  }[];
}

export interface RecitationBlockData {
  id: string;
  infos: string;
}

export interface SectionBlockData {
  title: string;
}

export interface SermonBlockData {
  title: string;
  author: string;
  bibleRefs: { id: string }[];
  plan: { text: string }[];
}

export interface SongsItem {
  id: string;
  infos: string;
  repeat: boolean;
}

export interface SongsBlockData {
  items: SongsItem[];
}

export interface Block<T extends BlockType, U> {
  type: T;
  data: U;
  title: string;
}

export type LiturgyBlock =
  | Block<'announcements', AnnouncementsBlockData>
  | Block<'reading', ReadingBlockData>
  | Block<'section', SectionBlockData>
  | Block<'sermon', SermonBlockData>
  | Block<'songs', SongsBlockData>
  | Block<'recitation', RecitationBlockData>
  | Block<'openDoors', OpenDoorsBlockData>;

export interface LiturgyDocument {
  id: number;
  uid: string;
  version: number;
  blocks: LiturgyBlock[];
}

export interface RecitationDocument {
  id: string;
  title: string;
  content: { text: string }[];
}

export type LyricType = 'verse' | 'chorus';

export interface LyricPart {
  type: LyricType;
  text: string;
}

export interface SongDocument {
  id: string;
  title: string;
  aka: string;
  authors: string;
  copyright: string;
  collection: string;
  translation: string;
  number: string;
  previewUrl: string;
  lyrics: LyricPart[];
}

export interface FormFieldProps {
  name: string;
  disabled: boolean;
}
