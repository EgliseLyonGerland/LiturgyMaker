import { combineReducers } from 'redux';
import liturgies from './liturgies';
import recitations from './recitations';
import songs from '../slices/songs';

const rootReducer = combineReducers({
  liturgies,
  songs,
  recitations,
});

export default rootReducer;
