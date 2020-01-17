import { combineReducers } from 'redux';
import liturgies from './liturgies';
import songs from './songs';

const rootReducer = combineReducers({
  liturgies,
  songs,
});

export default rootReducer;
