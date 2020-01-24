export const RECITATIONS_FETCH = 'recitations/FETCH';

export function fetchRecitations() {
  return async (dispatch, getState, { firebase }) => {
    await dispatch({
      type: RECITATIONS_FETCH,
      loading: true,
      loaded: false,
      data: [],
    });

    const db = firebase.firestore();
    const { docs } = await db.collection(`recitations`).get();
    const data = docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return dispatch({
      type: RECITATIONS_FETCH,
      loading: false,
      loaded: true,
      data,
    });
  };
}
