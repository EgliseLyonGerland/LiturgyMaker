import { format, subDays } from 'date-fns';
import cloneDeep from 'lodash/cloneDeep';
import { createDefaultLiturgy } from '../../utils/defaults';
import migrate from '../../utils/migrate';

export const LITURGIES_FETCH = 'liturgies/FETCH';
export const LITURGIES_PERSISTING = 'liturgies/PERSISTING';
export const LITURGIES_PERSISTED = 'liturgies/PERSISTED';
export const LITURGIES_SET = 'liturgies/SET';
export const LITURGIES_ADD_BLOCK = 'liturgies/LITURGIES_ADD_BLOCK';

export function fetchLiturgy(date) {
  const id = format(date, 'yMMdd');

  return async (dispatch, getState, { firebase }) => {
    const { liturgies } = getState();

    if (liturgies[id]) {
      return null;
    }

    await dispatch({
      type: LITURGIES_FETCH,
      id,
      loading: true,
      data: null,
    });

    const db = firebase.firestore();
    const doc = await db.doc(`liturgies/${id}`).get();

    let data;
    if (doc.exists) {
      data = migrate(doc.data());
    } else {
      data = createDefaultLiturgy({ date });
    }

    return dispatch({
      type: LITURGIES_FETCH,
      id,
      data,
      loading: false,
    });
  };
}

export function persistLiturgy(id) {
  return async (dispatch, getState, { firebase }) => {
    const { liturgies } = getState();
    const db = firebase.firestore();
    const { uid } = firebase.auth().currentUser;

    dispatch({ type: LITURGIES_PERSISTING, id });

    await db
      .collection('liturgies')
      .doc(id)
      .set({
        ...liturgies[id].data,
        uid,
      });

    return dispatch({ type: LITURGIES_PERSISTED, id });
  };
}

export function setLiturgy(id, data) {
  return {
    type: LITURGIES_SET,
    id,
    data,
  };
}

export function addBlock(id, position, data) {
  return {
    type: LITURGIES_ADD_BLOCK,
    id,
    data,
    position,
  };
}

export function fillBlockFromPreviousWeek(id, blockIndex) {
  return async (dispatch, getState) => {
    let { liturgies } = getState();
    const currentLiturgy = liturgies[id].data;
    const currentDate = currentLiturgy.date;
    const currentBlock = currentLiturgy.blocks[blockIndex];
    const previousDate = subDays(currentDate, 7);

    await dispatch(fetchLiturgy(previousDate));

    liturgies = getState().liturgies;
    const previousId = format(previousDate, 'yMMdd');
    const previousLiturgy = liturgies[previousId].data;
    const previousBlock = previousLiturgy.blocks[blockIndex];

    if (!previousBlock || currentBlock.type !== previousBlock.type) {
      return null;
    }

    currentLiturgy.blocks[blockIndex].data = cloneDeep(previousBlock.data);

    return dispatch(setLiturgy(id, currentLiturgy));
  };
}
