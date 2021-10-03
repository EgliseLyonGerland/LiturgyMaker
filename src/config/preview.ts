import type { TypographyName, Typography } from '../types';
import { FontFamily } from '../types';

export const documentWidth = 1920;
export const documentHeight = 1080;

export const typography: Record<TypographyName, Typography> = {
  title: {
    fontFamily: FontFamily.sansSerif,
    fontSize: 90,
    fontWeight: 900,
  },
  announcementTitle: {
    fontFamily: FontFamily.sansSerif,
    fontSize: 90,
    fontWeight: 900,
  },
  announcementPage: {
    fontFamily: FontFamily.sansSerif,
    fontSize: 50,
    fontWeight: 600,
  },
  announcementItemTitle: {
    fontFamily: FontFamily.sansSerif,
    fontSize: 50,
    fontWeight: 700,
  },
  announcementItemDetail: {
    fontFamily: FontFamily.sansSerif,
    fontSize: 40,
    fontWeight: 600,
    opacity: 70,
  },
  verseTitle: {
    fontFamily: FontFamily.sansSerif,
    fontSize: 90,
    fontWeight: 900,
  },
  verseSubtitle: {
    fontFamily: FontFamily.sansSerif,
    fontSize: 90,
    fontWeight: 400,
    opacity: 80,
  },
  verseExcerpt: {
    fontFamily: FontFamily.serif,
    fontStyle: 'italic',
    fontSize: 90,
  },
  songTitle: {
    fontFamily: FontFamily.serif,
    fontStyle: 'italic',
    fontSize: 90,
  },
  chapterTitle: {
    fontFamily: FontFamily.sansSerif,
    fontSize: 90,
    fontWeight: 900,
  },
  sermonTitle: {
    fontFamily: FontFamily.serif,
    fontStyle: 'italic',
    fontSize: 80,
  },
  sermonBibleRef: {
    fontFamily: FontFamily.sansSerif,
    fontSize: 60,
    fontWeight: 700,
    opacity: 70,
  },
  sermonAuthor: {
    fontFamily: FontFamily.sansSerif,
    fontSize: 40,
    fontWeight: 600,
    opacity: 50,
  },
  sermonPlanNumber: {
    fontFamily: FontFamily.sansSerif,
    fontSize: 220,
    fontWeight: 900,
    fontStyle: 'italic',
    opacity: 20,
  },
  sermonPlanTitle: {
    fontFamily: FontFamily.serif,
    fontStyle: 'italic',
    fontSize: 50,
    opacity: 80,
  },
  openDoorsTitle: {
    fontFamily: FontFamily.barlow,
    fontWeight: 700,
    fontSize: 65,
  },
  openDoorsDetail: {
    fontFamily: FontFamily.serif,
    fontSize: 46,
  },
  openDoorsPrayerTopicsHeadline: {
    fontFamily: FontFamily.barlow,
    fontWeight: 700,
    fontSize: 55,
  },
  openDoorsPrayerTopic: {
    fontFamily: FontFamily.sansSerif,
    fontSize: 35,
  },
};

export const verseTemplates = [
  'topBottomLeft',
  'topBottomCenter',
  'topBottomRight',
  'leftRightCenter',
  'bottomTopLeft',
  'bottomTopCenter',
  'bottomTopRight',
  'rightLeftCenter',
];
