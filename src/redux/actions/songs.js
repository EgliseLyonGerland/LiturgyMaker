export const SONGS_FETCH = 'songs/FETCH';

export function fetchSongs() {
  return async (dispatch, getState, { firebase }) => {
    await dispatch({
      type: SONGS_FETCH,
      loading: true,
      loaded: false,
      data: [],
    });

    const db = firebase.firestore();
    const { docs } = await db.collection(`songs`).get();
    const data = docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return dispatch({
      type: SONGS_FETCH,
      loading: false,
      loaded: true,
      data,
    });
  };
}
