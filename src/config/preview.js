export const documentWidth = 1920;
export const documentHeight = 1080;

export const fontFamilies = {
  sansSerif: 'Source Sans Pro',
  serif: 'Adobe Hebrew',
};

export const typography = {
  title: {
    fontFamily: fontFamilies.sansSerif,
    fontSize: 90,
    fontWeight: 900,
  },
  announcementTitle: {
    fontFamily: fontFamilies.sansSerif,
    fontSize: 90,
    fontWeight: 900,
  },
  announcementPage: {
    fontFamily: fontFamilies.sansSerif,
    fontSize: 50,
    fontWeight: 600,
  },
  announcementItemTitle: {
    fontFamily: fontFamilies.sansSerif,
    fontSize: 50,
    fontWeight: 700,
  },
  announcementItemDetail: {
    fontFamily: fontFamilies.sansSerif,
    fontSize: 40,
    fontWeight: 600,
    opacity: 70,
  },
  verseTitle: {
    fontFamily: fontFamilies.sansSerif,
    fontSize: 90,
    fontWeight: 900,
  },
  verseSubtitle: {
    fontFamily: fontFamilies.sansSerif,
    fontSize: 90,
    fontWeight: 400,
    opacity: 80,
  },
  verseExcerpt: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontSize: 90,
  },
  songTitle: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontSize: 90,
  },
  chapterTitle: {
    fontFamily: fontFamilies.sansSerif,
    fontSize: 90,
    fontWeight: 900,
  },
  sermonTitle: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontSize: 80,
  },
  sermonBibleRef: {
    fontFamily: fontFamilies.sansSerif,
    fontSize: 60,
    fontWeight: 700,
    opacity: 70,
  },
  sermonAuthor: {
    fontFamily: fontFamilies.sansSerif,
    fontSize: 40,
    fontWeight: 600,
    opacity: 50,
  },
  sermonPlanNumber: {
    fontFamily: fontFamilies.sansSerif,
    fontSize: 220,
    fontWeight: 900,
    fontStyle: 'italic',
    opacity: 20,
  },
  sermonPlanTitle: {
    fontFamily: fontFamilies.serif,
    fontStyle: 'italic',
    fontSize: 50,
    opacity: 80,
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
