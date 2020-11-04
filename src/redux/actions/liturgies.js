import { format, subDays } from 'date-fns';
import cloneDeep from 'lodash/cloneDeep';
import { createDefaultLiturgy } from '../../utils/defaults';
import migrate from '../../utils/migrate';
import { validate } from '../../utils/liturgy';

export const LITURGIES_FETCH = 'liturgies/FETCH';
export const LITURGIES_PERSISTING = 'liturgies/PERSISTING';
export const LITURGIES_PERSISTED = 'liturgies/PERSISTED';
export const LITURGIES_SET = 'liturgies/SET';
export const LITURGIES_ADD_BLOCK = 'liturgies/LITURGIES_ADD_BLOCK';
export const LITURGIES_REMOVE_BLOCK = 'liturgies/LITURGIES_REMOVE_BLOCK';

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

    if (!validate(liturgies[id])) {
      return null;
    }

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

export function removeBlock(id, position) {
  return {
    type: LITURGIES_REMOVE_BLOCK,
    id,
    position,
  };
}

export function fillBlockFromPreviousWeek(id, currentBlock) {
  return async (dispatch, getState) => {
    let { liturgies } = getState();
    const currentLiturgy = liturgies[id].data;
    const currentDate = currentLiturgy.date;
    const previousDate = subDays(currentDate, 7);

    await dispatch(fetchLiturgy(previousDate));

    liturgies = getState().liturgies;
    const previousId = format(previousDate, 'yMMdd');
    const previousLiturgy = liturgies[previousId];

    if (!previousLiturgy) {
      return null;
    }

    const currentBlockIndex = currentLiturgy.blocks.findIndex(
      (block) => block.id === currentBlock.id,
    );
    const currentBlockNumber = currentLiturgy.blocks
      .filter((block) => block.type === currentBlock.type)
      .findIndex((block) => block.id === currentBlock.id);

    const sameTypeBlocks = previousLiturgy.data.blocks.filter(
      (block) => block.type === currentBlock.type,
    );

    if (sameTypeBlocks.length === 0) {
      return null;
    }

    const previousBlock =
      sameTypeBlocks[currentBlockNumber] || sameTypeBlocks.pop();

    currentLiturgy.blocks[currentBlockIndex].data = cloneDeep(
      previousBlock.data,
    );

    return dispatch(setLiturgy(id, currentLiturgy));
  };
}
