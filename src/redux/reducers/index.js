import { combineReducers } from 'redux';
import liturgies from './liturgies';
import songs from '../slices/songs';
import recitations from '../slices/recitations';

const rootReducer = combineReducers({
  liturgies,
  songs,
  recitations,
});

export default rootReducer;
