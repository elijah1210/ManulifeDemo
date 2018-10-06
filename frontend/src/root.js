import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';

import appReducer from './main/App.reducer';
import appEpic from './main/App.epics';

export const rootEpic = combineEpics(
  appEpic,
);

export const rootReducer = combineReducers({
  appReducer,
});
