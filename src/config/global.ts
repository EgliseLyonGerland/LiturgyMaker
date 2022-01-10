export const currentVersion = 8;

export const blockTypes = {
  announcements: 'Annonces',
  openDoors: 'Portes Ouvertes',
  reading: 'Lecture',
  recitation: 'Récitation',
  section: 'Section',
  sermon: 'Prédication',
  songs: 'Chants',
};

export const slideshowEnabled: boolean =
  process.env.REACT_APP_SLIDESHOW_ENABLED !== 'false';
