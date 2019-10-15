export const documentWidth = 1920;
export const documentHeight = 1080;

export const fontFamilies = {
  sourceSansProp: 'Source Sans Pro',
  crimsonText: 'Crimson Text',
};

export const typography = {
  title: {
    fontFamily: fontFamilies.sourceSansProp,
    fontSize: 90,
    fontWeight: 900,
  },
  announcementTitle: {
    fontFamily: fontFamilies.sourceSansProp,
    fontSize: 90,
    fontWeight: 900,
  },
  announcementPage: {
    fontFamily: fontFamilies.sourceSansProp,
    fontSize: 50,
    fontWeight: 600,
  },
  announcementItemTitle: {
    fontFamily: fontFamilies.sourceSansProp,
    fontSize: 50,
    fontWeight: 700,
  },
  announcementItemDetail: {
    fontFamily: fontFamilies.sourceSansProp,
    fontSize: 40,
    fontWeight: 600,
    opacity: 70,
  },
  verseTitle: {
    fontFamily: fontFamilies.sourceSansProp,
    fontSize: 90,
    fontWeight: 900,
  },
  verseSubtitle: {
    fontFamily: fontFamilies.sourceSansProp,
    fontSize: 90,
    fontWeight: 400,
    opacity: 80,
  },
  verseExcerpt: {
    fontFamily: fontFamilies.crimsonText,
    fontStyle: 'italic',
    fontSize: 100,
  },
  songTitle: {
    fontFamily: fontFamilies.crimsonText,
    fontStyle: 'italic',
    fontSize: 90,
  },
  chapterTitle: {
    fontFamily: fontFamilies.sourceSansProp,
    fontSize: 90,
    fontWeight: 900,
  },
  sermonTitle: {
    fontFamily: fontFamilies.crimsonText,
    fontStyle: 'italic',
    fontSize: 80,
  },
  sermonBibleRef: {
    fontFamily: fontFamilies.sourceSansProp,
    fontSize: 60,
    fontWeight: 700,
    opacity: 70,
  },
  sermonAuthor: {
    fontFamily: fontFamilies.sourceSansProp,
    fontSize: 40,
    fontWeight: 600,
    opacity: 50,
  },
  sermonPlanNumber: {
    fontFamily: fontFamilies.sourceSansProp,
    fontSize: 220,
    fontWeight: 900,
    fontStyle: 'italic',
    opacity: 20,
  },
  sermonPlanTitle: {
    fontFamily: fontFamilies.crimsonText,
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
