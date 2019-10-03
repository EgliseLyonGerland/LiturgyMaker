import { combineReducers } from 'redux';
import liturgies from './liturgies';

const rootReducer = combineReducers({
  liturgies,
});

export default rootReducer;
