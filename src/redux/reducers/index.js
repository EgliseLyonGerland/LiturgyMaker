import { combineReducers } from 'redux';
import liturgies from './liturgies';
import songs from './songs';
import recitations from './recitations';

const rootReducer = combineReducers({
  liturgies,
  songs,
  recitations,
});

export default rootReducer;
