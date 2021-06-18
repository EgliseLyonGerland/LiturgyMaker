import rootReducer from './redux/slices';

declare global {
  interface CanvasRenderingContext2D {
    setFont(
      typographyName: TypographyName,
      overrides?: Partial<Typography>,
    ): void;
    getCurrentFontSize(): number;
    getCurrentLineHeight(): number;
    fillMultilineText(
      text: string,
      x: number,
      y: number,
      width: number,
    ): number;
    measureMultiligneText(
      text: string,
      maxWidth: number,
    ): { width: number; height: number };
    fillSeparator(
      x: number,
      y: number,
      horizontal?: boolean,
      align?: 'left' | 'right' | 'center',
      size?: number,
    ): void;
  }
}

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

export type ReadingTemplate =
  | 'topBottomLeft'
  | 'topBottomCenter'
  | 'topBottomRight'
  | 'bottomTopLeft'
  | 'bottomTopCenter'
  | 'bottomTopRight'
  | 'leftRightCenter'
  | 'rightLeftCenter';

export interface ReadingBlockData {
  bibleRefs: {
    ref: string;
    excerpt: string;
    template: ReadingTemplate;
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
  bibleRefs: { ref: string }[];
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

export interface LiturgyBlock<
  T =
    | AnnouncementsBlockData
    | OpenDoorsBlockData
    | ReadingBlockData
    | RecitationBlockData
    | SectionBlockData
    | SermonBlockData
    | SongsBlockData,
> {
  type: BlockType;
  data: T;
}

export interface LiturgyDocument {
  id: number;
  uid: string;
  blocks: LiturgyBlock[];
}

export interface RecitationDocument {
  id: string;
  title: string;
}

export interface LyricPart {
  type: 'verse' | 'chorus';
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
  lyrics: LyricPart[];
}

export enum FontFamily {
  sansSerif = 'Source Sans Pro',
  barlow = 'Barlow Condensed',
  serif = 'Adobe Hebrew',
}

export type TypographyName =
  | 'title'
  | 'announcementTitle'
  | 'announcementPage'
  | 'announcementItemTitle'
  | 'announcementItemDetail'
  | 'verseTitle'
  | 'verseSubtitle'
  | 'verseExcerpt'
  | 'songTitle'
  | 'chapterTitle'
  | 'sermonTitle'
  | 'sermonBibleRef'
  | 'sermonAuthor'
  | 'sermonPlanNumber'
  | 'sermonPlanTitle'
  | 'openDoorsTitle'
  | 'openDoorsDetail'
  | 'openDoorsPrayerTopicsHeadline'
  | 'openDoorsPrayerTopic';

export interface Typography {
  fontFamily: FontFamily;
  fontSize: number;
  fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 900;
  fontStyle?: 'italic';
  opacity?: number;
}
